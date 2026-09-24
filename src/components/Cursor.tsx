import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

const INTERACTIVE =
  'a[href], button, summary, input, select, textarea, label, [role="button"], [tabindex]:not([tabindex="-1"])'
const EASE = 0.22

function Cursor() {
  // Coarse pointers keep the native cursor and nothing mounts.
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const positionRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const position = positionRef.current
    const dot = dotRef.current
    if (!enabled || !position || !dot) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let frame = 0
    let seen = false

    const render = () => {
      position.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const tick = () => {
      frame = 0
      x += (targetX - x) * EASE
      y += (targetY - y) * EASE
      render()
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(tick)
      }
    }

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!seen) {
        seen = true
        x = targetX
        y = targetY
        render()
        dot.classList.add('is-visible')
      }
      if (reduceMotion) {
        x = targetX
        y = targetY
        if (!frame) frame = requestAnimationFrame(() => {
          frame = 0
          render()
        })
        return
      }
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const handleOver = (event: MouseEvent) => {
      const target = event.target as Element | null
      dot.classList.toggle('is-active', Boolean(target?.closest?.(INTERACTIVE)))
      dot.classList.toggle('is-on-contact', Boolean(target?.closest?.('.contact-surface')))
    }

    const handleLeaveWindow = () => dot.classList.remove('is-visible')
    const handleEnterWindow = () => {
      if (seen) dot.classList.add('is-visible')
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, { passive: true })
    root.addEventListener('mouseleave', handleLeaveWindow)
    root.addEventListener('mouseenter', handleEnterWindow)
    // Hide the native cursor only now that the custom one exists.
    root.classList.add('has-custom-cursor')

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      root.removeEventListener('mouseleave', handleLeaveWindow)
      root.removeEventListener('mouseenter', handleEnterWindow)
      root.classList.remove('has-custom-cursor')
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="cursor" ref={positionRef} aria-hidden="true">
      <div className="cursor__dot" ref={dotRef} />
    </div>
  )
}

export default Cursor
