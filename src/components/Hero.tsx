import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import Pill from './Pill'
import './Hero.css'

type Direction = 'left' | 'top' | 'right' | 'bottom'
type PillColor = 'mauve' | 'olive' | 'sand' | 'slate'

interface Skill {
  name: string
  tilt: number
  shift: number
  spin: number
  direction: Direction
  color: PillColor
  outline: boolean
  scale: number
}

// Direction, colour, outline/filled and size are all hand-sequenced (not a
// plain i % n cycle) so that no two pills next to each other share a
// fly-in direction or a colour, and filled pills (used sparingly, like the
// reference's bolded concepts) never sit adjacent to another filled one.
// Tilt/shift are wide enough to read as scattered rather than a tidy grid;
// size varies through font-size (not a transform scale) so flex-wrap still
// reflows around each pill's real footprint instead of letting a visually
// bigger pill overlap its neighbours.
const SKILLS: Skill[] = [
  { name: 'Critical Thinking', tilt: -8, shift: 7, spin: 20, direction: 'left', color: 'mauve', outline: false, scale: 1.15 },
  { name: 'Collaboration', tilt: 7, shift: -9, spin: -18, direction: 'top', color: 'olive', outline: true, scale: 1.1 },
  { name: 'Build', tilt: -12, shift: 9, spin: 23, direction: 'right', color: 'sand', outline: true, scale: 0.85 },
  { name: 'Creativity', tilt: 10, shift: -7, spin: -17, direction: 'bottom', color: 'slate', outline: false, scale: 1.0 },
  { name: 'Design Principles', tilt: -5, shift: -10, spin: 21, direction: 'left', color: 'mauve', outline: true, scale: 0.9 },
  { name: 'Testing', tilt: 8, shift: 8, spin: -19, direction: 'top', color: 'olive', outline: true, scale: 0.9 },
  { name: 'Prototyping', tilt: -9, shift: -6, spin: 24, direction: 'right', color: 'sand', outline: true, scale: 1.0 },
  { name: 'Problem Solving', tilt: 6, shift: 10, spin: -16, direction: 'bottom', color: 'slate', outline: false, scale: 0.95 },
  { name: 'Interface Design', tilt: -10, shift: 6, spin: 22, direction: 'left', color: 'mauve', outline: true, scale: 0.85 },
  { name: 'User flow', tilt: 9, shift: -8, spin: -20, direction: 'top', color: 'olive', outline: true, scale: 1.05 },
  { name: 'UI UX', tilt: -6, shift: 9, spin: 19, direction: 'right', color: 'sand', outline: false, scale: 1.2 },
]

const PILLS_START = 450
const PILL_STAGGER = 135

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
            ? `color-mix(in srgb, var(--color-bg), var(--color-primary-h) ${tint * 100}%)`
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
    <section className="hero" ref={heroRef} data-nav-theme="light">
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
        {SKILLS.map((skill, i) => (
          <Pill
            key={skill.name}
            className={`hero-pill pill--${skill.direction} hero-pill--${skill.color}${skill.outline ? ' hero-pill--outline' : ''}`}
            ref={(el) => {
              pillsRef.current[i] = el
            }}
            style={
              {
                '--rot': `${skill.tilt}deg`,
                '--shift': `${skill.shift}px`,
                '--spin': `${skill.spin}deg`,
                '--scale': skill.scale,
                animationDelay: `${PILLS_START + i * PILL_STAGGER}ms`,
              } as CSSProperties
            }
          >
            {skill.name}
          </Pill>
        ))}
      </div>
    </section>
  )
}

export default Hero
