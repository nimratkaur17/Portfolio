import type { CSSProperties } from 'react'
import ImageSlot from '../case/ImageSlot'
import StickyNote from './StickyNote'
import type { StickyNoteData } from './StickyNote'
import './OldPageNotes.css'

export interface PageNote {
  id: string
  label: string
  page: 0 | 1
  x: number
  y: number
  note: StickyNoteData
}

interface OldPageNotesProps {
  pages: [{ src?: string | null; alt: string }, { src?: string | null; alt: string }]
  notes: PageNote[]
}

// Two real screenshots of the old page with highlight dots. The sticky note
// each dot describes pops up beside it on hover or focus - pure CSS, no
// separate panel or card wrapping it.
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
                className={`old-notes__spot${note.x > 50 ? ' opens-left' : ''}`}
                style={{ left: `${note.x}%`, top: `${note.y}%` } as CSSProperties}
              >
                <button type="button" className="old-notes__dot" aria-label={note.label}>
                  <span aria-hidden="true" />
                </button>
                <div className="old-notes__popup">
                  <StickyNote {...note.note} />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default OldPageNotes
