import { useState } from 'react'
import type { CSSProperties } from 'react'
import ImageSlot from '../case/ImageSlot'
import './OldPageNotes.css'

export interface PageNote {
  id: string
  label: string
  page: 0 | 1
  x: number
  y: number
  noteImage?: string | null
}

interface OldPageNotesProps {
  pages: [{ src?: string | null; alt: string }, { src?: string | null; alt: string }]
  notes: PageNote[]
}

// Two real screenshots of the old page, each with highlight pins. Hovering
// or focusing a pin brings up a photo of the physical sticky note it
// describes in a side panel, so the reader sees the actual research
// artifact, not a paraphrase of it.
function OldPageNotes({ pages, notes }: OldPageNotesProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = notes.find((note) => note.id === activeId)

  return (
    <div className="old-notes">
      <div className="old-notes__pages">
        {pages.map((page, pageIndex) => (
          <div className="old-notes__page" key={pageIndex}>
            <ImageSlot src={page.src} alt={page.alt} ratio="3 / 4" />
            {notes
              .filter((note) => note.page === pageIndex)
              .map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`old-notes__pin${activeId === note.id ? ' is-active' : ''}`}
                  style={{ left: `${note.x}%`, top: `${note.y}%` } as CSSProperties}
                  aria-label={note.label}
                  aria-expanded={activeId === note.id}
                  aria-controls="old-notes-panel"
                  onMouseEnter={() => setActiveId(note.id)}
                  onMouseLeave={() => setActiveId((prev) => (prev === note.id ? null : prev))}
                  onFocus={() => setActiveId(note.id)}
                  onBlur={() => setActiveId((prev) => (prev === note.id ? null : prev))}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
          </div>
        ))}
      </div>

      <div id="old-notes-panel" className="old-notes__panel" aria-live="polite">
        {active ? (
          <>
            <ImageSlot
              src={active.noteImage}
              alt={`Sticky note: ${active.label}`}
              ratio="1 / 1"
              className="old-notes__note-image"
            />
            <p className="old-notes__note-label">{active.label}</p>
          </>
        ) : (
          <p className="old-notes__prompt">Hover a highlight to see the sticky note behind it.</p>
        )}
      </div>
    </div>
  )
}

export default OldPageNotes
