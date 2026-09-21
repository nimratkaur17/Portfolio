import { useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import ImageSlot from './ImageSlot'
import './AnnotatedCard.css'

export interface Annotation {
  title: string
  body: string
  // Pin position on the image, as a percentage from the top-left corner.
  x: number
  y: number
}

interface AnnotatedCardProps {
  src?: string | null
  alt: string
  ratio?: string
  items: Annotation[]
}

function AnnotatedCard({ src, alt, ratio = '3 / 5', items }: AnnotatedCardProps) {
  const [active, setActive] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setActive(index)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`change-${index + 1}`)
      ?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setActive(null)
  }

  return (
    <div className="annotated" onKeyDown={handleKeyDown}>
      <div className="annotated__figure">
        <ImageSlot src={src} alt={alt} ratio={ratio} />
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`annotated__pin${active === index ? ' is-active' : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` } as CSSProperties}
            aria-label={`Change ${index + 1}: ${item.title}`}
            aria-controls={`change-${index + 1}`}
            onClick={() => handleClick(index)}
            onFocus={() => setActive(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <ol className="annotated__list">
        {items.map((item, index) => (
          <li
            key={item.title}
            id={`change-${index + 1}`}
            className={`annotated__item${active === index ? ' is-active' : ''}`}
          >
            <span className="annotated__num" aria-hidden="true">
              {index + 1}
            </span>
            <p>
              <strong>{item.title}</strong> {item.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default AnnotatedCard
