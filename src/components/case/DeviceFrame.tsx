import './DeviceFrame.css'

interface DeviceFrameProps {
  src?: string | null
  alt: string
}

function DeviceFrame({ src, alt }: DeviceFrameProps) {
  return (
    <div className="device">
      <div className="device__notch" aria-hidden="true" />
      <div className="device__screen" aria-hidden={src ? undefined : true}>
        {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null}
      </div>
    </div>
  )
}

export default DeviceFrame
