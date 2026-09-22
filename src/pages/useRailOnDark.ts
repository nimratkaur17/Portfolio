import { useEffect, useState } from 'react'

// Marks the sticky index rail as sitting over a dark section while one is in
// the band of the viewport where the rail lives (its sticky offset, 128px).
export function useRailOnDark() {
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-rail-theme="dark"]')
    if (targets.length === 0) return

    let observer: IntersectionObserver | undefined

    const connect = () => {
      observer?.disconnect()
      const visible = new Set<Element>()
      const bottom = Math.max(0, window.innerHeight - 256)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target)
            else visible.delete(entry.target)
          }
          setOnDark(visible.size > 0)
        },
        { rootMargin: `-128px 0px -${bottom}px 0px`, threshold: 0 },
      )
      targets.forEach((target) => observer?.observe(target))
    }

    connect()
    window.addEventListener('resize', connect)
    return () => {
      window.removeEventListener('resize', connect)
      observer?.disconnect()
    }
  }, [])

  return onDark
}
