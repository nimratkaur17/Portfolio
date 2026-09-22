import './SkimBeforeAfter.css'

function VideoPlaceholder({ className }: { className?: string }) {
  return (
    <div className={`video-placeholder${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
      </svg>
    </div>
  )
}

// Static side-by-side (desktop) / stacked (mobile) comparison. No scroll
// effect, per the brief.
function SkimBeforeAfter() {
  return (
    <div className="skim-compare">
      <figure className="skim-compare__panel">
        <figcaption>Old page</figcaption>
        <div className="skim-compare__old-grid">
          <VideoPlaceholder className="span-2" />
          <VideoPlaceholder />
          <VideoPlaceholder />
          <VideoPlaceholder className="span-2" />
        </div>
      </figure>

      <figure className="skim-compare__panel">
        <figcaption>Redesign</figcaption>
        <div className="skim-compare__new">
          <VideoPlaceholder />
          <a className="skim-compare__button" href="#">
            Watch more on our channel
          </a>
        </div>
      </figure>
    </div>
  )
}

export default SkimBeforeAfter
