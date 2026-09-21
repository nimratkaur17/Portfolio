import { useId, useState, useSyncExternalStore } from 'react'
import './PullQuote.css'

interface PullQuoteProps {
  id?: string
  quote: string
  problem?: string
  became?: string
  echo?: { href: string; label: string }
}

const subscribe = () => () => {}

// "What it became" is in the DOM from the first render, so the page reads in
// full without scripting. Only once client-side rendering is running do we
// add the collapsed state that hover, focus and tap then reveal.
function PullQuote({ id, quote, problem, became, echo }: PullQuoteProps) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false)
  const [open, setOpen] = useState(false)
  const valueId = useId()

  return (
    <figure
      id={id}
      className={`pull-quote${enhanced ? ' is-enhanced' : ''}${open ? ' is-open' : ''}`}
    >
      <blockquote className="pull-quote__text">
        <p>{quote}</p>
      </blockquote>

      {problem && (
        <p className="pull-quote__problem">
          <span className="pull-quote__label">The problem:</span> {problem}
        </p>
      )}

      {became && (
        <div className="pull-quote__became">
          <button
            type="button"
            className="pull-quote__toggle"
            aria-expanded={open}
            aria-controls={valueId}
            onClick={() => setOpen((prev) => !prev)}
          >
            What it became:
          </button>
          <span id={valueId} className="pull-quote__tag">
            {became}
          </span>
        </div>
      )}

      {echo && (
        <a className="pull-quote__echo" href={echo.href}>
          {echo.label}
        </a>
      )}
    </figure>
  )
}

export default PullQuote
