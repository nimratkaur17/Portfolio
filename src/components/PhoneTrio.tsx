import type { CSSProperties } from 'react'
import './PhoneTrio.css'

interface PhoneTrioProps {
  screens: string[]
  // Screenshot width / height, shared by all three so the phones match.
  ratio: string
  // Adds a camera pill for screenshots that don't already include one.
  island?: boolean
  className?: string
}

function PhoneTrio({ screens, ratio, island = false, className = '' }: PhoneTrioProps) {
  return (
    <div
      className={`phone-trio ${className}`.trim()}
      style={{ '--phone-ratio': ratio } as CSSProperties}
      aria-hidden="true"
    >
      {screens.map((src, index) => (
        <div
          key={src}
          className={`phone${island ? ' phone--island' : ''}`}
          style={{ '--phone-lift': `${(2 - index) * 10}px` } as CSSProperties}
        >
          <img src={src} alt="" decoding="async" />
        </div>
      ))}
    </div>
  )
}

export default PhoneTrio
