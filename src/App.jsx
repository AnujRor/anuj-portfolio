import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Vision from './components/Vision'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import { PROFILE } from './data'

export default function App() {
  useEffect(() => {
    document.title = PROFILE.title
  }, [])

  return (
    <div className="overflow-hidden">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Vision />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}