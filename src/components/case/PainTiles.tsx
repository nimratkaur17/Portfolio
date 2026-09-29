import './PainTiles.css'

interface PainPoint {
  text: string
  icon: 'keyboard' | 'memory' | 'route' | 'toll' | 'vanish'
}

const POINTS: PainPoint[] = [
  { icon: 'keyboard', text: 'Retyping the same rate and distance into every search.' },
  { icon: 'memory', text: "Holding one load's numbers in their head while checking another." },
  { icon: 'route', text: 'Piecing together the trip home one search at a time.' },
  { icon: 'toll', text: 'Working out tolls somewhere outside the app.' },
  { icon: 'vanish', text: 'Checking back on a saved load to find it simply gone.' },
]

// One small line-icon per pain point, drawn in the same thin, round-capped
// style as the site's other line art (the pen line, the weave). No icon
// library - five shapes don't earn a dependency.
function TileIcon({ icon }: { icon: PainPoint['icon'] }) {
  switch (icon) {
    case 'keyboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
          <path d="M6.5 10h.01M10.5 10h.01M14.5 10h.01M18.5 10h.01M6.5 14h11" strokeLinecap="round" />
        </svg>
      )
    case 'memory':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20c4-2.5 7-6 7-10a7 7 0 0 0-14 0c0 4 3 7.5 7 10Z" />
          <path d="M9.5 9.5c0-1.5 1-2.5 2.5-2.5" strokeLinecap="round" />
        </svg>
      )
    case 'route':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="5" cy="6" r="2.2" />
          <circle cx="19" cy="18" r="2.2" />
          <path d="M6.8 7.6C10 11 8 14 12 15.5c3 1.1 3.7 0.6 5.2 1.4" strokeLinecap="round" strokeDasharray="1 3.4" />
        </svg>
      )
    case 'toll':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v9M14.6 9.8c0-1-1-1.6-2.6-1.6-1.7 0-2.6.7-2.6 1.7 0 2.4 5.2.9 5.2 3.4 0 1-1 1.8-2.7 1.8-1.6 0-2.7-.6-2.7-1.7" strokeLinecap="round" />
        </svg>
      )
    case 'vanish':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6.5 3.5h11a1 1 0 0 1 1 1V20l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
          <path d="M9 8.5l6 6M15 8.5l-6 6" strokeLinecap="round" />
        </svg>
      )
  }
}

// The five things drivers were doing themselves, as a row of illustrated
// tiles rather than a run-on sentence.
function PainTiles() {
  return (
    <ul className="pain-tiles">
      {POINTS.map((point, i) => (
        <li key={point.text} className="pain-tile">
          <span className="pain-tile__num">{String(i + 1).padStart(2, '0')}</span>
          <span className="pain-tile__icon">
            <TileIcon icon={point.icon} />
          </span>
          <p className="pain-tile__text">{point.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default PainTiles
