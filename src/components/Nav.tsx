import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Nav.css'

function Nav() {
  const [onDark, setOnDark] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Nav has no background of its own - it's just text floating over
  // whatever's currently behind it. So instead of a scroll-position
  // threshold, this watches every section marked data-nav-theme="light"
  // (navy Projects, the merlot case-study band) and swaps the logo/links
  // to ivory whenever one of them is under the nav's own strip at the top
  // of the viewport. Re-runs per route since which sections exist differs
  // per page.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-nav-theme="light"]'),
    )
    if (sections.length === 0) {
      setOnDark(false)
      return
    }

    const active = new Set<Element>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target)
          else active.delete(entry.target)
        }
        setOnDark(active.size > 0)
      },
      // Shrinks the observed root to roughly the nav's own band at the
      // top of the viewport, so a section only counts as "under the nav"
      // rather than merely on screen somewhere.
      { rootMargin: '0px 0px -85% 0px', threshold: 0 },
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [location.pathname])

  // The logo reads "Open to work" for as long as any part of the hero is
  // still on screen (this is also when it's fading in as the shrinking name
  // lands here - see Hero.tsx/css). Once the hero scrolls fully away, or on
  // any page without one, it goes back to the name for good.
  const [inHero, setInHero] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (location.pathname !== '/' || !hero) {
      setInHero(false)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInHero(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [location.pathname])

  const handleProjectsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#projects')
    }
  }

  // The Schneider case study opens on cream, not the merlot band other case
  // studies use, so the default merlot logo would clash - espresso matches
  // the links there instead. `nav--on-dark` still wins over this once the
  // reader scrolls into that page's own dark sections (see the CSS order).
  const isSchneiderCaseStudy = location.pathname === '/case/schneider-freightpower-owner-operator-app'

  return (
    <nav
      className={`nav${isSchneiderCaseStudy ? ' nav--espresso' : ''}${onDark ? ' nav--on-dark' : ''}`}
    >
      <Link to="/" className={`nav__logo${inHero ? ' nav__logo--pinned' : ''}`}>
        {inHero ? 'Open to work' : 'Nimrat Kaur'}
      </Link>
      <ul className="nav__links">
        <li>
          <a href="/#projects" onClick={handleProjectsClick}>
            Projects
          </a>
        </li>
        <li>
          <Link to="/about">About me</Link>
        </li>
        <li>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
