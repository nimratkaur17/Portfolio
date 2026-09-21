import { useId, useState } from 'react'
import './BriefQuote.css'

interface BriefQuoteProps {
  id: string
  quote: string
  problem: string
  became: string
}

// Both faces are always in the DOM, so the whole trace (quote, problem, what it
// became) reads in order for anyone not using the hover or tap reveal. Pointer
// hover, keyboard focus and tap (the toggle button) swap which face is shown.
function BriefQuote({ id, quote, problem, became }: BriefQuoteProps) {
  const [open, setOpen] = useState(false)
  const backId = useId()

  return (
    <article id={id} className={`brief-quote${open ? ' is-open' : ''}`}>
      <div className="brief-quote__face brief-quote__face--front">
        <blockquote>
          <p>{quote}</p>
        </blockquote>
      </div>

      <div id={backId} className="brief-quote__face brief-quote__face--back">
        <p>
          <span className="brief-quote__label">The problem:</span> {problem}
        </p>
        <p>
          <span className="brief-quote__label">What it became:</span> {became}
        </p>
      </div>

      <button
        type="button"
        className="brief-quote__toggle"
        aria-expanded={open}
        aria-controls={backId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="brief-quote__sr">Show the problem and what it became</span>
        <span className="brief-quote__hint" aria-hidden="true" />
      </button>
    </article>
  )
}

export default BriefQuote
