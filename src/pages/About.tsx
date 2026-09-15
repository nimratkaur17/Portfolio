import { useEffect, useRef, useState } from 'react'
import './About.css'

function About() {
  const [swapped, setSwapped] = useState(false)
  const highlightRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const observers = highlightRefs.current.map((el) => {
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          el.classList.add('is-swept')
          observer.disconnect()
        },
        { threshold: 0.6 },
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <main className="about">
      <h1 className="about__title">About me</h1>

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

      <section className="about__section thesis" aria-label="Thesis">
        <h2>Thesis</h2>
        <p>
          I didn't set out to collect three degrees — psychology, data science, and information
          science each answered a different half of the same question I kept asking.{' '}
          <span
            className="highlight"
            ref={(el) => {
              highlightRefs.current[0] = el
            }}
          >
            Psychology gave me a working theory of why people do what they do; data science gave
            me a way to check that theory against what they actually did.
          </span>{' '}
          Information science tied the two together, treating the systems people move through as
          just as designable as the people themselves.{' '}
          <span
            className="highlight"
            ref={(el) => {
              highlightRefs.current[1] = el
            }}
          >
            By the time I got to product design, it stopped feeling like three fields and started
            feeling like one method wearing three coats.
          </span>{' '}
          Design, to me, is just this method pointed at a screen.
        </p>
      </section>

      <section className="about__section" aria-label="How I think">
        <h2>How I think</h2>
        <p>The habits and defaults I actually reach for, before any tool gets involved.</p>
      </section>

      <section className="about__section" aria-label="Beyond design">
        <h2>Beyond design</h2>
        <p>What I spend time on that has nothing to do with a screen.</p>
      </section>

      <section className="about__section" aria-label="Currently reading">
        <h2>Currently reading</h2>
        <ul className="about__reading-list">
          <li>Placeholder Title One — Placeholder Author</li>
          <li>Placeholder Title Two — Placeholder Author</li>
          <li>Placeholder Title Three — Placeholder Author</li>
        </ul>
      </section>

      <section className="about__section about__closing" aria-label="Closing statement">
        <h2>Closing statement</h2>
        <p>The one thing I'd want you to remember after reading all of this — placeholder for now.</p>
      </section>
    </main>
  )
}

export default About
