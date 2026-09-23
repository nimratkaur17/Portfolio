import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import PhoneTrio from './PhoneTrio'
import './ProjectStack.css'
import schneiderCard1 from '../schneider-card1.png'
import schneiderCard2 from '../schneider-card2.png'
import schneiderCard3 from '../schneider-card3.png'
import tetherCard1 from '../tether-card1.png'
import tetherCard2 from '../tether-card2.png'
import tetherCard3 from '../tether-card3.png'
import wcvCard1 from '../wcv-card1.jpg'
import wcvCard2 from '../wcv-card2.jpg'

interface CaseStudy {
  // Internal route slug, or an external href (opens in a new tab).
  slug?: string
  href?: string
  kicker: string
  title: string
  copy: string
  tags: string[]
  // Three same-size phones in one shared CSS frame. `ratio` is the screenshots'
  // width / height; `island` adds the camera pill for screenshots that don't
  // already include one.
  phones?: { screens: string[]; island: boolean; ratio: string }
  laptops?: string[]
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'schneider-freightpower-owner-operator-app',
    kicker: 'Case study 01',
    title: 'Schneider FreightPower Owner Operator App',
    copy: 'Redesigned load search and booking workflows for owner-operators to simplify high-stakes freight decisions.',
    tags: ['UX Research', 'Search Optimization', 'Frontend Development'],
    phones: {
      screens: [schneiderCard1, schneiderCard2, schneiderCard3],
      island: true,
      ratio: '420 / 763',
    },
  },
  {
    slug: 'wisconsin-conservation-voices-native-vote',
    kicker: 'Case study 02',
    title: 'Wisconsin Conservation Voices, Native Vote',
    copy: 'Redesigned a nonpartisan voter site so the two minutes people spend on it actually get them to the door.',
    tags: ['UX Research', 'Web Design', 'Usability Testing'],
    laptops: [wcvCard1, wcvCard2],
  },
  {
    href: 'https://medium.com/@nkaur24/tether-025c69cc89f8',
    kicker: 'Case study 03',
    title: 'Tether App',
    copy: 'Designed a student event discovery experience through user research, prototyping, and iterative testing.',
    tags: ['UX Research', 'Interaction Design', 'Prototyping'],
    phones: {
      screens: [tetherCard1, tetherCard2, tetherCard3],
      island: false,
      ratio: '360 / 780',
    },
  },
]

const STICKY_OFFSET = 88

function ProjectStack() {
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [revealed, setRevealed] = useState<boolean[]>(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return CASE_STUDIES.map(() => reduceMotion)
  })

  // One-time content reveal per card as it reaches rest. Not scroll-linked,
  // doesn't replay - see the recede effect below for the scroll-linked half.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observers = cardRefs.current.map((card, i) => {
      if (!card) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          setRevealed((prev) => {
            if (prev[i]) return prev
            const next = [...prev]
            next[i] = true
            return next
          })
          observer.disconnect()
        },
        { rootMargin: '-88px 0px -45% 0px', threshold: 0 },
      )
      observer.observe(card)
      return observer
    })

    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  // Scroll-linked recede fallback for browsers without animation-timeline:
  // view() + timeline-scope (the native CSS path, gated by @supports in
  // ProjectStack.css). IntersectionObserver gates a shared rAF loop so
  // nothing runs on a raw scroll listener or while a pair is out of range.
  useEffect(() => {
    const isWideEnough = window.matchMedia('(min-width: 761px)').matches
    const supportsNativeTimeline =
      typeof CSS !== 'undefined' &&
      CSS.supports('animation-timeline', 'view()') &&
      CSS.supports('timeline-scope', '--x')
    if (!isWideEnough || supportsNativeTimeline) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = cardRefs.current
    const activePairs = new Set<number>()
    let frame = 0

    const applyRecede = (i: number) => {
      const card = cards[i]
      const nextCard = cards[i + 1]
      if (!card || !nextCard) return
      const cardHeight = card.getBoundingClientRect().height
      const cardBottom = STICKY_OFFSET + cardHeight
      const nextTop = nextCard.getBoundingClientRect().top
      const k = Math.min(1, Math.max(0, (cardBottom - nextTop) / cardHeight))
      const scale = reduceMotion ? 1 : 1 - 0.06 * k
      const lift = reduceMotion ? 0 : -18 * k
      card.style.transform = `scale(${scale}) translateY(${lift}px)`
      card.style.setProperty('--overlay-o', String(0.07 * k))
      card.style.setProperty('--shadow-t', String(k))
    }

    const tick = () => {
      frame = 0
      activePairs.forEach(applyRecede)
      if (activePairs.size > 0) frame = requestAnimationFrame(tick)
    }

    const ensureRunning = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const observers: IntersectionObserver[] = []
    for (let i = 0; i < cards.length - 1; i++) {
      const nextCard = cards[i + 1]
      if (!nextCard) continue
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            activePairs.add(i)
            ensureRunning()
          } else {
            activePairs.delete(i)
          }
        },
        { rootMargin: '50% 0px 50% 0px', threshold: 0 },
      )
      observer.observe(nextCard)
      observers.push(observer)
    }

    return () => {
      observers.forEach((o) => o.disconnect())
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div id="projects" className="project-stack">
      <h2 className="project-stack__heading">Selected works</h2>
      {CASE_STUDIES.map((study, i) => (
        <Fragment key={study.title}>
          {i > 0 && <div className="project-spacer" aria-hidden="true" />}
          <article
            className="project-card"
            style={{ zIndex: i + 1 } as CSSProperties}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          >
            <div className="project-card__surface">
              {study.phones ? (
                <PhoneTrio
                  className="project-card__phones"
                  screens={study.phones.screens}
                  ratio={study.phones.ratio}
                  island={study.phones.island}
                />
              ) : study.laptops ? (
                <div className="project-card__laptops" aria-hidden="true">
                  {study.laptops.map((src) => (
                    <div key={src} className="mini-laptop">
                      <div className="mini-laptop__lid">
                        <img src={src} alt="" decoding="async" />
                      </div>
                      <div className="mini-laptop__base" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="project-card__media" aria-hidden="true" />
              )}
              <div className={`project-card__body${revealed[i] ? ' is-revealed' : ''}`}>
                <p className="project-card__kicker">{study.kicker}</p>
                <h3 className="project-card__title">{study.title}</h3>
                <p className="project-card__copy">{study.copy}</p>
                <ul className="project-card__tags">
                  {study.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {study.href ? (
                  <a
                    href={study.href}
                    className="project-card__cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${study.title} case study (opens in a new tab)`}
                  >
                    View case study
                  </a>
                ) : (
                  <Link to={`/case/${study.slug}`} className="project-card__cta">
                    View case study
                  </Link>
                )}
              </div>
              <div className="project-card__overlay" aria-hidden="true" />
            </div>
          </article>
        </Fragment>
      ))}
    </div>
  )
}

export default ProjectStack
