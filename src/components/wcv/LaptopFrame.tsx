import './LaptopFrame.css'

interface LaptopFrameProps {
  src?: string | null
  alt: string
}

function LaptopFrame({ src, alt }: LaptopFrameProps) {
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
          <div className="laptop__screen" aria-hidden={src ? undefined : true}>
            {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null}
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
