import './TeamDiagram.css'

interface Member {
  role: string
  you?: boolean
}

const TEAM: Member[] = [
  { role: 'Developer' },
  { role: 'Developer' },
  { role: 'Developer' },
  { role: 'Developer' },
  { role: 'Data engineer' },
  { role: 'Me', you: true },
]

// A simple head-and-shoulders mark, not a literal portrait - consistent with
// the site's other minimal line icons.
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5" strokeLinecap="round" />
    </svg>
  )
}

// A short arrow pointing from the icon itself to the "design lead" note.
function CalloutArrow() {
  return (
    <svg className="team-diagram__arrow" viewBox="0 0 22 10" aria-hidden="true">
      <path d="M1 5h15" fill="none" strokeLinecap="round" />
      <path d="M11 1l5 4-5 4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Six people, one highlighted: a quick visual answer to "where did you sit
// on this team" before the paragraphs spell it out.
function TeamDiagram() {
  return (
    <ul className="team-diagram" aria-hidden="true">
      {TEAM.map((member, i) => (
        <li key={i} className={`team-diagram__member${member.you ? ' is-you' : ''}`}>
          <span className="team-diagram__icon-wrap">
            <span className="team-diagram__icon">
              <UserIcon />
            </span>
            {member.you && (
              <span className="team-diagram__callout">
                <CalloutArrow />
                <span className="team-diagram__note">design lead</span>
              </span>
            )}
          </span>
          <span className="team-diagram__label">{member.role}</span>
        </li>
      ))}
    </ul>
  )
}

export default TeamDiagram
