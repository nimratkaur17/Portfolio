import './ConversionStats.css'

interface ConversionStat {
  value: string
  label: string
  detail?: string
  highlight?: boolean
}

interface ConversionStatsProps {
  stats: ConversionStat[]
}

function ConversionStats({ stats }: ConversionStatsProps) {
  return (
    <div className="conversion-stats">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`conversion-stats__item${stat.highlight ? ' is-highlight' : ''}`}
        >
          <span className="conversion-stats__swatch" aria-hidden="true" />
          <p className="conversion-stats__value">{stat.value}</p>
          <p className="conversion-stats__label">{stat.label}</p>
          {stat.detail && <p className="conversion-stats__detail">{stat.detail}</p>}
        </div>
      ))}
    </div>
  )
}

export default ConversionStats
