import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import Pill from './Pill'
import './HowIThink.css'

interface Step {
  id: string
  label: string
  note: string
  tools: string[]
  x: number
  y: number
  labelSide: 'above' | 'below'
}

const VIEW_W = 960
const VIEW_H = 640

// The trend runs bottom-left to top-right (not a flat left-to-right band),
// so each step sits noticeably higher than the last on top of its own
// small wave wiggle.
const STEPS: Step[] = [
  {
    id: 'listen',
    label: 'Listen',
    note: 'I start by listening — to users, to support tickets, to whatever nobody asked me to read.',
    tools: ['User interviews', 'Affinity mapping', 'Dovetail'],
    x: 50,
    y: 580,
    labelSide: 'above',
  },
  {
    id: 'check',
    label: 'Check',
    note: 'Then I check whether what people said matches what the data actually shows.',
    tools: ['SQL', 'Python', 'Amplitude'],
    x: 280,
    y: 470,
    labelSide: 'below',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    note: 'Once the shape of the problem is clear, I sketch fast and cheap before anything gets precious.',
    tools: ['Figma', 'Prototyping', 'Design systems'],
    x: 470,
    y: 350,
    labelSide: 'above',
  },
  {
    id: 'build',
    label: 'Build',
    note: 'What survives sketching gets built — by me, in code, not handed off as a spec.',
    tools: ['React', 'TypeScript', 'Vue'],
    x: 680,
    y: 200,
    labelSide: 'below',
  },
  {
    id: 'watch',
    label: 'Watch',
    note: 'Then I watch real people use it and find out how wrong I was.',
    tools: ['Usability testing', 'Maze', 'Session replay'],
    x: 910,
    y: 70,
    labelSide: 'above',
  },
]

const WAVE_PATH =
  'M50,580 C120,540 160,600 280,470 C350,400 400,380 470,350 C540,320 610,260 680,200 C750,160 850,110 910,70'

function HowIThink() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [isDrawn, setIsDrawn] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const canHoverRef = useRef(false)
  const showTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const path = pathRef.current
    if (path) {
      path.style.setProperty('--path-length', String(path.getTotalLength()))
    }
  }, [])

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
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(showTimerRef.current), [])

  const openCard = (i: number) => setActiveIndex(i)
  const closeCard = (i: number) => setActiveIndex((current) => (current === i ? null : current))
  const toggleCard = (i: number) => setActiveIndex((current) => (current === i ? null : i))

  const handleMouseEnter = (i: number) => {
    if (!canHoverRef.current) return
    window.clearTimeout(showTimerRef.current)
    showTimerRef.current = window.setTimeout(() => openCard(i), 120)
  }

  const handleMouseLeave = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    closeCard(i)
  }

  const handleClick = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    toggleCard(i)
  }

  const handleFocus = (i: number) => {
    window.clearTimeout(showTimerRef.current)
    openCard(i)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      window.clearTimeout(showTimerRef.current)
      setActiveIndex(null)
    }
  }

  return (
    <div className={`wave${isDrawn ? ' is-drawn' : ''}`} ref={containerRef}>
      <svg
        className="wave__svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path ref={pathRef} className="wave__path" d={WAVE_PATH} />
        {STEPS.map((step, i) => (
          <circle
            key={step.id}
            className="wave__node-dot"
            cx={step.x}
            cy={step.y}
            r={9}
            style={{ '--pop-delay': `${i * 280}ms` } as CSSProperties}
          />
        ))}
      </svg>

      {STEPS.map((step, i) => {
        const xPercent = (step.x / VIEW_W) * 100
        const yPercent = (step.y / VIEW_H) * 100
        const cardSide = xPercent > 65 ? 'left' : 'right'

        return (
          <div
            key={step.id}
            className={`wave__marker wave__marker--${step.labelSide}${activeIndex === i ? ' wave__marker--active' : ''}`}
            style={
              {
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                '--pop-delay': `${i * 280}ms`,
              } as CSSProperties
            }
          >
            <span className="wave__label" aria-hidden="true">
              {step.label}
            </span>
            <svg className="wave__arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 3 C11 3 15 9 12.5 17"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12.5 17 L7.5 14.5 M12.5 17 L15.5 13"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <button
              type="button"
              className="wave__node"
              aria-label={step.label}
              aria-expanded={activeIndex === i}
              aria-controls={`wave-card-${step.id}`}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => handleClick(i)}
              onFocus={() => handleFocus(i)}
              onBlur={() => closeCard(i)}
              onKeyDown={handleKeyDown}
            />
            <div
              id={`wave-card-${step.id}`}
              className={`wave__card wave__card--${cardSide}${activeIndex === i ? ' is-open' : ''}`}
            >
              <div className="wave__card-inner">
                <p className="wave__card-note">{step.note}</p>
                <div className="wave__card-tools">
                  {step.tools.map((tool) => (
                    <Pill key={tool} className="wave__chip">
                      {tool}
                    </Pill>
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
