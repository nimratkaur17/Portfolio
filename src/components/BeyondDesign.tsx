import { useEffect, useRef, useState } from 'react'
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

// Every vector points "up and out of the floor" - large positive ty and a
// strong positive rx, like a tile lying tilted toward the viewer below the
// frame. rotateY and depth vary a little per vector, cycled, so neighbours
// don't move identically.
const SCATTER: Scatter[] = [
  { rx: 38, ry: -10, tz: -200, ty: 260 },
  { rx: 44, ry: 8, tz: -260, ty: 320 },
  { rx: 34, ry: -6, tz: -160, ty: 220 },
  { rx: 42, ry: 12, tz: -230, ty: 290 },
]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function BeyondDesign() {
  const gridRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduceMotion) return

    const grid = gridRef.current
    if (!grid) return

    let frame = 0
    let active = false

    const applyScrollProgress = () => {
      frame = 0
      const rect = grid.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 while the grid's top is still at the bottom of the viewport,
      // 1 once it has scrolled up to ~20% from the top - the whole reveal
      // is a direct function of current scroll position, so it runs
      // forward and backward exactly as the user scrolls either way.
      const start = vh
      const end = vh * 0.2
      const overall = clamp((start - rect.top) / (start - end), 0, 1)

      tileRefs.current.forEach((tile, i) => {
        if (!tile) return
        const scatter = SCATTER[i % SCATTER.length]
        // Bottom row starts first (it's "closest" to the entry edge), top
        // row last - a gentle bottom-to-top settle rather than lockstep.
        const tileStart = ((TILES.length - 1 - i) / (TILES.length - 1)) * 0.4
        const local = clamp((overall - tileStart) / (1 - tileStart), 0, 1)
        const eased = easeOutCubic(local)
        const inv = 1 - eased

        tile.style.transform = `translate3d(0, ${scatter.ty * inv}px, ${scatter.tz * inv}px) rotateX(${scatter.rx * inv}deg) rotateY(${scatter.ry * inv}deg)`
        tile.style.opacity = String(eased)
      })

      if (active) frame = requestAnimationFrame(applyScrollProgress)
    }

    const ensureRunning = () => {
      if (!frame) frame = requestAnimationFrame(applyScrollProgress)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) ensureRunning()
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 },
    )
    observer.observe(grid)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <div className="beyond-grid" ref={gridRef}>
      {TILES.map((tile, i) => (
        <div
          key={tile.id}
          className="beyond-tile"
          role="img"
          aria-label={tile.alt}
          ref={(el) => {
            tileRefs.current[i] = el
          }}
          style={{ background: tile.gradient }}
        />
      ))}
    </div>
  )
}

export default BeyondDesign
