import { useEffect, useRef, useState } from 'react'
import './Contact.css'

// TODO: swap in your real contact details.
const EMAIL = 'hello@nimratkaur.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/nimratkaur'
const NAME = 'Nimrat Kaur'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function Contact() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [copied, setCopied] = useState(false)

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
    <div className="contact-wrap" ref={wrapRef}>
      <div className="contact-panel">
        <div className="contact-surface" ref={surfaceRef}>
          <div className="contact-top">
            <p className="contact-kicker">Get in touch</p>
            <h2 className="contact-heading">
              Have a project or design challenge in mind? Let's work together.
            </h2>
          </div>

          <ul className="contact-links">
            <li>
              <a className="contact-link" href={`mailto:${EMAIL}`}>
                Email
              </a>
            </li>
            <li>
              <a
                className="contact-link"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
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
              </a>
            </li>
          </ul>

          <div className="contact-footer">
            <button
              type="button"
              className="contact-name"
              onClick={handleCopyEmail}
              aria-label={copied ? 'Email address copied' : 'Click to copy email address'}
            >
              {NAME}
              <span className="contact-name__pill" aria-hidden="true">
                {copied ? 'Copied!' : 'Click to copy email'}
              </span>
            </button>
            <p className="contact-copyright">
              © {new Date().getFullYear()} {NAME}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
