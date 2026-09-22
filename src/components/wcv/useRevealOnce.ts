import { useEffect, useRef, useState } from 'react'

// True once the element has scrolled into view, and stays true - for
// one-shot reveal and fill animations. Reduced motion resolves to true
// immediately, so the final state renders with nothing to trigger.
export function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  return { ref, visible }
}
