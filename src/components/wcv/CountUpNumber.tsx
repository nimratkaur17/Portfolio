import { useEffect, useRef, useState } from 'react'

interface CountUpNumberProps {
  value: number
  formatter?: (value: number) => string
}

const DURATION = 1200

// Counts from 0 to `value` once, when scrolled into view. Renders the final
// value immediately under prefers-reduced-motion or before JS has run, so
// the number is never missing.
function CountUpNumber({ value, formatter = (n) => Math.round(n).toLocaleString('en-US') }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (reduceMotion || !el) return

    setDisplay(0)
    let frame = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / DURATION)
          const eased = 1 - (1 - k) * (1 - k)
          setDisplay(value * eased)
          if (k < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span ref={ref} aria-label={formatter(value)}>
      {formatter(display)}
    </span>
  )
}

export default CountUpNumber
