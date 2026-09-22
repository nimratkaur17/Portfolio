import { useRef } from 'react'
import ImageSlot from '../case/ImageSlot'
import './StorySpotlight.css'

interface StorySpotlightProps {
  question?: string | null
  body: string
  photos: (string | null)[]
}

// Frame with its own subheading, next to a scroll-snap carousel of
// community photographs. Prev/Next are real buttons; the strip is also
// scrollable directly.
function StorySpotlight({ question, body, photos }: StorySpotlightProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="spotlight">
      <div className="spotlight__frame">
        <p className="spotlight__kicker">Story spotlight</p>
        <h3 className="spotlight__question">
          {question ?? <span className="spotlight__placeholder">Add the spotlight question here</span>}
        </h3>
        <p className="spotlight__body">{body}</p>
      </div>

      <div className="spotlight__carousel">
        <div className="spotlight__track" ref={trackRef}>
          {photos.map((src, i) => (
            <div className="spotlight__slide" key={i}>
              <ImageSlot src={src} alt={`Photograph from the community, ${i + 1} of ${photos.length}`} ratio="4 / 3" />
            </div>
          ))}
        </div>
        <div className="spotlight__controls">
          <button type="button" aria-label="Previous photo" onClick={() => scrollBy(-1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label="Next photo" onClick={() => scrollBy(1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StorySpotlight
