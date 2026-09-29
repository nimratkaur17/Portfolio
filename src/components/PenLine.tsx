import { useEffect, useRef, useState } from 'react'
import './PenLine.css'

const NODES = ['RESEARCH', 'STRATEGY', 'DESIGN']
const CLOSING = 'clarity, carried by the system'
const TANGLE_CAPTION = 'friction behind the screen'

interface Pt {
  x: number
  y: number
}

interface Hop {
  r: number
  k: number
}

function catmullRomPath(points: Pt[]): string {
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

// One loop of the tangle is a prolate-cycloid arc: the path a point traces
// when it sits outside the rim of a circle rolling along the baseline. With
// k (the point's distance from the rolling circle's centre, as a multiple of
// its radius) greater than 1, the point briefly doubles back on itself before
// the circle carries it on - which is exactly the little backward hook and
// self-crossing at the foot of a hand-drawn loop-de-loop. Every hop starts
// and ends level on the same baseline, so they chain into one continuous
// rhythm without any extra smoothing needed.
function cycloidHop(startX: number, baselineY: number, r: number, k: number, steps: number): Pt[] {
  const pts: Pt[] = []
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    pts.push({
      x: startX + r * (t - k * Math.sin(t)),
      y: baselineY - r * k * (1 - Math.cos(t)),
    })
  }
  return pts
}

function buildTangle(startX: number, baselineY: number, hops: Hop[], stepsPerHop: number): Pt[] {
  const pts: Pt[] = [{ x: startX, y: baselineY }]
  let x = startX
  for (const hop of hops) {
    const seg = cycloidHop(x, baselineY, hop.r, hop.k, stepsPerHop)
    pts.push(...seg)
    x += hop.r * Math.PI * 2
  }
  return pts
}

// Alternating big/small loops, like a coil drawn in one continuous stroke.
const HOPS_DESKTOP: Hop[] = [
  { r: 30, k: 1.55 },
  { r: 15, k: 1.7 },
  { r: 28, k: 1.55 },
  { r: 14, k: 1.7 },
]

const HOPS_COMPACT: Hop[] = [
  { r: 10, k: 1.55 },
  { r: 5, k: 1.7 },
  { r: 9, k: 1.55 },
]

interface Geometry {
  d: string
  arrowD: string
  gradX1: number
  gradX2: number
  straightY: number
  nodeX: number[]
  endX: number
  tangleMinY: number
  captionX: number
  captionY: number
}

function buildGeometry(w: number, h: number, compact: boolean): Geometry {
  const startX = compact ? 22 : 40
  const endX = w - (compact ? 20 : 56)
  const straightY = h * (compact ? 0.46 : 0.58)
  const hops = compact ? HOPS_COMPACT : HOPS_DESKTOP
  const tangleSpanX = hops.reduce((sum, hop) => sum + hop.r * Math.PI * 2, 0)
  const tangleEndX = startX + tangleSpanX
  const straightStartX = tangleEndX + (compact ? 32 : 88)

  const tanglePts = buildTangle(startX, straightY, hops, compact ? 20 : 28)
  const last = tanglePts[tanglePts.length - 1]
  // Unwind: two waypoints that pull the wobble flat and the height level
  // before the straight section takes over.
  const unwindPts: Pt[] = [
    {
      x: tangleEndX + (straightStartX - tangleEndX) * 0.38,
      y: straightY + (last.y - straightY) * 0.4,
    },
    {
      x: tangleEndX + (straightStartX - tangleEndX) * 0.72,
      y: straightY + (last.y - straightY) * 0.1,
    },
    { x: straightStartX, y: straightY },
  ]

  const curveD = catmullRomPath([...tanglePts, ...unwindPts])
  const d = `${curveD} L${endX.toFixed(1)},${straightY.toFixed(1)}`

  // A small arrowhead just before the pen-down point, in the tangle's initial
  // direction, as though the pen just landed.
  const p0 = tanglePts[0]
  const p1 = tanglePts[1]
  const dirX = p1.x - p0.x
  const dirY = p1.y - p0.y
  const len = Math.hypot(dirX, dirY) || 1
  const ux = dirX / len
  const uy = dirY / len
  const back = compact ? 9 : 12
  const tail = { x: p0.x - ux * back, y: p0.y - uy * back }
  const wingLen = compact ? 5 : 6.5
  const perpX = -uy
  const perpY = ux
  const wing1 = { x: p0.x - ux * wingLen * 0.6 + perpX * wingLen, y: p0.y - uy * wingLen * 0.6 + perpY * wingLen }
  const wing2 = { x: p0.x - ux * wingLen * 0.6 - perpX * wingLen, y: p0.y - uy * wingLen * 0.6 - perpY * wingLen }
  const arrowD = `M${wing1.x.toFixed(1)},${wing1.y.toFixed(1)} L${tail.x.toFixed(1)},${tail.y.toFixed(1)} L${wing2.x.toFixed(1)},${wing2.y.toFixed(1)}`

  const straightLen = endX - straightStartX
  const fracs = compact ? [0.22, 0.78] : [0.33, 0.58, 0.83]
  const nodeX = fracs.map((f) => straightStartX + straightLen * f)

  const tangleMinY = Math.min(...tanglePts.map((p) => p.y))
  const captionX = compact ? startX : startX + tangleSpanX / 2
  const captionY = straightY + (compact ? 30 : 34)

  return {
    d,
    arrowD,
    gradX1: tangleEndX,
    gradX2: straightStartX,
    straightY,
    nodeX,
    endX,
    tangleMinY,
    captionX,
    captionY,
  }
}

function PenLine() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1200)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.getBoundingClientRect().width
      if (w) setWidth(w)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const compact = width < 760
  const nodes = compact ? NODES.slice(0, 2) : NODES
  const height = compact ? 190 : 210
  const geo = buildGeometry(width, height, compact)
  const strokeWidth = compact ? 2.2 : 2.6

  return (
    <div className="pen-line" ref={wrapRef}>
      <svg
        className="pen-line__svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-labelledby="pen-line-title pen-line-desc"
        focusable="false"
      >
        <title id="pen-line-title">A hand-drawn line unwinding into a clear path</title>
        <desc id="pen-line-desc">
          A tangled, scribbled pen line unwinds and straightens through research, design and
          strategy, ending in a single clear line: clarity, carried by the system.
        </desc>
        <defs>
          <linearGradient
            id="pen-line-gradient"
            gradientUnits="userSpaceOnUse"
            x1={geo.gradX1}
            y1="0"
            x2={geo.gradX2}
            y2="0"
          >
            <stop offset="0" style={{ stopColor: 'var(--color-text)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-contrast)' }} />
          </linearGradient>
        </defs>
        <path
          className="pen-line__stroke"
          d={geo.d}
          fill="none"
          stroke="url(#pen-line-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="pen-line__arrow"
          d={geo.arrowD}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {nodes.map((label, i) => (
          <g key={label}>
            <circle
              className="pen-line__node"
              cx={geo.nodeX[i]}
              cy={geo.straightY}
              r={compact ? 4 : 5}
              strokeWidth={2}
            />
            <text
              x={geo.nodeX[i]}
              y={compact ? geo.straightY + 22 : geo.straightY - 18}
              textAnchor="middle"
              className="pen-line__label"
            >
              {label}
            </text>
          </g>
        ))}
        <circle className="pen-line__end" cx={geo.endX} cy={geo.straightY} r={compact ? 4.5 : 5.5} />
        <text
          x={geo.endX}
          y={geo.straightY + (compact ? 52 : 30)}
          textAnchor="end"
          className="pen-line__closing"
        >
          {CLOSING}
        </text>
        <text
          x={geo.captionX}
          y={geo.captionY}
          textAnchor={compact ? 'start' : 'middle'}
          className="pen-line__caption"
        >
          {TANGLE_CAPTION}
        </text>
      </svg>
    </div>
  )
}

export default PenLine
