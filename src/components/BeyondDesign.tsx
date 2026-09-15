import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './BeyondDesign.css'

interface Tile {
  id: string
  alt: string
  gradient: string
}

const TILES: Tile[] = [
  {
    id: 'work-1',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-surface), var(--color-muted))',
  },
  {
    id: 'life-1',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-contrast), var(--color-muted))',
  },
  {
    id: 'work-2',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-accent), var(--color-surface))',
  },
  {
    id: 'life-2',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-muted), var(--color-contrast))',
  },
  {
    id: 'work-3',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-surface), var(--color-contrast))',
  },
  {
    id: 'life-3',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-accent), var(--color-muted))',
  },
  {
    id: 'work-4',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-contrast), var(--color-accent))',
  },
  {
    id: 'life-4',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-surface), var(--color-muted))',
  },
  {
    id: 'work-5',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-primary), var(--color-contrast))',
  },
  {
    id: 'life-5',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-muted), var(--color-surface))',
  },
  {
    id: 'work-6',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-contrast), var(--color-surface))',
  },
  {
    id: 'life-6',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-accent), var(--color-contrast))',
  },
  {
    id: 'work-7',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-muted), var(--color-accent))',
  },
  {
    id: 'life-7',
    alt: 'Placeholder — photograph taken',
    gradient: 'linear-gradient(155deg, var(--color-surface), var(--color-primary))',
  },
  {
    id: 'work-8',
    alt: 'Placeholder — work sample',
    gradient: 'linear-gradient(155deg, var(--color-contrast), var(--color-muted))',
  },
]

interface Scatter {
  rx: number
  ry: number
  tz: number
  ty: number
}

// Every vector starts BELOW the resting position (large positive ty) and
// tilted back like a floor tipped toward the viewer (positive rx), so the
// whole group reads as rising up off the bottom of the screen rather than
// drifting in from random directions. rotateY and depth vary a little per
// vector, cycled, so neighbouring tiles don't arrive as identical clones.
const SCATTER: Scatter[] = [
  { rx: 38, ry: -10, tz: -200, ty: 260 },
  { rx: 44, ry: 8, tz: -260, ty: 320 },
  { rx: 34, ry: -6, tz: -160, ty: 220 },
  { rx: 42, ry: 12, tz: -230, ty: 290 },
]

function BeyondDesign() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const el = gridRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsRevealed(true)
        observer.disconnect()
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`beyond-grid${isRevealed ? ' is-revealed' : ''}`} ref={gridRef}>
      {TILES.map((tile, i) => {
        const scatter = SCATTER[i % SCATTER.length]

        return (
          <div
            key={tile.id}
            className="beyond-tile"
            role="img"
            aria-label={tile.alt}
            style={
              {
                background: tile.gradient,
                '--scatter-rx': `${scatter.rx}deg`,
                '--scatter-ry': `${scatter.ry}deg`,
                '--scatter-tz': `${scatter.tz}px`,
                '--scatter-ty': `${scatter.ty}px`,
                '--delay': `${i * 60}ms`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

export default BeyondDesign
