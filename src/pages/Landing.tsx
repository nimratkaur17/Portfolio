import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import ProjectStack from '../components/ProjectStack'

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
      <ProjectStack />
    </main>
  )
}

export default Landing
