import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import './HowIThink.css'

interface Step {
  id: string
  label: string
  note: string
  tools: string[]
  // Where the step sits along the diagonal (0 = start of the line, 1 = end).
  t: number
  labelSide: 'above' | 'below'
  // The card opens on the side of the dot the line doesn't cross.
  card: 'below-right' | 'above-left'
}

// The line is a gentle diagonal (about 20 degrees) that runs nearly the full
// width, past the first and last steps, with a hand-drawn wave along it.
const STEPS: Step[] = [
  {
    id: 'listen',
    label: 'Listen',
    note: 'I start by listening — to users, to support tickets, to whatever nobody asked me to read.',
    tools: ['User interviews', 'Affinity mapping', 'Dovetail'],
    t: 0.21,
    labelSide: 'above',
    card: 'above-left',
  },
  {
    id: 'check',
    label: 'Check',
    note: 'Then I check whether what people said matches what the data actually shows.',
    tools: ['SQL', 'Python', 'Amplitude'],
    t: 0.36,
    labelSide: 'below',
    card: 'below-right',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    note: 'Once the shape of the problem is clear, I sketch fast and cheap before anything gets precious.',
    tools: ['Figma', 'Prototyping', 'Design systems'],
    t: 0.51,
    labelSide: 'above',
    card: 'below-right',
  },
  {
    id: 'build',
    label: 'Build',
    note: 'What survives sketching gets built — by me, in code, not handed off as a spec.',
    tools: ['React', 'TypeScript', 'Vue'],
    t: 0.66,
    labelSide: 'below',
    card: 'below-right',
  },
  {
    id: 'watch',
    label: 'Watch',
    note: 'Then I watch real people use it and find out how wrong I was.',
    tools: ['Usability testing', 'Maze', 'Session replay'],
    t: 0.81,
    labelSide: 'above',
    card: 'above-left',
  },
]

const DRAW_MS = 3200
const CLOSE_DELAY = 160

const SLOPE = 0.367 // rise / run of the diagonal
const RUN_FRACTION = 0.947 // share of the box width the line spans
const TAIL_STOPS = [0, ...STEPS.map((step) => step.t), 1]
// Per-segment wiggle as a fraction of segment length (control point 1, 2);
// deliberately uneven so it reads hand-drawn rather than mechanical.
const WIGGLE = [
  [-0.24, 0.16],
  [0.2, -0.27],
  [-0.17, 0.25],
  [0.27, -0.18],
  [-0.21, 0.15],
  [0.25, -0.22],
]
// Each stop's tangent is nudged a few degrees off the trend so the line
// wanders like a pen stroke instead of running dead straight.
const TANGENT_JITTER = [-0.1, 0.13, -0.08, 0.12, -0.11, 0.07, -0.09]

function layoutLine(w: number, h: number) {
  let run = w * RUN_FRACTION
  let rise = run * SLOPE
  if (rise > h * 0.8) {
    rise = h * 0.8
    run = rise / SLOPE
  }
  const x0 = (w - run) / 2
  const y0 = h * 0.46 + rise / 2
  const pointAt = (t: number) => ({ x: x0 + run * t, y: y0 - rise * t })
  return { run, rise, pointAt }
}

function buildPath(w: number, h: number) {
  const { run, rise, pointAt } = layoutLine(w, h)
  const angle = Math.atan2(-rise, run)
  const tangent = (i: number) => {
    const theta = angle + TANGENT_JITTER[i % TANGENT_JITTER.length]
    return { x: Math.cos(theta), y: Math.sin(theta) }
  }
  const pts = TAIL_STOPS.map(pointAt)
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const seg = Math.hypot(b.x - a.x, b.y - a.y)
    const [f1, f2] = WIGGLE[(i - 1) % WIGGLE.length]
    const ta = tangent(i - 1)
    const tb = tangent(i)
    d += ` C${a.x + (ta.x * seg) / 3},${a.y + (ta.y * seg) / 3 + f1 * seg} ${b.x - (tb.x * seg) / 3},${b.y - (tb.y * seg) / 3 + f2 * seg} ${b.x},${b.y}`
  }
  return d
}

function HowIThink() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [size, setSize] = useState({ w: 960, h: 640 })
  const [delays, setDelays] = useState<number[]>(() => STEPS.map(() => 0))
  const [isDrawn, setIsDrawn] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  // The "hover on me" hint goes away for good after the first interaction.
  const [hintSeen, setHintSeen] = useState(false)
  const canHoverRef = useRef(false)
  const showTimerRef = useRef<number | undefined>(undefined)
  const closeTimerRef = useRef<number | undefined>(undefined)

  const line = layoutLine(size.w, size.h)
  const points = STEPS.map((step) => line.pointAt(step.t))
  const pathD = buildPath(size.w, size.h)

  // Real pixel box (not a stretched viewBox), so the line and dots are never
  // distorted whatever shape the screen-height section gives us.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width && rect.height) setSize({ w: rect.width, h: rect.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Each dot and label appears when the drawing line reaches it.
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    path.style.setProperty('--path-length', String(total))
    const next = points.map((point) => {
      let lo = 0
      let hi = total
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).x < point.x) lo = mid
        else hi = mid
      }
      return Math.round((lo / total) * DRAW_MS)
    })
    setDelays(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD])

  useEffect(() => {
    canHoverRef.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const el = containerRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsDrawn(true)
        observer.disconnect()
      },
      { threshold: 0.45 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(showTimerRef.current)
      window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  const openCard = (i: number) => {
    setActiveIndex(i)
    setHintSeen(true)
  }
  const closeCard = (i: number) => setActiveIndex((current) => (current === i ? null : current))
  const toggleCard = (i: number) => setActiveIndex((current) => (current === i ? null : i))

  const handleEnter = (i: number) => {
    window.clearTimeout(closeTimerRef.current)
    if (!canHoverRef.current) return
    window.clearTimeout(showTimerRef.current)
    showTimerRef.current = window.setTimeout(() => openCard(i), 80)
  }

  // A short grace period so the pointer can travel from the dot onto the card.
  const handleLeave = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => closeCard(i), CLOSE_DELAY)
  }

  const handleClick = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    window.clearTimeout(closeTimerRef.current)
    toggleCard(i)
  }

  const handleFocus = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    window.clearTimeout(closeTimerRef.current)
    openCard(i)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      window.clearTimeout(showTimerRef.current)
      window.clearTimeout(closeTimerRef.current)
      setActiveIndex(null)
    }
  }

  return (
    <div
      className={`wave${isDrawn ? ' is-drawn' : ''}`}
      ref={containerRef}
      style={{ '--draw-ms': `${DRAW_MS}ms` } as CSSProperties}
    >
      <svg
        className="wave__svg"
        viewBox={`0 0 ${size.w} ${size.h}`}
        aria-hidden="true"
      >
        <path ref={pathRef} className="wave__path" d={pathD} />
      </svg>

      {STEPS.map((step, i) => {
        return (
          <div
            key={step.id}
            className={`wave__marker wave__marker--${step.labelSide}${activeIndex === i ? ' wave__marker--active' : ''}`}
            style={
              {
                left: `${points[i].x}px`,
                top: `${points[i].y}px`,
                '--pop-delay': `${delays[i]}ms`,
              } as CSSProperties
            }
          >
            <span className="wave__label" aria-hidden="true">
              {step.label}
            </span>
            {i === 0 && (
              <span className={`wave__hint${hintSeen ? ' is-hidden' : ''}`} aria-hidden="true">
                <svg className="wave__hint-arrow" viewBox="0 0 40 30">
                  <path
                    d="M37 25 C27 28 9 23 4 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 6 L1.5 14 M4 6 L11.5 9.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="wave__hint-text wave__hint-text--hover">hover on me</span>
                <span className="wave__hint-text wave__hint-text--tap">tap me</span>
              </span>
            )}
            <button
              type="button"
              className="wave__node"
              aria-label={step.label}
              aria-expanded={activeIndex === i}
              aria-controls={`wave-card-${step.id}`}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              onClick={() => handleClick(i)}
              onFocus={() => handleFocus(i)}
              onBlur={() => closeCard(i)}
              onKeyDown={handleKeyDown}
            />
            <div
              id={`wave-card-${step.id}`}
              className={`wave__card wave__card--${step.card}${activeIndex === i ? ' is-open' : ''}`}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              onKeyDown={handleKeyDown}
            >
              <div className="wave__card-inner">
                <span className="wave__card-step">
                  {String(i + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                </span>
                <h3 className="wave__card-title">{step.label}</h3>
                <p className="wave__card-note">{step.note}</p>
                <div className="wave__card-tools">
                  {step.tools.map((tool) => (
                    <span key={tool} className="wave__chip">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HowIThink
