import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import './BeforeAfterSlider.css'

interface BeforeAfterSliderProps {
  before?: string | null
  after?: string | null
  beforeAlt: string
  afterAlt: string
  beforeLabel: string
  afterLabel: string
  ratio?: string
}

const KEY_STEP = 2
const PAGE_STEP = 10

const clamp = (value: number) => Math.min(100, Math.max(0, value))

// `pos` is the share of the frame, from the left, that shows the "before"
// layer. The divider is a real slider: focusable, arrow keys move it.
function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  ratio = '4 / 3',
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pendingX = useRef(0)
  const frame = useRef(0)

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    },
    [],
  )

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setPos(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    pendingX.current = event.clientX
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      moveTo(pendingX.current)
    })
  }

  const handlePointerEnd = () => {
    dragging.current = false
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -KEY_STEP,
      ArrowDown: -KEY_STEP,
      ArrowRight: KEY_STEP,
      ArrowUp: KEY_STEP,
      PageDown: -PAGE_STEP,
      PageUp: PAGE_STEP,
    }
    if (event.key === 'Home') setPos(0)
    else if (event.key === 'End') setPos(100)
    else if (event.key in steps) setPos((prev) => clamp(prev + steps[event.key]))
    else return
    event.preventDefault()
  }

  const rounded = Math.round(pos)

  return (
    <div
      ref={frameRef}
      className="ba-slider"
      style={{ '--pos': `${pos}%`, aspectRatio: ratio } as CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div className="ba-slider__layer ba-slider__layer--after">
        {after ? <img src={after} alt={afterAlt} draggable={false} /> : null}
        <span className="ba-slider__chip ba-slider__chip--after">{afterLabel}</span>
      </div>
      <div className="ba-slider__layer ba-slider__layer--before">
        {before ? <img src={before} alt={beforeAlt} draggable={false} /> : null}
        <span className="ba-slider__chip ba-slider__chip--before">{beforeLabel}</span>
      </div>

      <div
        className="ba-slider__handle"
        role="slider"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${beforeLabel} ${rounded} percent, ${afterLabel} ${100 - rounded} percent`}
        onKeyDown={handleKeyDown}
      >
        <span className="ba-slider__grip" aria-hidden="true" />
      </div>
    </div>
  )
}

export default BeforeAfterSlider
