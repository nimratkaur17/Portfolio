import type { ReactNode } from 'react'
import { useRevealOnce } from './useRevealOnce'
import './UsabilityStatCards.css'

interface BarPairProps {
  visible: boolean
  before: number
  after: number
  max: number
  reference?: number
  showValues?: boolean
}

function BarPair({ visible, before, after, max, reference, showValues }: BarPairProps) {
  const beforePct = (before / max) * 100
  const afterPct = (after / max) * 100
  const referencePct = reference !== undefined ? (reference / max) * 100 : undefined

  return (
    <div className="stat-card__bars" role="img" aria-label={`Before ${before}, after ${after}, out of ${max}`}>
      {referencePct !== undefined && (
        <div className="stat-card__reference" style={{ left: `${referencePct}%` }}>
          <span>{reference} average</span>
        </div>
      )}
      <div className="stat-card__bar-row">
        <span className="stat-card__bar-label">Before</span>
        <div className="stat-card__bar-track">
          <div
            className="stat-card__bar-fill stat-card__bar-fill--before"
            style={{ width: visible ? `${beforePct}%` : '0%' }}
          />
        </div>
        {showValues && <span className="stat-card__bar-value">{before}</span>}
      </div>
      <div className="stat-card__bar-row">
        <span className="stat-card__bar-label">After</span>
        <div className="stat-card__bar-track">
          <div
            className="stat-card__bar-fill stat-card__bar-fill--after"
            style={{ width: visible ? `${afterPct}%` : '0%' }}
          />
        </div>
        {showValues && <span className="stat-card__bar-value">{after}</span>}
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: ReactNode
  tint: 'rose' | 'slate'
  stat: string
  explanation: string
  caption: string
  bars: Omit<BarPairProps, 'visible'>
}

function StatCard({ icon, tint, stat, explanation, caption, bars }: StatCardProps) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>()

  return (
    <div className="stat-card" ref={ref}>
      <div className={`stat-card__icon stat-card__icon--${tint}`} aria-hidden="true">
        {icon}
      </div>
      <p className="stat-card__stat">{stat}</p>
      <p className="stat-card__explanation">{explanation}</p>
      <p className="stat-card__caption">{caption}</p>
      <BarPair visible={visible} {...bars} />
    </div>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16 16 9" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function UsabilityStatCards() {
  return (
    <div className="stat-cards">
      <StatCard
        icon={<TargetIcon />}
        tint="rose"
        stat="+50%"
        explanation="Task success finding the donate button"
        caption="Before and after, from the usability checklist"
        bars={{ before: 1, after: 1.5, max: 1.5 }}
      />
      <StatCard
        icon={<GaugeIcon />}
        tint="slate"
        stat="91"
        explanation="System Usability Scale score, up from 86"
        caption="Both well above the 68 average"
        bars={{ before: 86, after: 91, max: 100, reference: 68, showValues: true }}
      />
    </div>
  )
}

export default UsabilityStatCards
