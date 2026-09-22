import CountUpNumber from './CountUpNumber'
import './ImpactStatsBand.css'

interface ImpactStat {
  value: number
  suffix?: string
  label: string
}

interface ImpactStatsBandProps {
  heading: string
  stats: ImpactStat[]
}

function ImpactStatsBand({ heading, stats }: ImpactStatsBandProps) {
  return (
    <div className="impact-band">
      <h3 className="impact-band__heading">{heading}</h3>
      <ul className="impact-band__grid">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="impact-band__value">
              <CountUpNumber value={stat.value} />
              {stat.suffix}
            </p>
            <p className="impact-band__label">{stat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ImpactStatsBand
