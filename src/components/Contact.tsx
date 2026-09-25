import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Contact.css'

const EMAIL = 'nimratksondhi@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/nimrat-kaur-39a129219'
const NAME = 'Nimrat Kaur'

const READING = {
  title: 'The Emperor of Gladness',
  author: 'Ocean Vuong',
  pagesRead: 68,
  pagesTotal: 402,
}
const READING_PERCENT = Math.round((READING.pagesRead / READING.pagesTotal) * 100)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function Contact() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const nameTextRef = useRef<HTMLSpanElement>(null)
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [copied, setCopied] = useState(false)

  // Fits the name to the row's width (rather than guessing a viewport-unit
  // size) so it reads as one deliberate edge-to-edge mark at any width,
  // the way the reference does, instead of a font-size that happens to
  // look right at one screen size and not another. Measures against the
  // footer (a flex item that stretches to the surface's width) rather
  // than the button/text themselves - observing an element while also
  // resizing it via its own font-size creates a ResizeObserver feedback
  // loop that lands on the wrong size.
  useLayoutEffect(() => {
    const footer = footerRef.current
    const text = nameTextRef.current
    if (!footer || !text) return

    const BASE_SIZE = 100
    const FILL = 0.97 // leave a hair of margin rather than touching the edges exactly

    const fit = () => {
      const rowWidth = footer.clientWidth
      if (!rowWidth) return
      text.style.fontSize = `${BASE_SIZE}px`
      const naturalWidth = text.scrollWidth
      if (!naturalWidth) return
      const size = ((rowWidth * FILL) / naturalWidth) * BASE_SIZE
      text.style.fontSize = `${size}px`
    }

    fit()
    document.fonts?.ready?.then(fit).catch(() => {})

    const resizeObserver = new ResizeObserver(fit)
    resizeObserver.observe(footer)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const wrap = wrapRef.current
    const surface = surfaceRef.current
    if (!wrap || !surface) return

    let frame = 0
    let active = false

    const apply = () => {
      frame = 0
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      // The panel is pinned (sticky) for the wrap's whole scroll runway, but
      // the reveal itself only consumes the first viewport-height of that -
      // the rest is a held pause where the section sits fully visible and
      // interactive before it releases at the bottom of the page.
      const progress = clamp(-rect.top / vh, 0, 1)
      surface.style.transform = `translateY(${(1 - progress) * 100}%)`

      if (active) frame = requestAnimationFrame(apply)
    }

    const ensureRunning = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) ensureRunning()
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 },
    )
    observer.observe(wrap)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable - the mailto links elsewhere still work.
    }
  }

  return (
    <div className="contact-wrap" id="contact" ref={wrapRef}>
      <div className="contact-panel">
        <div className="contact-surface" ref={surfaceRef}>
          <div className="contact-top">
            <div className="contact-intro">
              <p className="contact-kicker">Get in touch</p>
              <h2 className="contact-heading">
                Have a project or design challenge in mind? Let's work together.
              </h2>

              <ul className="contact-links">
                <li>
                  <button
                    type="button"
                    className="contact-link"
                    onClick={handleCopyEmail}
                    aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  >
                    {copied ? 'Copied!' : 'Email'}
                  </button>
                </li>
                <li>
                  <a
                    className="contact-link"
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <span className="contact-link__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact-link"
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                    <span className="contact-link__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <aside className="contact-reading" aria-label="Currently reading">
              <p className="contact-reading__label">Currently reading</p>
              <div className="contact-reading__card">
                <img
                  className="contact-reading__cover"
                  src="/gladness.jpg"
                  alt={`Cover of ${READING.title} by ${READING.author}`}
                />
                <div className="contact-reading__info">
                  <h3 className="contact-reading__title">{READING.title}</h3>
                  <p className="contact-reading__author">{READING.author}</p>
                  <div
                    className="contact-reading__bar"
                    role="progressbar"
                    aria-label={`Reading progress for ${READING.title}`}
                    aria-valuenow={READING_PERCENT}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="contact-reading__bar-fill"
                      style={{ width: `${(READING.pagesRead / READING.pagesTotal) * 100}%` }}
                    />
                  </div>
                  <p className="contact-reading__stats">{READING_PERCENT}%</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="contact-footer" ref={footerRef}>
            <button
              type="button"
              className="contact-name"
              onClick={handleCopyEmail}
              aria-label={copied ? 'Email address copied' : 'Click to copy email address'}
            >
              <span className="contact-name__text" ref={nameTextRef}>
                {NAME}
              </span>
              <span className="contact-name__pill" aria-hidden="true">
                {copied ? 'Copied!' : 'Click to copy email'}
              </span>
            </button>
            <p className="contact-copyright">Made with love</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
