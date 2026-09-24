import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface HighlightProps {
  children: ReactNode
  // Extra wait before the sweep starts, so neighbouring phrases don't fire as
  // one block.
  delay?: number
}

// Sweeps a sage highlight in behind an inline phrase when it reaches ~75% of the
// viewport height, once. The reduced-motion case is handled in About.css
// (final state, no transition).
function Highlight({ children, delay = 0 }: HighlightProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Also fires for phrases already scrolled past the line (fast scroll,
        // anchor jumps): their top is above the shrunken root's bottom edge.
        const passed = entry.rootBounds
          ? entry.boundingClientRect.top < entry.rootBounds.bottom
          : entry.isIntersecting
        if (!passed) return
        el.classList.add('is-swept')
        observer.disconnect()
      },
      // Root bottom edge moves up to 75% of the viewport height.
      { rootMargin: '0px 0px -25% 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      className="highlight"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </span>
  )
}

export default Highlight
