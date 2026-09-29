import type { ReactNode } from 'react'
import './BetCard.css'

interface BetCardProps {
  number: string
  tone: 'cream' | 'navy' | 'dark'
  title: string
  className?: string
  children: ReactNode
}

function BetCard({ number, tone, title, className, children }: BetCardProps) {
  return (
    <div className={`bet-card bet-card--${tone}${className ? ` ${className}` : ''}`}>
      <p className="bet-card__num" aria-hidden="true">
        {number}
      </p>
      <h3 className="bet-card__title">{title}</h3>
      {children}
    </div>
  )
}

export default BetCard
