import { useEffect, useMemo, useRef, useState } from 'react'
import './Weave.css'

interface Pt {
  x: number
  y: number
}

type Side = 'left' | 'top' | 'right' | 'bottom'

interface ThreadSpec {
  id: string
  label: string
  color: string
  side: Side
}

// Four disciplines, one thread each. Colours are the site's own tokens.
const THREADS: ThreadSpec[] = [
  { id: 'psychology', label: 'PSYCHOLOGY', color: 'var(--color-primary)', side: 'left' },
  { id: 'data', label: 'DATA SCIENCE', color: 'var(--color-contrast)', side: 'top' },
  { id: 'information', label: 'INFORMATION SCIENCE', color: 'var(--color-muted)', side: 'right' },
  { id: 'digital', label: 'DIGITAL STUDIES', color: 'var(--color-accent)', side: 'bottom' },
]

// Where a thread comes in from, and (optionally) a waypoint it must run
// through first, so it can travel along a gap instead of across text.
interface Entry {
  E: Pt
  via?: { pt: Pt; dir: Pt }
  // Join the ring at this angle and direction instead of searching.
  start?: { theta0: number; dir: 1 | -1 }
}

interface Layout {
  W: number
  H: number
  cx: number
  cy: number
  R: number
  compact: boolean
  entries: Partial<Record<Side, Entry>>
  labelExtras: boolean
  xMin: number
  xMax: number
}

interface Strand {
  spec: ThreadSpec
  pts: Pt[]
  hw: number[] // half width at each sample
  dir: Pt[] // unit tangent at each sample
}

interface Crossing {
  over: number // strand index that passes over
  under: number
  overIdx: number
  underIdx: number
  sin: number
  pt: Pt
}

const STEP = 2.5
const SPIRAL_DESKTOP = 34
const SPIRAL_COMPACT = 26
const SIDE_ANGLE: Record<Side, number> = { left: Math.PI, top: 1.5 * Math.PI, right: 0, bottom: 0.5 * Math.PI }
const SAG: Record<Side, number> = { left: 0.02, top: -0.07, right: 0.06, bottom: -0.06 }

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)
const unit = (v: Pt): Pt => {
  const l = Math.hypot(v.x, v.y) || 1
  return { x: v.x / l, y: v.y / l }
}

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt[] {
  const len = dist(p0, p1) + dist(p1, p2) + dist(p2, p3)
  const n = Math.max(8, Math.ceil(len / STEP))
  const out: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const u = 1 - t
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    })
  }
  return out
}

// Deliberately not a circle: an off-round shape with a couple of low harmonics.
const shape = (theta: number) => 1 + 0.05 * Math.sin(theta + 0.8) + 0.03 * Math.sin(3 * theta + 2.1)

function buildStrands(layout: Layout, threads: ThreadSpec[]): Strand[] {
  const { cx, cy, R, entries, compact } = layout
  const wMax = compact ? 4.4 : 5.2
  const amp = compact ? 8 : 11
  const spiralR = compact ? SPIRAL_COMPACT : SPIRAL_DESKTOP
  const spiralSweep = 1.0
  const n = threads.length

  const ringPoint = (theta: number, r: number): Pt => ({
    x: cx + r * Math.cos(theta) * 1.05,
    y: cy + r * Math.sin(theta) * 0.965,
  })

  return threads.map((spec, k) => {
    const phi = k * (n === 2 ? Math.PI : Math.PI / 2)
    const psi = k * 1.7 + 0.4
    const entry = entries[spec.side] as Entry
    const E = entry.E
    const source = entry.via ? entry.via.pt : E
    const radius = (theta: number) =>
      R * shape(theta) + amp * Math.sin(2 * theta + phi) + 2.2 * Math.sin(theta + psi)

    // Pick the direction and start angle so the thread arrives tangentially
    // from the side it enters.
    let best = { dir: 1, theta0: SIDE_ANGLE[spec.side], score: -Infinity }
    if (entry.start) best = { ...entry.start, score: 0 }
    for (const dir of entry.start ? [] : [1, -1]) {
      for (let a = 0; a < 48; a++) {
        const theta0 = (a / 48) * Math.PI * 2
        const c = Math.cos(theta0)
        const s = Math.sin(theta0)
        const facing =
          spec.side === 'left' ? -c : spec.side === 'right' ? c : spec.side === 'top' ? -s : s
        if (facing < 0.15) continue
        const P0 = ringPoint(theta0, radius(theta0) + spiralR)
        if (P0.x < layout.xMin || P0.x > layout.xMax) continue
        const T = dir === 1 ? { x: -s, y: c } : { x: s, y: -c }
        const v = unit({ x: P0.x - source.x, y: P0.y - source.y })
        let dTheta = Math.abs(theta0 - SIDE_ANGLE[spec.side])
        dTheta = Math.min(dTheta, Math.PI * 2 - dTheta)
        const score = T.x * v.x + T.y * v.y - 0.35 * (dTheta / Math.PI)
        if (score > best.score) best = { dir, theta0, score }
      }
    }

    // Ring part: spirals in from outside, then once around (short of closing).
    const total = Math.PI * 2 - 0.4 + spiralSweep
    const ring: Pt[] = []
    const dTau = STEP / (R * 0.98)
    for (let tau = 0; tau <= total; tau += dTau) {
      const theta = best.theta0 + best.dir * tau
      const u = Math.min(1, tau / spiralSweep)
      const bonus = spiralR * Math.pow(1 - u, 2.2)
      ring.push(ringPoint(theta, radius(theta) + bonus))
    }

    // Approach: run along the via line (if any), then an irregular curve to
    // the spiral start.
    const P0 = ring[0]
    const T0 = unit({ x: ring[3].x - ring[0].x, y: ring[3].y - ring[0].y })
    const d = dist(source, P0)
    const c2 = { x: P0.x - T0.x * 0.38 * d, y: P0.y - T0.y * 0.38 * d }
    let c1: Pt
    const approach: Pt[] = []
    if (entry.via) {
      // Straight run with a hand-drawn wobble.
      const run = dist(E, source)
      const steps = Math.ceil(run / STEP)
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        approach.push({
          x: E.x + (source.x - E.x) * t,
          y: E.y + (source.y - E.y) * t + 2.4 * (1 - t) * (1 - t) * Math.sin((t * run) / 46 + k),
        })
      }
      c1 = { x: source.x + entry.via.dir.x * 0.4 * d, y: source.y + entry.via.dir.y * 0.4 * d }
    } else {
      const base = { x: E.x + (c2.x - E.x) * 0.4, y: E.y + (c2.y - E.y) * 0.4 }
      const perp = unit({ x: -(c2.y - E.y), y: c2.x - E.x })
      const sag = SAG[spec.side] * d
      c1 = { x: base.x + perp.x * sag, y: base.y + perp.y * sag }
    }
    const curve = cubic(source, c1, c2, P0)
    curve.pop()
    approach.push(...curve)

    const pts = [...approach, ...ring]

    // Tangents.
    const dir = pts.map((_, i) => {
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(pts.length - 1, i + 1)]
      return unit({ x: b.x - a.x, y: b.y - a.y })
    })

    // Tapered width: thick through the middle, thin at both ends, with a
    // little irregularity along the way.
    let length = 0
    const cum = pts.map((p, i) => (i === 0 ? 0 : (length += dist(p, pts[i - 1]))))
    const hw = pts.map((_, i) => {
      const u = cum[i] / length
      const smooth = (a: number, b: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
        return t * t * (3 - 2 * t)
      }
      // Thin at the edge it enters, full through the ring, tucked at the tip.
      const taper = 0.16 + 0.84 * smooth(0, 0.3, u) * smooth(1, 0.94, u)
      const wobble = 1 + 0.06 * Math.sin(cum[i] / 21 + k * 2.3)
      return 0.5 * wMax * taper * wobble
    })

    return { spec, pts, hw, dir }
  })
}

function ribbon(s: Strand, i0: number, i1: number, extra: number): string {
  const left: string[] = []
  const right: string[] = []
  for (let i = i0; i <= i1; i++) {
    const p = s.pts[i]
    const n = { x: -s.dir[i].y, y: s.dir[i].x }
    const w = s.hw[i] + extra
    left.push(`${(p.x + n.x * w).toFixed(1)} ${(p.y + n.y * w).toFixed(1)}`)
    right.push(`${(p.x - n.x * w).toFixed(1)} ${(p.y - n.y * w).toFixed(1)}`)
  }
  return `M${left.join('L')}L${right.reverse().join('L')}Z`
}

// A fine parallel line just inside the thread, dashed, to suggest twist.
function hairline(s: Strand, i0: number, i1: number): string {
  const out: string[] = []
  for (let i = i0; i <= i1; i++) {
    const p = s.pts[i]
    const n = { x: -s.dir[i].y, y: s.dir[i].x }
    const o = s.hw[i] * 0.42
    out.push(`${(p.x + n.x * o).toFixed(1)} ${(p.y + n.y * o).toFixed(1)}`)
  }
  return `M${out.join('L')}`
}

function findCrossings(strands: Strand[]): Crossing[] {
  const found: Crossing[] = []
  const skip = 10 // ignore the very tips
  for (let a = 0; a < strands.length; a++) {
    for (let b = a + 1; b < strands.length; b++) {
      const A = strands[a]
      const B = strands[b]
      const hits: { ia: number; ib: number; pt: Pt; sign: number }[] = []
      for (let i = skip; i < A.pts.length - skip - 1; i += 1) {
        const p = A.pts[i]
        const q = A.pts[i + 1]
        const minx = Math.min(p.x, q.x) - 1
        const maxx = Math.max(p.x, q.x) + 1
        const miny = Math.min(p.y, q.y) - 1
        const maxy = Math.max(p.y, q.y) + 1
        for (let j = skip; j < B.pts.length - skip - 1; j += 1) {
          const r = B.pts[j]
          const s = B.pts[j + 1]
          if (Math.max(r.x, s.x) < minx || Math.min(r.x, s.x) > maxx) continue
          if (Math.max(r.y, s.y) < miny || Math.min(r.y, s.y) > maxy) continue
          const d1 = { x: q.x - p.x, y: q.y - p.y }
          const d2 = { x: s.x - r.x, y: s.y - r.y }
          const den = d1.x * d2.y - d1.y * d2.x
          if (Math.abs(den) < 1e-6) continue
          const t = ((r.x - p.x) * d2.y - (r.y - p.y) * d2.x) / den
          const u = ((r.x - p.x) * d1.y - (r.y - p.y) * d1.x) / den
          if (t < 0 || t > 1 || u < 0 || u > 1) continue
          const ta = A.dir[i]
          const tb = B.dir[j]
          const cross = ta.x * tb.y - ta.y * tb.x
          if (Math.abs(cross) < 0.5) continue // near-parallel: just overlap
          hits.push({ ia: i, ib: j, pt: { x: p.x + d1.x * t, y: p.y + d1.y * t }, sign: cross })
        }
      }
      // Merge hits that are the same crossing seen through neighbouring segments.
      const merged: typeof hits = []
      for (const h of hits) {
        if (!merged.some((m) => dist(m.pt, h.pt) < 12)) merged.push(h)
      }
      for (const h of merged) {
        // Alternate over/under: the strand whose direction is clockwise of the
        // other goes over. Around a ring this flips at every crossing.
        const aOver = h.sign > 0
        found.push({
          over: aOver ? a : b,
          under: aOver ? b : a,
          overIdx: aOver ? h.ia : h.ib,
          underIdx: aOver ? h.ib : h.ia,
          sin: Math.abs(h.sign),
          pt: h.pt,
        })
      }
    }
  }
  return found
}

interface Measured {
  layout: Layout
  count: number
}

function measure(svg: SVGSVGElement): Measured | null {
  const scope = svg.parentElement
  if (!scope) return null
  const c = svg.getBoundingClientRect()
  if (!c.width || !c.height) return null
  const rel = (r: DOMRect) => ({ left: r.left - c.left, top: r.top - c.top, right: r.right - c.left, bottom: r.bottom - c.top })
  const thesis = scope.querySelector('.thesis')
  const photo = scope.querySelector('.hero-photo')
  if (!thesis || !photo) return null
  const t = rel(thesis.getBoundingClientRect())
  const p = rel(photo.getBoundingClientRect())
  const paras = Array.from(thesis.querySelectorAll('p')).map((el) => rel(el.getBoundingClientRect()))
  const W = c.width
  const H = c.height
  const compact = window.innerWidth < 760

  if (compact) {
    const cx = W / 2
    const cy = t.top - 130
    return {
      count: 2,
      layout: {
        W,
        H,
        cx,
        cy,
        R: 54,
        compact,
        labelExtras: true,
        xMin: 8,
        xMax: W - 8,
        entries: { left: { E: { x: -70, y: cy - 22 } }, right: { E: { x: W + 70, y: cy - 58 } } },
      },
    }
  }

  const gapLeft = t.right
  const gapRight = p.left
  const cx = (gapLeft + gapRight) / 2
  const R = Math.max(44, Math.min(70, (gapRight - gapLeft) / 2 - 46))
  // Vertical centre: the gap between the first two paragraphs. The left thread
  // runs through that gap, clear of every line of text.
  const gapY = paras.length > 1 ? (paras[0].bottom + paras[1].top) / 2 : (p.top + p.bottom) / 2
  const leftY = gapY + 5
  // The left thread runs straight through the paragraph gap and then curls up
  // around the ring's underside, so the ring sits one radius (plus spiral) above it.
  const cy = Math.max(R + 70, leftY - 0.965 * (R + SPIRAL_DESKTOP + 3))
  const rightY = p.top - 34
  return {
    count: 4,
    layout: {
      W,
      H,
      cx,
      cy,
      R,
      compact,
      labelExtras: false,
      xMin: gapLeft + 14,
      xMax: gapRight - 14,
      entries: {
        left: {
          E: { x: -80, y: leftY },
          via: { pt: { x: gapLeft + 6, y: leftY }, dir: { x: 1, y: 0 } },
          start: { theta0: Math.PI / 2 - 0.02, dir: -1 },
        },
        top: { E: { x: cx + 30, y: -70 } },
        right: {
          E: { x: W + 80, y: rightY },
          via: { pt: { x: gapRight - 30, y: rightY }, dir: { x: -1, y: 0 } },
        },
        bottom: { E: { x: cx - 24, y: H + 70 } },
      },
    },
  }
}

function Weave() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [measured, setMeasured] = useState<Measured | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    const scope = svg?.parentElement
    if (!svg || !scope) return
    let frame = 0
    const run = () => {
      frame = 0
      const m = measure(svg)
      if (m) setMeasured(m)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run)
    }
    run()
    const observer = new ResizeObserver(schedule)
    observer.observe(scope)
    document.fonts?.ready?.then(schedule).catch(() => {})
    window.addEventListener('resize', schedule)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scene = useMemo(() => {
    if (!measured) return null
    const { layout, count } = measured
    const threads =
      count === 2 ? THREADS.filter((t) => t.side === 'left' || t.side === 'right') : THREADS
    const strands = buildStrands(layout, threads)
    const crossings = findCrossings(strands)
    const masks: string[][] = strands.map(() => [])
    const pieces = crossings.map((c) => {
      const o = strands[c.over]
      const u = strands[c.under]
      // Just long enough to clear the under-thread at this crossing's angle.
      const length = Math.min(26, (o.hw[c.overIdx] + u.hw[c.underIdx] + 5.5) / c.sin + 3)
      const reach = Math.ceil(length / STEP)
      const i0 = Math.max(0, c.overIdx - reach)
      const i1 = Math.min(o.pts.length - 1, c.overIdx + reach + 1)
      masks[c.under].push(ribbon(o, i0, i1, 3.2))
      return {
        wide: ribbon(o, i0, i1, 1),
        piece: ribbon(o, i0, i1, 0),
        twist: hairline(o, i0, i1),
        color: o.spec.color,
      }
    })
    return { layout, strands, masks, pieces }
  }, [measured])

  const W = measured?.layout.W ?? 0
  const H = measured?.layout.H ?? 0

  return (
    <svg
      ref={svgRef}
      className="weave"
      viewBox={`0 0 ${W || 100} ${H || 100}`}
      role="img"
      aria-labelledby="weave-title weave-desc"
    >
      <title id="weave-title">Four disciplines woven into a ring around the word designer</title>
      <desc id="weave-desc">
        Four threads, psychology, data science, information science and digital studies, each
        enter from a different edge, curve inward, and weave over and under one another into a
        closed ring. Inside the ring is the word designer.
      </desc>
      <defs>
        <filter id="weave-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.8" floodColor="#30150e" floodOpacity="0.28" />
        </filter>
        <filter id="weave-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        {scene &&
          scene.masks.map((m, idx) => (
            <mask
              key={idx}
              id={`weave-mask-${idx}`}
              maskUnits="userSpaceOnUse"
              x={-300}
              y={-300}
              width={scene.layout.W + 600}
              height={scene.layout.H + 600}
            >
              <rect x={-300} y={-300} width={scene.layout.W + 600} height={scene.layout.H + 600} fill="#fff" />
              {m.map((d, j) => (
                <path key={j} d={d} fill="#000" />
              ))}
            </mask>
          ))}
      </defs>

      {scene && (
        <>
          <g filter="url(#weave-shadow)">
            {scene.strands.map((s, idx) => (
              <g key={s.spec.id} mask={`url(#weave-mask-${idx})`}>
                <path d={ribbon(s, 0, s.pts.length - 1, 0)} style={{ fill: s.spec.color }} />
                <path d={hairline(s, 0, s.pts.length - 1)} className="weave__twist" />
              </g>
            ))}
          </g>

          {scene.pieces.map((c, i) => (
            <g key={i}>
              <path
                d={c.wide}
                className="weave__cast"
                transform="translate(0.6 2.2)"
                filter="url(#weave-soft)"
              />
              <path d={c.piece} style={{ fill: c.color }} />
              <path d={c.twist} className="weave__twist" />
            </g>
          ))}

          {scene.strands.map((s) => {
            const { W: w, H: h } = scene.layout
            const e = s.pts[0]
            const common = { className: 'weave__label', style: { fill: s.spec.color } } as const
            if (s.spec.side === 'left')
              return (
                <text key={s.spec.id} x={16} y={Math.max(14, e.y - 9)} {...common}>
                  {s.spec.label}
                </text>
              )
            if (s.spec.side === 'right')
              return (
                <text key={s.spec.id} x={w - 16} y={Math.max(14, e.y - 12)} textAnchor="end" {...common}>
                  {s.spec.label}
                </text>
              )
            if (s.spec.side === 'top')
              return (
                <text key={s.spec.id} x={Math.min(w - 16, e.x + 14)} y={22} {...common}>
                  {s.spec.label}
                </text>
              )
            return (
              <text key={s.spec.id} x={Math.min(w - 16, e.x + 14)} y={h - 16} {...common}>
                {s.spec.label}
              </text>
            )
          })}

          {scene.layout.labelExtras && (
            <g className="weave__extras">
              <text x={scene.layout.cx} y={scene.layout.cy + scene.layout.R + 34} textAnchor="middle">
                DATA SCIENCE
              </text>
              <text x={scene.layout.cx} y={scene.layout.cy + scene.layout.R + 52} textAnchor="middle">
                DIGITAL STUDIES
              </text>
            </g>
          )}

          <text
            x={scene.layout.cx}
            y={scene.layout.cy + 7}
            textAnchor="middle"
            className="weave__word"
            style={{ fontSize: scene.layout.compact ? 17 : 21 }}
          >
            designer
          </text>
        </>
      )}
    </svg>
  )
}

export default Weave
