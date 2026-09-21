import './ImageSlot.css'

interface ImageSlotProps {
  src?: string | null
  alt: string
  ratio?: string
  className?: string
}

// Renders the real image when a path is supplied, otherwise a neutral
// placeholder panel that holds the layout until the asset exists.
function ImageSlot({ src, alt, ratio, className = '' }: ImageSlotProps) {
  return (
    <div
      className={`image-slot${className ? ` ${className}` : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      aria-hidden={src ? undefined : true}
    >
      {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null}
    </div>
  )
}

export default ImageSlot
