import './FeedbackEcho.css'

interface FeedbackEchoProps {
  round1: string
  round2: string
  echoHref: string
}

// Same hand-drawn curve + chevron as AnnotatedCard's CompareArrow, for a
// consistent arrow style across the page.
function EchoArrow() {
  return (
    <svg className="feedback-echo__arrow" viewBox="0 0 80 34" aria-hidden="true">
      <path d="M4 20Q40 8 70 18" fill="none" strokeLinecap="round" />
      <path d="M70 18L60 12M70 18L60 24" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The round-two quote repeats the round-one problem almost word for word -
// shown as a connected pair rather than a jump-link alone, with the link
// kept as a secondary way back to the brief card it echoes.
function FeedbackEcho({ round1, round2, echoHref }: FeedbackEchoProps) {
  return (
    <div className="feedback-echo">
      <div className="feedback-echo__round1">
        <p className="feedback-echo__label">Round 1 · The problem</p>
        <p className="feedback-echo__text">{round1}</p>
      </div>
      <div className="feedback-echo__arrow-cell" aria-hidden="true">
        <EchoArrow />
      </div>
      <div className="feedback-echo__round2">
        <p className="feedback-echo__label">Round 2 · After the redesign</p>
        <blockquote>
          <p>{round2}</p>
        </blockquote>
        <a className="feedback-echo__pill" href={echoHref}>
          Echoes the brief
        </a>
      </div>
    </div>
  )
}

export default FeedbackEcho
