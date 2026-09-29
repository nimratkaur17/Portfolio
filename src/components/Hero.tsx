import { useEffect, useRef, useState } from 'react'
import PenLine from './PenLine'
import './Hero.css'

const NAME = 'Nimrat Kaur'
const WORDS = ['Product designer', 'Systems thinker', 'Design thinker', 'Collaborator', 'Endlessly curious']
// The span is sized to the longest word so the layout never shifts on swap.
const WIDEST_WORD = 'Endlessly curious'
const WORD_INTERVAL = 1700
const WORD_FADE = 280
const TONES = 3
const NAME_RADIUS = 190

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const moveRef = useRef<HTMLSpanElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [wordIndex, setWordIndex] = useState(0)
  // Advances on every swap, independent of the word, so pairings only repeat
  // every WORDS.length * TONES swaps (15).
  const [toneIndex, setToneIndex] = useState(0)
  const [hasRotated, setHasRotated] = useState(false)
  const [entered, setEntered] = useState(false)
  const [inView, setInView] = useState(true)

  // Pause the rotation while the hero is off-screen.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // Fallback for the animationend signal on the last hero line (delay + duration).
  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  // The name shrinks into the nav logo as the hero scrolls out. Geometry is
  // measured here (on resize, not on scroll) and handed to CSS as variables;
  // the scroll-linked part is animation-timeline: view() in Hero.css. Without
  // scroll timelines, an IntersectionObserver gates a rAF loop that applies
  // the same numbers. Reduced motion: nothing runs, the name stays put and the
  // nav logo is always visible.
  useEffect(() => {
    const hero = heroRef.current
    const move = moveRef.current
    const logo = document.querySelector<HTMLElement>('.nav__logo')
    if (!hero || !move || !logo || reduceMotion) return

    const HOLD = 0.85 // fraction of the scroll where the name lands in the nav
    const root = document.documentElement
    const native =
      CSS.supports('animation-timeline', 'view()') && CSS.supports('timeline-scope', '--x')

    let heroHeight = 1
    let dx = 0
    let ty = 0
    let ty100 = 0
    let scale = 1
    let frame = 0

    const measure = () => {
      const heroRect = hero.getBoundingClientRect()
      const logoRect = logo.getBoundingClientRect()
      heroHeight = hero.offsetHeight
      const heroTop = heroRect.top + window.scrollY
      const centerX = heroRect.left + move.offsetLeft + move.offsetWidth / 2
      const centerY = heroTop + move.offsetTop + move.offsetHeight / 2
      scale = logoRect.width / move.offsetWidth
      dx = logoRect.left + logoRect.width / 2 - centerX
      // Counter the page's own scroll so the name lands on the logo and then
      // holds there while it crossfades.
      const toLogo = logoRect.top + logoRect.height / 2 - centerY
      ty = toLogo + HOLD * heroHeight
      ty100 = toLogo + heroHeight
      hero.style.setProperty('--name-dx', `${dx}px`)
      hero.style.setProperty('--name-ty', `${ty}px`)
      hero.style.setProperty('--name-ty-end', `${ty100}px`)
      hero.style.setProperty('--name-s', String(scale))
      const from = (window.innerHeight / (window.innerHeight + heroHeight)) * 100
      root.style.setProperty('--name-from', `${from}%`)
    }

    const apply = (p: number) => {
      const t = Math.min(p / HOLD, 1)
      const y = p < HOLD ? ty * t : ty + (ty100 - ty) * ((p - HOLD) / (1 - HOLD))
      const fade = p < HOLD ? 0 : (p - HOLD) / (1 - HOLD)
      move.style.transform = `translate(${dx * t}px, ${y}px) scale(${1 + (scale - 1) * t})`
      move.style.opacity = String(1 - fade)
      root.style.setProperty('--logo-o', String(fade))
      root.style.setProperty('--grain-f', String(Math.min(1, Math.max(0, 1 - (p - 0.3) / 0.7))))
    }

    let observer: IntersectionObserver | undefined
    if (!native) {
      const tick = () => {
        frame = 0
        const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / heroHeight))
        apply(p)
        frame = requestAnimationFrame(tick)
      }
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!frame) frame = requestAnimationFrame(tick)
        } else {
          if (frame) cancelAnimationFrame(frame)
          frame = 0
          apply(hero.getBoundingClientRect().bottom <= 0 ? 1 : 0)
        }
      })
      observer.observe(hero)
      apply(0)
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(hero)
    resizeObserver.observe(logo)
    document.fonts?.ready?.then(measure).catch(() => {})

    return () => {
      resizeObserver.disconnect()
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty('--name-from')
      root.style.removeProperty('--logo-o')
      root.style.removeProperty('--grain-f')
      move.style.transform = ''
      move.style.opacity = ''
    }
  }, [reduceMotion])

  const rotating = entered && inView && !reduceMotion
  useEffect(() => {
    const hero = heroRef.current
    if (!rotating || !hero) return
    const currentWord = () => hero.querySelector('.hero__word-text')
    let swapTimer = 0
    const interval = window.setInterval(() => {
      currentWord()?.classList.add('is-leaving')
      setToneIndex((i) => (i + 1) % TONES)
      swapTimer = window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length)
        setHasRotated(true)
      }, WORD_FADE)
    }, WORD_INTERVAL)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(swapTimer)
      currentWord()?.classList.remove('is-leaving')
    }
  }, [rotating])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (reduceMotion || coarsePointer) return

    let nameFrame = 0
    let pendingNameX = 0

    const applyNameProximity = (mouseX: number) => {
      for (const letter of lettersRef.current) {
        if (!letter) continue
        const rect = letter.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const distance = Math.abs(mouseX - centerX)
        const k = Math.max(0, 1 - distance / NAME_RADIUS)
        const tint = k > 0.5 ? (k - 0.5) * 2 : 0
        letter.style.transform = `translateY(${-20 * k}px) scale(${1 + 0.16 * k})`
        letter.style.color =
          tint > 0
            ? `color-mix(in srgb, var(--color-text), var(--color-primary-h) ${tint * 100}%)`
            : ''
      }
    }

    const handleNameMove = (event: MouseEvent) => {
      pendingNameX = event.clientX
      if (nameFrame) return
      nameFrame = requestAnimationFrame(() => {
        nameFrame = 0
        applyNameProximity(pendingNameX)
      })
    }

    const handleLeave = () => {
      for (const letter of lettersRef.current) {
        if (!letter) continue
        letter.style.transform = ''
        letter.style.color = ''
      }
    }

    hero.addEventListener('mousemove', handleNameMove)
    hero.addEventListener('mouseleave', handleLeave)

    return () => {
      hero.removeEventListener('mousemove', handleNameMove)
      hero.removeEventListener('mouseleave', handleLeave)
      if (nameFrame) cancelAnimationFrame(nameFrame)
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__top">
        <h1 className="hero__heading" aria-label={`${NAME}, product designer`}>
          <span className="hero__name-move" ref={moveRef}>
            <span className="hero__name">
              {NAME.split('').map((char, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="letter"
                  ref={(el) => {
                    lettersRef.current[i] = el
                  }}
                >
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </span>
          </span>
          <span className="hero__word" data-tone={toneIndex} aria-hidden="true">
            <span className="hero__word-sizer">{WIDEST_WORD}</span>
            <span
              key={wordIndex}
              className={`hero__word-text${hasRotated ? ' is-entering' : ''}`}
            >
              {WORDS[wordIndex]}
            </span>
          </span>
        </h1>
      </div>

      <PenLine />

      <div className="hero__bottom">
        <p
          className="hero__line"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setEntered(true)
          }}
        >
          Designing so complexity lives in the system, not in the user&rsquo;s head
        </p>
      </div>
    </section>
  )
}

export default Hero
