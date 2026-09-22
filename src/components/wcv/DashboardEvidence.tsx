import ImageSlot from '../case/ImageSlot'
import './DashboardEvidence.css'

interface Evidence {
  src?: string | null
  alt: string
  caption: string
  annotation: { label: string; x: number; y: number }
}

interface DashboardEvidenceProps {
  items: Evidence[]
}

// Real analytics screenshots, cropped to the relevant panel, with the
// figure under discussion called out directly on the image.
function DashboardEvidence({ items }: DashboardEvidenceProps) {
  return (
    <div className="dashboard-evidence">
      {items.map((item) => (
        <figure key={item.caption} className="dashboard-evidence__item">
          <div className="dashboard-evidence__frame">
            <ImageSlot src={item.src} alt={item.alt} ratio="16 / 10" />
            <span
              className="dashboard-evidence__tag"
              style={{ left: `${item.annotation.x}%`, top: `${item.annotation.y}%` }}
            >
              {item.annotation.label}
            </span>
          </div>
          <figcaption>{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export default DashboardEvidence
