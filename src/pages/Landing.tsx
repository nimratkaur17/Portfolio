import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import './Landing.css'

function Landing() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#projects') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <main>
      <Hero />
      <section id="projects" className="projects">
        <h2>Projects</h2>
      </section>
    </main>
  )
}

export default Landing
