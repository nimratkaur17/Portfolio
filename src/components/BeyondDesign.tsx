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
]

interface Scatter {
  rx: number
  ry: number
  tz: number
  ty: number
}

// Four scatter vectors, cycled, so tiles arrive from varied depths and
// angles rather than a single uniform direction - mirrors the reference:
// tiles hang tilted in 3D space before gliding flat into the grid.
const SCATTER: Scatter[] = [
  { rx: 22, ry: -18, tz: -260, ty: 46 },
  { rx: -20, ry: 16, tz: -220, ty: -38 },
  { rx: 16, ry: 22, tz: -300, ty: 32 },
  { rx: -24, ry: -14, tz: -240, ty: -28 },
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
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`beyond-grid${isRevealed ? ' is-revealed' : ''}`} ref={gridRef}>
      {TILES.map((tile, i) => {
        const scatter = SCATTER[i % SCATTER.length]
        const restRot = i % 2 === 0 ? 2 : -2

        return (
          <div
            key={tile.id}
            className="beyond-tile"
            role="img"
            aria-label={tile.alt}
            style={
              {
                background: tile.gradient,
                '--rest-rot': `${restRot}deg`,
                '--scatter-rx': `${scatter.rx}deg`,
                '--scatter-ry': `${scatter.ry}deg`,
                '--scatter-tz': `${scatter.tz}px`,
                '--scatter-ty': `${scatter.ty}px`,
                '--delay': `${i * 70}ms`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

export default BeyondDesign
