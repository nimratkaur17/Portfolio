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

// Base "floor tilt" per tile - depth and 3D lean, cycled so neighbours
// don't move identically. Combined below with per-column/per-row offsets
// that pull the whole group into a diamond-shaped pile: edge columns are
// dragged toward the centre, top rows dropped further down, so the final
// grid reads as having "spread apart" from a bunched stack near the
// bottom rather than each tile just rising straight up in its own cell.
const SCATTER: Scatter[] = [
  { rx: 36, ry: -8, tz: -180, ty: 150 },
  { rx: 42, ry: 8, tz: -220, ty: 190 },
  { rx: 32, ry: -6, tz: -150, ty: 130 },
  { rx: 40, ry: 10, tz: -200, ty: 170 },
]

const COLS = 5
const ROWS = Math.ceil(TILES.length / COLS)
const CENTER_COL = (COLS - 1) / 2
const COLUMN_PULL = 110 // px each column is dragged toward centre at rest
const ROW_DROP = 90 // extra px a higher row starts below its final spot
const FAN_ROTATE = 9 // deg each column-step fans the pile out

// Below this width, 3 or 2 columns push the grid to 5-8 rows - too tall to
// pin inside one screen, so that layout falls back to a plain in-flow
// reveal instead of pretending everything is visible at once.
const PIN_MIN_WIDTH = 901

// Which tile settles at which moment, independent of where it sits in the
// grid. A row-by-row order reads as a clean deterministic wipe; this fixed
// shuffle makes arrival feel scattered/abstract, the way the reference
// does, while COLUMN_PULL/ROW_DROP above still shape *where* each tile
// starts from.
const ARRIVAL_ORDER = [11, 2, 8, 14, 0, 6, 13, 4, 9, 1, 12, 5, 10, 3, 7]
const ARRIVAL_RANK = TILES.map((_, i) => ARRIVAL_ORDER.indexOf(i))
const STAGGER_SPAN = 0.6 // fraction of the scroll range spent staggering starts; the rest overlaps
const SETTLE_FRACTION = 0.55 // fraction of the pinned scroll range used to fully settle, leaving the rest as a held pause before it unpins

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function BeyondDesign() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduceMotion) return

    const wrap = wrapRef.current
    const grid = gridRef.current
    if (!wrap || !grid) return

    const pinnedQuery = window.matchMedia(`(min-width: ${PIN_MIN_WIDTH}px)`)

    let frame = 0
    let active = false

    const applyScrollProgress = () => {
      frame = 0
      const pinned = pinnedQuery.matches
      const vh = window.innerHeight
      let overall: number

      if (pinned) {
        // While pinned, the whole grid stays on screen and "overall" is
        // how far the user has scrolled through the runway - a little
        // lead-in as it approaches, then most of the pinned range. It
        // reaches 1 with room to spare (SETTLE_FRACTION) rather than
        // exactly when the section unpins, so the finished grid holds
        // still on screen for a beat instead of finishing just as it
        // scrolls away.
        const rect = wrap.getBoundingClientRect()
        const lead = vh * 0.6
        const scrollable = Math.max(rect.height - vh, 1)
        const settleDistance = lead + scrollable * SETTLE_FRACTION
        overall = clamp((lead - rect.top) / settleDistance, 0, 1)
      } else {
        // Narrower layouts aren't pinned, so the grid just scrolls past
        // normally - progress tracks the grid's own position instead.
        const rect = grid.getBoundingClientRect()
        const start = vh * 1.1
        const end = vh * 0.05
        overall = clamp((start - rect.top) / (start - end), 0, 1)
      }

      tileRefs.current.forEach((tile, i) => {
        if (!tile) return
        const scatter = SCATTER[i % SCATTER.length]
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const colDist = col - CENTER_COL

        const tileStart = pinned
          ? (ARRIVAL_RANK[i] / (TILES.length - 1)) * STAGGER_SPAN
          : ((TILES.length - 1 - i) / (TILES.length - 1)) * 0.4
        const local = clamp((overall - tileStart) / (1 - tileStart), 0, 1)
        const eased = easeOutCubic(local)
        const inv = 1 - eased

        const dx = -colDist * COLUMN_PULL * inv
        const dy = (scatter.ty + (ROWS - 1 - row) * ROW_DROP) * inv
        const dz = scatter.tz * inv
        const rx = scatter.rx * inv
        const ry = scatter.ry * inv
        const fan = colDist * FAN_ROTATE * inv
        const scale = 1 - 0.15 * inv

        tile.style.transform = `translate3d(${dx}px, ${dy}px, ${dz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${fan}deg) scale(${scale})`
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
    observer.observe(wrap)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <div className="beyond-pin-wrap" ref={wrapRef}>
      <div className="beyond-pin">
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
              style={{ background: tile.gradient, zIndex: Math.floor(i / COLS) + 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BeyondDesign
