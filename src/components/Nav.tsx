import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Nav.css'

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const handleProjectsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#projects')
    }
  }

  return (
    <>
      <div ref={sentinelRef} className="nav-scroll-sentinel" aria-hidden="true" />
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <Link to="/" className="nav__logo">
          NK
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
    </>
  )
}

export default Nav
