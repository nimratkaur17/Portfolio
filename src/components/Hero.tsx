import type { CSSProperties } from 'react'
import './Hero.css'

type Direction = 'left' | 'top' | 'right' | 'bottom'

interface Skill {
  name: string
  tilt: number
  spin: number
  direction: Direction
}

// Directions are hand-sequenced (not a plain i % 4 cycle) so that no two
// pills that sit next to each other - horizontally OR vertically - share a
// fly-in direction, at both the 5-col desktop grid and the 4-col mobile grid.
const SKILLS: Skill[] = [
  { name: 'React', tilt: -4, spin: 20, direction: 'left' },
  { name: 'UX', tilt: 3, spin: -18, direction: 'top' },
  { name: 'Figma', tilt: -6, spin: 22, direction: 'right' },
  { name: 'CSS', tilt: 5, spin: -16, direction: 'bottom' },
  { name: 'Code', tilt: -2, spin: 24, direction: 'top' },
  { name: 'Motion', tilt: 6, spin: -19, direction: 'right' },
  { name: 'API', tilt: -3, spin: 21, direction: 'bottom' },
  { name: 'A11y', tilt: 4, spin: -17, direction: 'top' },
  { name: 'Design', tilt: -5, spin: 23, direction: 'left' },
  { name: 'Ship', tilt: 2, spin: -20, direction: 'bottom' },
]

const PILLS_START = 450
const PILL_STAGGER = 135

function Hero() {
  return (
    <section className="hero">
      <div className="hero__intro">
        <h1 className="hero__name">Nimrat Kaur</h1>
        <p className="hero__tagline">Product designer who codes her own prototypes</p>
      </div>
      <div className="hero__pills">
        {SKILLS.map((skill, i) => (
          <span
            key={skill.name}
            className={`pill pill--${skill.direction}`}
            style={
              {
                '--rot': `${skill.tilt}deg`,
                '--spin': `${skill.spin}deg`,
                animationDelay: `${PILLS_START + i * PILL_STAGGER}ms`,
              } as CSSProperties
            }
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  )
}

export default Hero
