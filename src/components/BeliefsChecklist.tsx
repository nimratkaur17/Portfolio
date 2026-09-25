import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './BeliefsChecklist.css'

const BELIEFS = [
  {
    statement: 'The best idea rarely arrives fully formed.',
    detail: 'It usually shows up as someone else’s half-thought.',
  },
  {
    statement: 'Polish is what happens after the structure is right.',
    detail: 'You can’t style your way out of a bad layout.',
  },
  {
    statement: 'Every design decision is a hypothesis about a person.',
    detail: 'Worth writing down, so you know when you were wrong.',
  },
  {
    statement: 'Deciding not to build something is a design decision.',
    detail: 'Restraint is harder to defend than ambition.',
  },
]

const OPTIONS = [
  'Design sits with engineering',
  'Critique is normal here',
  'Structure before polish',
  'Prototypes get built',
]

const MESSAGES = [
  'Tick what’s true of your team.',
  'Tell me more.',
  'Tell me more.',
  'Promising.',
  'We should talk this week.',
]

const MESSAGE_FADE = 200

// Hover only: these rows are never clickable or focusable. All the text stays
// in the DOM (just visually collapsed), so it reads in full for screen readers.
function Beliefs() {
  return (
    <ol className="beliefs">
      {BELIEFS.map((belief, i) => (
        <li className="belief" key={belief.statement}>
          <span className="belief__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="belief__body">
            <p className="belief__statement">{belief.statement}</p>
            <p className="belief__detail">{belief.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Checklist() {
  const [on, setOn] = useState([false, false, false, false])
  const [previous, setPrevious] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const count = on.filter(Boolean).length

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = (index: number) => {
    const next = on.map((value, i) => (i === index ? !value : value))
    // Crossfade: the old message lingers, fading out, while the new one fades in.
    const nextCount = next.filter(Boolean).length
    if (MESSAGES[nextCount] !== MESSAGES[count]) {
      setPrevious(MESSAGES[count])
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setPrevious(null), MESSAGE_FADE)
    }
    setOn(next)
  }

  return (
    <div className="checklist">
      <h3 className="checklist__title">Are you hiring?</h3>
      <p className="checklist__prompt">TICK WHAT&rsquo;S TRUE OF YOUR TEAM.</p>

      <ul className="checklist__options">
        {OPTIONS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`check-row${on[i] ? ' is-on' : ''}`}
              aria-pressed={on[i]}
              onClick={() => toggle(i)}
            >
              <span className="check-row__box" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="check-row__mark">
                  <path
                    d="M3.5 8.5 6.6 11.4 12.5 4.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="check-row__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="checklist__progress" aria-hidden="true">
        <div className="checklist__fill" style={{ '--p': count / 4 } as CSSProperties} />
      </div>
      <div className="checklist__message" aria-live="polite">
        <span key={MESSAGES[count]} className="checklist__msg checklist__msg--in">
          {MESSAGES[count]}
        </span>
        {previous && (
          <span className="checklist__msg checklist__msg--out" aria-hidden="true">
            {previous}
          </span>
        )}
      </div>
    </div>
  )
}

function BeliefsChecklist() {
  // Scroll far enough that the contact section's reveal has finished.
  const handleContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const wrap = document.getElementById('contact')
    if (!wrap) return
    event.preventDefault()
    window.scrollTo(0, wrap.getBoundingClientRect().top + window.scrollY + window.innerHeight)
  }

  return (
    <div className="bc__grid">
      <Beliefs />
      <div className="bc__right">
        <Checklist />
        <div className="bc__closing">
          <p className="bc__lead">Open to work.</p>
          <p className="bc__copy">
            Looking for design roles where the research, the design, and the build aren&rsquo;t
            three separate handoffs, on a team that ships often.
          </p>
          <a className="bc__cta" href="#contact" onClick={handleContact}>
            Get in touch
          </a>
        </div>
      </div>
    </div>
  )
}

export default BeliefsChecklist
