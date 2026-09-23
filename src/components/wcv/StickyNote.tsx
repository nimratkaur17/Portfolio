import './StickyNote.css'

export interface NoteBlock {
  text: string
  bullet?: boolean
  indent?: boolean
}

export interface StickyNoteData {
  color: 'blue' | 'tan' | 'salmon' | 'purple' | 'green'
  blocks: NoteBlock[]
  author: string
}

// A faithful recreation of the physical sticky notes from the research
// exercise - same text, same color, same signature - as real text instead
// of a cropped photo, so it's never blurry and never cut off regardless of
// how large or small it's shown.
function StickyNote({ color, blocks, author }: StickyNoteData) {
  return (
    <div className={`sticky-note sticky-note--${color}`}>
      {blocks.map((block, i) => (
        <p
          key={i}
          className={`sticky-note__line${block.bullet ? ' is-bullet' : ''}${block.indent ? ' is-indent' : ''}`}
        >
          {block.text}
        </p>
      ))}
      <p className="sticky-note__author">{author}</p>
    </div>
  )
}

export default StickyNote
