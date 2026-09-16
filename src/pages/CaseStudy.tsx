import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CaseStudy.css'

interface Section {
  id: string
  heading: string
  placeholder: string
}

const SECTIONS: Section[] = [
  {
    id: 'at-a-glance',
    heading: 'At a glance',
    placeholder: 'The elevator version — problem, approach, and outcome in a few lines.',
  },
  {
    id: 'what-we-assumed',
    heading: 'What we assumed',
    placeholder: 'The going-in theory, before any of it met a real user.',
  },
  {
    id: 'what-was-actually-happening',
    heading: 'What was actually happening',
    placeholder: 'What the research actually turned up, and how far it was from the brief.',
  },
  {
    id: 'three-directions-one-survivor',
    heading: 'Three directions, one survivor',
    placeholder: "The options on the table, and why the other two didn't make it.",
  },
  {
    id: 'what-shipped',
    heading: 'What shipped',
    placeholder: 'What actually went live, and the trade-offs that got it there.',
  },
  {
    id: 'what-id-do-differently',
    heading: "What I'd do differently",
    placeholder: "In hindsight — what I'd change with what I know now.",
  },
]

function slugToTitle(slug: string | undefined) {
  if (!slug) return 'Case study'
  const words = slug.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        const next = SECTIONS.find((section) => intersecting.has(section.id))
        if (next) setActiveId(next.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )

    for (const el of sectionRefs.current) {
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <main className="case-study">
      <header className="case-study__hero" data-nav-theme="light">
        <div className="case-study__hero-inner">
          <p className="case-study__kicker">Case study</p>
          <h1 className="case-study__title">{slugToTitle(slug)}</h1>
        </div>
      </header>

      <div className="case-study__layout">
        <article className="case-study__content">
          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="case-study__section"
              ref={(el) => {
                sectionRefs.current[i] = el
              }}
            >
              <h2>{section.heading}</h2>
              <p>{section.placeholder}</p>
            </section>
          ))}
        </article>

        <nav className="case-study__rail" aria-label="Sections in this case study">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeId === section.id ? 'is-active' : undefined}
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}

export default CaseStudy
