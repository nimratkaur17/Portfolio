import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import Pill from './Pill'
import './Hero.css'

type Direction = 'left' | 'top' | 'right' | 'bottom'

interface Skill {
  name: string
  tilt: number
  shift: number
  spin: number
  direction: Direction
  outline: boolean
  scale: number
}

// Direction, outline/filled and size are all hand-sequenced (not a plain
// i % n cycle) so that no two pills next to each other share a fly-in
// direction, and filled pills (used sparingly, like the reference's
// bolded concepts) never sit adjacent to another filled one. Two pills
// get a dramatic bookend tilt (Collaboration, User flow) the way the
// reference's own Empathy/Collaboration do; the rest stay more moderate.
// Size varies through font-size (not a transform scale) so flex-wrap
// still reflows around each pill's real footprint instead of letting a
// visually bigger pill overlap its neighbours, and everything is sized
// to hold at exactly two rows.
const SKILLS: Skill[] = [
  { name: 'Critical Thinking', tilt: -8, shift: 7, spin: 20, direction: 'left', outline: false, scale: 1.15 },
  { name: 'Collaboration', tilt: 22, shift: -9, spin: -18, direction: 'top', outline: true, scale: 1.0 },
  { name: 'Build', tilt: -12, shift: 9, spin: 23, direction: 'right', outline: true, scale: 0.75 },
  { name: 'Creativity', tilt: 10, shift: -7, spin: -17, direction: 'bottom', outline: false, scale: 0.95 },
  { name: 'Design Principles', tilt: -5, shift: -10, spin: 21, direction: 'left', outline: true, scale: 0.85 },
  { name: 'Testing', tilt: 8, shift: 8, spin: -19, direction: 'top', outline: false, scale: 0.85 },
  { name: 'Prototyping', tilt: -9, shift: -6, spin: 24, direction: 'right', outline: true, scale: 0.95 },
  { name: 'Problem Solving', tilt: 6, shift: 10, spin: -16, direction: 'bottom', outline: false, scale: 0.9 },
  { name: 'Interface Design', tilt: -10, shift: 6, spin: 22, direction: 'left', outline: true, scale: 0.8 },
  { name: 'User flow', tilt: -20, shift: -8, spin: -20, direction: 'top', outline: true, scale: 1.0 },
  { name: 'UI UX', tilt: -6, shift: 9, spin: 19, direction: 'right', outline: false, scale: 1.1 },
]

const PILLS_START = 450
const PILL_STAGGER = 135
const ROW_SPLIT = 6 // first 6 pills on row one, remaining 5 on row two

const NAME = 'Nimrat Kaur'
const NAME_RADIUS = 190
const PILL_RADIUS = 200

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const pillsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (reduceMotion || coarsePointer) return

    let nameFrame = 0
    let pillFrame = 0
    let pendingNameX = 0
    let pendingPillX = 0
    let pendingPillY = 0
    let pillsEntranceCleared = false

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

    const applyPillProximity = (mouseX: number, mouseY: number) => {
      if (!pillsEntranceCleared) {
        for (const pill of pillsRef.current) {
          if (!pill) continue
          pill.style.animation = 'none'
          pill.style.opacity = '1'
        }
        pillsEntranceCleared = true
      }
      for (const pill of pillsRef.current) {
        if (!pill) continue
        const rect = pill.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.hypot(mouseX - centerX, mouseY - centerY)
        const k = Math.max(0, 1 - distance / PILL_RADIUS)
        pill.style.transform = `translateY(calc(var(--shift, 0px) + ${-14 * k}px)) scale(${1 + 0.09 * k}) rotate(var(--rot))`
        pill.classList.toggle('pill--raised', k > 0.45)
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

    const handlePillsMove = (event: MouseEvent) => {
      pendingPillX = event.clientX
      pendingPillY = event.clientY
      if (pillFrame) return
      pillFrame = requestAnimationFrame(() => {
        pillFrame = 0
        applyPillProximity(pendingPillX, pendingPillY)
      })
    }

    const handleLeave = () => {
      for (const letter of lettersRef.current) {
        if (!letter) continue
        letter.style.transform = ''
        letter.style.color = ''
      }
      for (const pill of pillsRef.current) {
        if (!pill) continue
        pill.style.transform = ''
        pill.classList.remove('pill--raised')
      }
    }

    hero.addEventListener('mousemove', handleNameMove)
    hero.addEventListener('mousemove', handlePillsMove)
    hero.addEventListener('mouseleave', handleLeave)

    return () => {
      hero.removeEventListener('mousemove', handleNameMove)
      hero.removeEventListener('mousemove', handlePillsMove)
      hero.removeEventListener('mouseleave', handleLeave)
      if (nameFrame) cancelAnimationFrame(nameFrame)
      if (pillFrame) cancelAnimationFrame(pillFrame)
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__intro">
        <h1 className="hero__name" aria-label={NAME}>
          {NAME.split('').map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="letter"
              ref={(el) => {
                lettersRef.current[i] = el
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>
        <p className="hero__tagline">Product designer who codes her own prototypes</p>
      </div>
      <div className="hero__pills">
        {/* Two explicit rows (6 + 5) rather than one flex-wrap flow left to
            find its own break point - at wide viewports, flex-wrap let 10
            of 11 pills crowd into the first line and stranded the rest,
            which this split fixes regardless of viewport width. */}
        {[SKILLS.slice(0, ROW_SPLIT), SKILLS.slice(ROW_SPLIT)].map((row, rowIndex) => (
          <div className="hero__pills-row" key={rowIndex}>
            {row.map((skill, i) => {
              const index = rowIndex === 0 ? i : i + ROW_SPLIT
              return (
                <Pill
                  key={skill.name}
                  className={`hero-pill pill--${skill.direction}${skill.outline ? ' hero-pill--outline' : ''}`}
                  ref={(el) => {
                    pillsRef.current[index] = el
                  }}
                  style={
                    {
                      '--rot': `${skill.tilt}deg`,
                      '--shift': `${skill.shift}px`,
                      '--spin': `${skill.spin}deg`,
                      '--scale': skill.scale,
                      animationDelay: `${PILLS_START + index * PILL_STAGGER}ms`,
                    } as CSSProperties
                  }
                >
                  {skill.name}
                </Pill>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Hero
