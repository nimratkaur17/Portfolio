import { forwardRef, useEffect, useRef } from 'react'
import './ColorFloralScrollDemo.css'

const BANDS = [
  { label: 'Connect with Us', className: 'band--connect' },
  { label: 'Our Impact in Numbers', className: 'band--impact' },
  { label: 'Looking Forward', className: 'band--forward' },
  { label: 'Government partnership', className: 'band--partnership' },
] as const

// Abstract floral line motif, stylized rather than a reproduction of any
// specific Ojibwe pattern. `pathLength="1"` normalizes every path to the
// same length regardless of its real geometry, so a single --draw value
// (0 to 1) can drive every stroke-dashoffset uniformly.
const FloralMotif = forwardRef<SVGSVGElement, { side: 'left' | 'right' }>(({ side }, ref) => (
  <svg
    ref={ref}
    className={`color-demo__floral color-demo__floral--${side}`}
    viewBox="0 0 80 320"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path pathLength={1} d="M40 12 C22 40 22 68 40 88 C58 68 58 40 40 12 Z" />
    <path pathLength={1} d="M40 88 L40 300" />
    <path pathLength={1} d="M40 96 C40 140 18 158 8 196" />
    <path pathLength={1} d="M40 96 C40 140 62 158 72 196" />
    <path pathLength={1} d="M8 196 C-6 210 -6 232 8 248 C22 232 22 210 8 196 Z" />
    <path pathLength={1} d="M72 196 C58 210 58 232 72 248 C86 232 86 210 72 196 Z" />
    <path pathLength={1} d="M40 210 C20 226 12 252 22 282 C36 266 42 240 40 210 Z" />
    <path pathLength={1} d="M40 210 C60 226 68 252 58 282 C44 266 38 240 40 210 Z" />
  </svg>
))
FloralMotif.displayName = 'FloralMotif'

// Sticky panel pinned inside a tall wrapper, same technique as the project
// stack: an IntersectionObserver gates a shared rAF loop (no raw scroll
// listener) that recomputes progress each frame from the wrapper's own
// bounding rect. Progress drives which color band is dominant and how far
// the floral strokes are drawn, both ways, as the reader scrolls.
function ColorFloralScrollDemo() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bandRefs = useRef<(HTMLDivElement | null)[]>([])
  const floralLeftRef = useRef<SVGSVGElement>(null)
  const floralRightRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let frame = 0
    let active = false

    const apply = () => {
      const rect = wrapper.getBoundingClientRect()
      const viewportH = window.innerHeight
      const scrollable = rect.height - viewportH
      const k = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0

      bandRefs.current.forEach((band, i) => {
        if (!band) return
        const center = (i + 0.5) / BANDS.length
        const width = 1 / BANDS.length
        const opacity = Math.max(0, 1 - Math.abs(k - center) / width)
        band.style.opacity = String(opacity)
      })

      floralLeftRef.current?.style.setProperty('--draw', String(k))
      floralRightRef.current?.style.setProperty('--draw', String(k))

      const nearestBand = Math.min(BANDS.length - 1, Math.floor(k * BANDS.length))
      panelRef.current?.setAttribute('data-band', String(nearestBand))
    }

    const tick = () => {
      apply()
      frame = active ? requestAnimationFrame(tick) : 0
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active && !frame) frame = requestAnimationFrame(tick)
      },
      { threshold: 0 },
    )
    observer.observe(wrapper)
    apply()

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="color-demo" ref={wrapperRef}>
      <div className="color-demo__panel" ref={panelRef}>
        <FloralMotif side="left" ref={floralLeftRef} />

        <div className="color-demo__bands">
          {BANDS.map((band, i) => (
            <div
              key={band.label}
              className={`color-demo__band ${band.className}`}
              ref={(el) => {
                bandRefs.current[i] = el
              }}
            >
              <p>{band.label}</p>
            </div>
          ))}
        </div>

        <FloralMotif side="right" ref={floralRightRef} />
      </div>
    </div>
  )
}

export default ColorFloralScrollDemo
