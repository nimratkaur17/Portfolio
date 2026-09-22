import { useState } from 'react'
import type { CSSProperties } from 'react'
import ImageSlot from '../case/ImageSlot'
import './StickyNoteBoard.css'

export interface StickyNote {
  id: string
  note: string
  // Position of the note's pin, and the region of the old page it describes,
  // both as percentages of the board.
  x: number
  y: number
  region: { x: number; y: number; w: number; h: number }
}

interface StickyNoteBoardProps {
  src?: string | null
  alt: string
  notes: StickyNote[]
}

// Sticky notes pinned over a screenshot of the old page. Each note is a real
// button; opening one highlights the section of the page it describes. Only
// one note is open at a time.
function StickyNoteBoard({ src, alt, notes }: StickyNoteBoardProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = notes.find((note) => note.id === openId)

  return (
    <div className="sticky-board">
      <ImageSlot src={src} alt={alt} ratio="4 / 5" className="sticky-board__page" />

      {open && (
        <div
          className="sticky-board__highlight"
          style={
            {
              left: `${open.region.x}%`,
              top: `${open.region.y}%`,
              width: `${open.region.w}%`,
              height: `${open.region.h}%`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
      )}

      {notes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`sticky-board__pin${openId === item.id ? ' is-open' : ''}`}
          style={{ left: `${item.x}%`, top: `${item.y}%` } as CSSProperties}
          data-note-side={item.x > 55 ? 'left' : 'right'}
          aria-expanded={openId === item.id}
          aria-controls={`note-${item.id}`}
          onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
          onFocus={() => setOpenId(item.id)}
        >
          <span className="sticky-board__pin-icon" aria-hidden="true" />
          <span id={`note-${item.id}`} className="sticky-board__note">
            {item.note}
          </span>
        </button>
      ))}
    </div>
  )
}

export default StickyNoteBoard
