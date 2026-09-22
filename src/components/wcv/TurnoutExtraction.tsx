import { useEffect, useRef, useState } from 'react'
import './TurnoutExtraction.css'

interface TurnoutFigure {
  place: string
  points: number
}

// The only turnout figures given for the program - never invent more.
const FIGURES: TurnoutFigure[] = [
  { place: 'Red Cliff', points: 28 },
  { place: 'Menominee', points: 24 },
  { place: 'Mole Lake', points: 18 },
  { place: 'Stockbridge', points: 11 },
  { place: 'Bad River', points: 6 },
]

// Illustrative layout for the five circles - not a geographically accurate
// map, just fixed coordinates that keep every circle legible.
const MAP_POSITIONS = [
  { x: 26, y: 16 },
  { x: 66, y: 30 },
  { x: 58, y: 52 },
  { x: 70, y: 72 },
  { x: 20, y: 44 },
]

const MAX_POINTS = Math.max(...FIGURES.map((figure) => figure.points))

function TurnoutExtraction() {
  const stageRef = useRef<HTMLDivElement>(null)
  const figureRefs = useRef<(HTMLSpanElement | null)[]>([])
  const circleRefs = useRef<(SVGCircleElement | null)[]>([])
  const [armed, setArmed] = useState(false)
  const [played, setPlayed] = useState(false)

  // Only arm the JS-driven flight when motion is welcome. Left unarmed, the
  // CSS default already shows the paragraph and the result panel together,
  // so a reduced-motion visitor (or one whose JS never runs) sees the
  // finished, readable state with nothing to trigger.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed) return
    const stage = stageRef.current
    if (!stage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        playExtraction()
      },
      { threshold: 0.55 },
    )
    observer.observe(stage)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed])

  const playExtraction = () => {
    const stage = stageRef.current
    if (!stage) return
    const stageRect = stage.getBoundingClientRect()

    figureRefs.current.forEach((span, i) => {
      const circle = circleRefs.current[i]
      if (!span || !circle) return
      const from = span.getBoundingClientRect()
      const to = circle.getBoundingClientRect()
      const dx = to.left + to.width / 2 - (from.left + from.width / 2)
      const dy = to.top + to.height / 2 - (from.top + from.height / 2)

      const flyer = document.createElement('span')
      flyer.className = 'extraction__flyer'
      flyer.textContent = String(FIGURES[i].points)
      flyer.style.left = `${from.left - stageRect.left}px`
      flyer.style.top = `${from.top - stageRect.top}px`
      stage.appendChild(flyer)

      const animation = flyer.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          {
            transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 26}px) scale(1.2)`,
            opacity: 1,
            offset: 0.6,
          },
          { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0 },
        ],
        { duration: 850, delay: i * 90, easing: 'cubic-bezier(0.25, 0.85, 0.3, 1)', fill: 'forwards' },
      )
      animation.onfinish = () => flyer.remove()
    })

    setPlayed(true)
  }

  const resultVisible = played || !armed
  const paragraphSettled = played

  return (
    <div className="extraction" ref={stageRef}>
      <p className={`extraction__paragraph${paragraphSettled ? ' is-settled' : ''}`}>
        Turnout rose in every community Native Vote worked in, climbing{' '}
        {FIGURES.map((figure, i) => {
          const separator =
            i === 0 ? '' : i === FIGURES.length - 1 ? ', and ' : ', '
          return (
            <span key={figure.place}>
              {separator}
              <span
                className={`extraction__figure${paragraphSettled ? ' is-lifted' : ''}`}
                ref={(el) => {
                  figureRefs.current[i] = el
                }}
              >
                {figure.points} points in {figure.place}
              </span>
            </span>
          )
        })}
        .
      </p>

      <div className={`extraction__result${resultVisible ? ' is-visible' : ''}`}>
        <div className="extraction__map" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {FIGURES.map((figure, i) => {
              const pos = MAP_POSITIONS[i]
              const r = 3.5 + (figure.points / MAX_POINTS) * 9
              return (
                <circle
                  key={figure.place}
                  ref={(el) => {
                    circleRefs.current[i] = el
                  }}
                  cx={pos.x}
                  cy={pos.y}
                  r={r}
                  className="extraction__circle"
                />
              )
            })}
          </svg>
        </div>

        <ul className="extraction__list">
          {FIGURES.map((figure) => (
            <li key={figure.place}>
              <span className="extraction__list-value">+{figure.points}</span>
              <span className="extraction__list-label">{figure.place}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TurnoutExtraction
