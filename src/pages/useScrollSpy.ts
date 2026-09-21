import { useEffect, useState } from 'react'

// Section counts as active once it is roughly centred in the viewport, not the
// instant its top edge appears. `ids` must be a stable (module-level) array.
export function useScrollSpy(ids: readonly string[]) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        const next = ids.find((id) => intersecting.has(id))
        if (next) setActiveId(next)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids])

  return activeId
}
