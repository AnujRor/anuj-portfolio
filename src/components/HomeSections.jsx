import { useEffect } from 'react'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Services from './Services'
import Vision from './Vision'
import Contact from './Contact'

// Everything below the hero, in its own chunk so it downloads and runs after the hero is on screen
// (and never on blog pages). onReady fires once the sections are in the DOM.
export default function HomeSections({ onReady }) {
  useEffect(() => {
    onReady?.()
  }, [])

  return (
    <>
      <About />
      <Skills />
      <Projects />
      <Services />
      <Vision />
      <Contact />
    </>
  )
}
