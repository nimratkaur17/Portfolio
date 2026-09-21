import HeadIllustration from './HeadIllustration'
import './SpokenQuote.css'

interface SpokenQuoteProps {
  quote: string
  speaker: 'girl' | 'guy'
  echo?: { href: string; label: string }
}

function SpokenQuote({ quote, speaker, echo }: SpokenQuoteProps) {
  return (
    <figure className={`spoken spoken--${speaker}`}>
      <HeadIllustration variant={speaker} className="spoken__head" />
      <div className="spoken__bubble">
        <blockquote>
          <p>{quote}</p>
        </blockquote>
        {echo && (
          <a className="spoken__echo" href={echo.href}>
            {echo.label}
          </a>
        )}
      </div>
    </figure>
  )
}

export default SpokenQuote
