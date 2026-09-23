import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const NAME = 'Nimrat Kaur'
const WORDS = ['Product designer', 'Systems thinker', 'Design thinker', 'Collaborator', 'Endlessly curious']
// The span is sized to the longest word so the layout never shifts on swap.
const WIDEST_WORD = 'Endlessly curious'
const WORD_INTERVAL = 1700
const WORD_FADE = 280
const NAME_RADIUS = 190

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [wordIndex, setWordIndex] = useState(0)
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

  const rotating = entered && inView && !reduceMotion
  useEffect(() => {
    const hero = heroRef.current
    if (!rotating || !hero) return
    const currentWord = () => hero.querySelector('.hero__word-text')
    let swapTimer = 0
    const interval = window.setInterval(() => {
      currentWord()?.classList.add('is-leaving')
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
      <div className="hero__grid">
        <h1 className="hero__heading" aria-label={`${NAME}, product designer`}>
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
          <span className="hero__word" aria-hidden="true">
            <span className="hero__word-sizer">{WIDEST_WORD}</span>
            <span
              key={wordIndex}
              className={`hero__word-text${hasRotated ? ' is-entering' : ''}`}
            >
              {WORDS[wordIndex]}
            </span>
          </span>
        </h1>
        <p className="hero__line hero__line--one">
          Designing so complexity lives in the system, not in the user&rsquo;s head
        </p>
        <p
          className="hero__line hero__line--two"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setEntered(true)
          }}
        >
          Blending research, design, and strategy to build digital experiences that matter
        </p>
      </div>
    </section>
  )
}

export default Hero
