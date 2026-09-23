import { useRevealOnce } from './useRevealOnce'
import './FloralReveal.css'

interface FloralRevealProps {
  src: string
}

// The real floral illustration (background removed), fading and rising into
// place once as the reader scrolls to it.
function FloralReveal({ src }: FloralRevealProps) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>()

  return (
    <div className={`floral-reveal${visible ? ' is-visible' : ''}`} ref={ref}>
      <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    </div>
  )
}

export default FloralReveal
