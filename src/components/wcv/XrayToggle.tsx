import { useId, useState } from 'react'
import ImageSlot from '../case/ImageSlot'
import './XrayToggle.css'

interface ActionChip {
  label: string
  x: number
  y: number
  w: number
  emphasis?: boolean
}

interface XrayColumnProps {
  heading: string
  src?: string | null
  alt: string
  actions: ActionChip[]
  active: boolean
}

function XrayColumn({ heading, src, alt, actions, active }: XrayColumnProps) {
  return (
    <figure className="xray__column">
      <figcaption>{heading}</figcaption>
      <div className={`xray__frame${active ? ' is-dimmed' : ''}`}>
        <ImageSlot src={src} alt={alt} ratio="4 / 5" className="xray__page" />
        {actions.map((action) => (
          <span
            key={action.label}
            className={`xray__chip${action.emphasis ? ' xray__chip--band' : ''}`}
            style={{ left: `${action.x}%`, top: `${action.y}%`, width: `${action.w}%` }}
          >
            {action.label}
          </span>
        ))}
      </div>
    </figure>
  )
}

interface XrayToggleProps {
  oldSrc?: string | null
  newSrc?: string | null
  oldActions: ActionChip[]
  newActions: ActionChip[]
}

// A single toggle dims both page mockups to flat grey, leaving only the real
// actions in color, so the difference in how many actions each page offers
// (and where) reads at a glance.
function XrayToggle({ oldSrc, newSrc, oldActions, newActions }: XrayToggleProps) {
  const [active, setActive] = useState(false)
  const labelId = useId()

  return (
    <div className="xray">
      <button
        type="button"
        id={labelId}
        className="xray__toggle"
        aria-pressed={active}
        onClick={() => setActive((prev) => !prev)}
      >
        Show actions only
      </button>

      <div className="xray__columns">
        <XrayColumn
          heading="Old page"
          src={oldSrc}
          alt="The old Native Vote page"
          actions={oldActions}
          active={active}
        />
        <XrayColumn
          heading="Redesign"
          src={newSrc}
          alt="The redesigned Native Vote page"
          actions={newActions}
          active={active}
        />
      </div>
    </div>
  )
}

export default XrayToggle
