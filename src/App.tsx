import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Cursor from './components/Cursor'
import Grain from './components/Grain'
import Nav from './components/Nav'
import About from './pages/About'
import CaseStudy from './pages/CaseStudy'
import Landing from './pages/Landing'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Cursor />
      <Grain />
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/case/:slug" element={<CaseStudy />} />
      </Routes>
    </div>
  )
}

export default App
