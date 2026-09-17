import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import './ProjectStack.css'

interface CaseStudy {
  slug: string
  kicker: string
  title: string
  copy: string
  tags: string[]
  // Phone mockup screens for this case study's media slot, in left/center/right
  // order - present (even with every entry null) means "render the phone
  // frames," absent means the plain gradient placeholder. null entries render
  // an empty frame until a real screenshot path is supplied.
  screens?: (string | null)[]
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'schneider-freightpower-owner-operator-app',
    kicker: 'Case study 01',
    title: 'Schneider FreightPower Owner Operator App',
    copy: 'Redesigned load search and booking workflows for owner-operators to simplify high-stakes freight decisions.',
    tags: ['UX Research', 'Search Optimization', 'Frontend Development'],
    screens: [null, null, null],
  },
  {
    slug: 'checkout-for-a-small-grocer',
    kicker: 'Case study 02',
    title: 'Checkout for a small grocer',
    copy: 'A point-of-sale rebuild that trims a six-step checkout down to two taps.',
    tags: ['Product design', 'React', 'POS'],
  },
  {
    slug: 'onboarding-for-a-fintech-app',
    kicker: 'Case study 03',
    title: 'Onboarding for a fintech app',
    copy: 'Cutting first-session drop-off by rethinking what identity verification has to feel like.',
    tags: ['Onboarding', 'Design systems'],
  },
  {
    slug: 'dashboard-for-field-technicians',
    kicker: 'Case study 04',
    title: 'Dashboard for field technicians',
    copy: 'Turning a spreadsheet-shaped workflow into something usable with gloves on.',
    tags: ['B2B', 'Accessibility', 'Data viz'],
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
              {study.screens ? (
                <div className="project-card__phones" aria-hidden="true">
                  {(['left', 'center', 'right'] as const).map((position, slotIndex) => {
                    const src = study.screens?.[slotIndex] ?? null
                    return (
                      <div key={position} className={`phone-frame phone-frame--${position}`}>
                        <div className="phone-frame__notch" />
                        <div
                          className="phone-frame__screen"
                          style={src ? { backgroundImage: `url(${src})` } : undefined}
                        />
                      </div>
                    )
                  })}
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
                <Link to={`/case/${study.slug}`} className="project-card__cta">
                  View case study
                </Link>
              </div>
              <div className="project-card__overlay" aria-hidden="true" />
            </div>
          </article>
        </Fragment>
      ))}
      {/* Trailing runway so the last card has room to fully reach top:88
          before the document runs out of scroll height. */}
      <div className="project-spacer" aria-hidden="true" />
    </div>
  )
}

export default ProjectStack
