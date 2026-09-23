import type { ReactNode } from 'react'
import './LaptopFrame.css'

interface LaptopFrameProps {
  src?: string | null
  alt?: string
  // For content taller than the screen (a slider showing the full page),
  // pass children instead of src - the screen scrolls to reveal the rest.
  children?: ReactNode
  scrollable?: boolean
}

function LaptopFrame({ src, alt, children, scrollable }: LaptopFrameProps) {
  return (
    <div className="laptop">
      <div className="laptop__lid">
        <div className="laptop__bezel">
          <div className="laptop__chrome" aria-hidden="true">
            <span className="laptop__dot" />
            <span className="laptop__dot" />
            <span className="laptop__dot" />
            <span className="laptop__url">nativevote.org</span>
          </div>
          <div
            className={`laptop__screen${scrollable ? ' laptop__screen--scrollable' : ''}`}
            aria-hidden={children || src ? undefined : true}
          >
            {children ?? (src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null)}
          </div>
        </div>
      </div>
      <div className="laptop__base" aria-hidden="true">
        <div className="laptop__notch" />
      </div>
    </div>
  )
}

export default LaptopFrame
