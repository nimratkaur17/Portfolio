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
  // Optional "before" screenshot shown to the left of the annotated card,
  // with a hand-drawn arrow pointing from it to the redesign.
  compareSrc?: string | null
  compareAlt?: string
  compareLabel?: string
  compareRatio?: string
}

// A single wobbled stroke plus a small hook, in the same hand-drawn style as
// the other pointer arrows on the site (see TeamDiagram's CalloutArrow).
function CompareArrow() {
  return (
    <svg className="annotated__arrow" viewBox="0 0 80 34" aria-hidden="true">
      <path d="M4 20Q40 8 70 18" fill="none" strokeLinecap="round" />
      <path d="M70 18L60 12M70 18L60 24" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AnnotatedCard({
  src,
  alt,
  ratio = '3 / 5',
  items,
  compareSrc,
  compareAlt,
  compareLabel = 'Original',
  compareRatio,
}: AnnotatedCardProps) {
  const [active, setActive] = useState<number | null>(null)
  // Separate from `active`: a pin hover opens its note for as long as the
  // pointer stays put, same as hovering the note itself, without leaving a
  // click's persistent highlight behind once the pointer moves away.
  const [hovered, setHovered] = useState<number | null>(null)
  const isOpen = (index: number) => active === index || hovered === index

  const handlePinClick = (index: number) => {
    setActive(index)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`change-${index + 1}`)
      ?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const handleNoteClick = (index: number) => {
    setActive((prev) => (prev === index ? null : index))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setActive(null)
  }

  const hasCompare = compareSrc !== undefined

  return (
    <div className={`annotated${hasCompare ? ' annotated--with-compare' : ''}`} onKeyDown={handleKeyDown}>
      {hasCompare && (
        <>
          <div className="annotated__compare">
            <ImageSlot
              src={compareSrc}
              alt={compareAlt ?? 'The original card'}
              ratio={compareRatio ?? ratio}
            />
            <p className="annotated__compare-label">{compareLabel}</p>
          </div>
          <div className="annotated__arrow-cell" aria-hidden="true">
            <CompareArrow />
          </div>
        </>
      )}

      <div className="annotated__figure">
        <ImageSlot src={src} alt={alt} ratio={ratio} />
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`annotated__pin${isOpen(index) ? ' is-active' : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` } as CSSProperties}
            aria-label={`Change ${index + 1}: ${item.title}`}
            aria-controls={`change-${index + 1}`}
            onClick={() => handlePinClick(index)}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered((prev) => (prev === index ? null : prev))}
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
            className={`annotated__item${isOpen(index) ? ' is-active' : ''}`}
          >
            <button
              type="button"
              className="annotated__item-toggle"
              aria-expanded={isOpen(index)}
              aria-controls={`change-${index + 1}-body`}
              onClick={() => handleNoteClick(index)}
            >
              <span className="annotated__num" aria-hidden="true">
                {index + 1}
              </span>
              <span className="annotated__item-title">{item.title}</span>
            </button>
            <p id={`change-${index + 1}-body`} className="annotated__item-body">
              {item.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default AnnotatedCard
