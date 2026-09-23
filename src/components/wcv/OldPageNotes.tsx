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

// Two real screenshots of the old page with highlight dots. The photo of the
// physical sticky note each dot describes pops up right above it on hover or
// focus - pure CSS, no separate panel.
function OldPageNotes({ pages, notes }: OldPageNotesProps) {
  return (
    <div className="old-notes">
      {pages.map((page, pageIndex) => (
        <div className="old-notes__page" key={pageIndex}>
          <ImageSlot src={page.src} alt={page.alt} ratio="3 / 4" />
          {notes
            .filter((note) => note.page === pageIndex)
            .map((note) => (
              <div
                key={note.id}
                className={`old-notes__spot${note.x > 55 ? ' opens-left' : ''}${note.y < 20 ? ' opens-down' : ''}`}
                style={{ left: `${note.x}%`, top: `${note.y}%` } as CSSProperties}
              >
                <button type="button" className="old-notes__dot" aria-label={note.label}>
                  <span aria-hidden="true" />
                </button>
                <div className="old-notes__popup">
                  <ImageSlot src={note.noteImage} alt={`Sticky note: ${note.label}`} ratio="1 / 1" />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default OldPageNotes
