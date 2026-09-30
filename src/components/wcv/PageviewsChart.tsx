import './PageviewsChart.css'

interface PageviewRow {
  label: string
  value: number
  highlight?: boolean
}

interface PageviewsChartProps {
  rows: PageviewRow[]
}

function PageviewsChart({ rows }: PageviewsChartProps) {
  const max = Math.max(...rows.map((row) => row.value))

  return (
    <ul className="pageviews-chart">
      {rows.map((row) => (
        <li
          key={row.label}
          className={`pageviews-chart__row${row.highlight ? ' is-highlight' : ''}`}
        >
          <span className="pageviews-chart__label">{row.label}</span>
          <span className="pageviews-chart__track">
            <span
              className="pageviews-chart__fill"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </span>
          <span className="pageviews-chart__value">{row.value.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}

export default PageviewsChart
