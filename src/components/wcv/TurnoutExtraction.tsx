import ImageSlot from '../case/ImageSlot'
import { useRevealOnce } from './useRevealOnce'
import './TurnoutExtraction.css'

// The old page's own paragraph, word for word, including the PBS Wisconsin
// quote it ran. This is what the demo below extracts out of.
const OLD_PARAGRAPH = `The proof shows in the numbers. In 2020, our work led to increases in voter turnout in every tribal community, from six percent in Bad River to a whopping 28 percent in Red Cliff. "The 2020 elections are turning out all kinds of new voters. But Wisconsin's Native Vote is seeing a tidal wave of enthusiasm like never before," said PBS Wisconsin in October of 2020.`

interface TurnoutExtractionProps {
  graphic?: string | null
}

// Scroll-triggered, once: the old paragraph sits as real, readable text, and
// the redesigned graphic - the real map and figure list - settles in beside
// it. Reduced motion (or no JS) shows both together immediately, since
// useRevealOnce resolves true with nothing to trigger.
function TurnoutExtraction({ graphic }: TurnoutExtractionProps) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>()

  return (
    <div className="extraction" ref={ref}>
      <div className="extraction__old">
        <p className="extraction__kicker">From the old page</p>
        <p className="extraction__paragraph">{OLD_PARAGRAPH}</p>
      </div>

      <div className={`extraction__reveal${visible ? ' is-visible' : ''}`}>
        <ImageSlot
          src={graphic}
          alt="Impacts on voter turnout: a list of turnout increases by community next to a map of Wisconsin with a circle sized to each one"
          ratio="1314 / 914"
        />
      </div>
    </div>
  )
}

export default TurnoutExtraction
