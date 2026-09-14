import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
      <section className="hero">
        <h1>Nimrat Kaur</h1>
        <p>Product designer who also builds.</p>
      </section>
      <section id="projects" className="projects">
        <h2>Projects</h2>
      </section>
    </main>
  )
}

export default Landing
