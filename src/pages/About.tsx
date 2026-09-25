import { useState } from 'react'
import BeyondDesign from '../components/BeyondDesign'
import BeliefsChecklist from '../components/BeliefsChecklist'
import Contact from '../components/Contact'
import Highlight from '../components/Highlight'
import HowIThink from '../components/HowIThink'
import Weave from '../components/Weave'
import './About.css'

function About() {
  const [swapped, setSwapped] = useState(false)
  return (
    <>
      <main className="about">
        <div className="about__weave-scope">
        <div className="about__weave-pin">
        <Weave />
        <h1 className="about__title">A little bit about me</h1>

        <div className="about__intro">
          <section className="hero-photo" aria-label="Portrait">
            <div className="hero-photo__chrome" aria-hidden="true">
              <span className="hero-photo__handle hero-photo__handle--tl" />
              <span className="hero-photo__handle hero-photo__handle--tr" />
              <span className="hero-photo__handle hero-photo__handle--bl" />
              <span className="hero-photo__handle hero-photo__handle--br" />
              <span className="hero-photo__label">Portrait.jpg</span>
              <span className="hero-photo__annotation">
                <span className="hero-photo__annotation-line" />
                <span className="hero-photo__annotation-value">24</span>
              </span>
            </div>
            <button
              type="button"
              className={`hero-photo__frame${swapped ? ' is-swapped' : ''}`}
              onClick={() => setSwapped((s) => !s)}
              aria-label="Portrait of Nimrat Kaur — click to see a second pose"
            >
              <img
                className="hero-photo__img hero-photo__img--base"
                src="/portrait-1.svg"
                alt="Portrait of Nimrat Kaur"
              />
              <img
                className="hero-photo__img hero-photo__img--alt"
                src="/portrait-2.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
          </section>

          <section className="about__section thesis" aria-label="A little bit about me">
            <p>
              <Highlight>Curiosity about people</Highlight> is the thread running through
              everything I&rsquo;ve done, though it took me a while to figure out what to do with
              it. That curiosity is what pulled me toward psychology and the social sciences
              first, and then toward data, because I wanted the{' '}
              <Highlight>numbers-backed reasoning behind why people do what they do</Highlight>,
              not just a good theory about it. Design is where the two finally came together.
              It&rsquo;s the part where you stop observing and actually get to influence the
              experience, tangibly, in something a person can use.
            </p>
            <p>
              At UW-Madison I picked up the <Highlight>design way of thinking</Highlight>, which
              mostly means <Highlight>asking better questions</Highlight>, understanding people
              more honestly, and turning genuinely complicated ideas into something useful.
              I&rsquo;m drawn to <Highlight delay={150}>problems that are messy</Highlight>{' '}
              underneath: business problems, tangled data, AI systems whose reasoning you
              can&rsquo;t actually see. Knowing how things get built keeps my{' '}
              <Highlight>designs grounded in technical reality</Highlight>, so I&rsquo;m designing
              things that can actually exist rather than things that look good in a file.
            </p>
            <p>
              Outside of that, I read a lot, hike when I can, and am generally happiest exploring
              somewhere I haven&rsquo;t been before.
            </p>
          </section>
        </div>
        </div>
        </div>

        <section
          className="about__section about__section--wide about__feature"
          aria-label="How I think"
          data-nav-theme="light"
        >
          <h2>How I think</h2>
          <HowIThink />
        </section>

        <section
          className="about__section about__section--wide about__band"
          aria-label="What I believe, and are you hiring"
        >
          <BeliefsChecklist />
        </section>

        <section className="about__section about__section--wide" aria-label="Beyond design">
          <h2>Beyond design</h2>
          <BeyondDesign />
        </section>
      </main>

      <Contact />
    </>
  )
}

export default About
