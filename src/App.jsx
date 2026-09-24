import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Vision from './components/Vision'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import Background from './components/Background'
import Blog from './components/Blog'
import { usePath } from './router'
import { useRouteSeo } from './seo'

// Admin code is only downloaded when someone opens /admin
const Admin = lazy(() => import('./admin/Admin'))

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[70] bg-gradient-to-r from-neon-blue via-white to-neon-purple shadow-[0_0_12px_rgba(0,246,255,0.8)]"
    />
  )
}

export default function App() {
  const path = usePath()
  const isBlog = path.startsWith('/blog')
  const isAdmin = path.startsWith('/admin')
  // Intro loader only on the first desktop home-page visit of a session, so it never delays
  // mobile users (slow CPUs), blog pages or repeat views
  const [loading, setLoading] = useState(() => {
    if (isAdmin || isBlog) return false
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) return false
    try {
      return !sessionStorage.getItem('intro-seen')
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      setLoading(false)
      try {
        sessionStorage.setItem('intro-seen', '1')
      } catch {}
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  // Hero renders first; the sections below it render as a low-priority transition, which React
  // splits into small chunks instead of one long main-thread task
  const [showRest, setShowRest] = useState(false)
  useEffect(() => {
    startTransition(() => setShowRest(true))
  }, [])

  // Opening /#projects directly: scroll once the lower sections exist
  useEffect(() => {
    if (!showRest || isBlog || !window.location.hash) return
    requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView())
  }, [showRest])

  useRouteSeo({ path: '/' }, !isBlog && !isAdmin)

  if (isAdmin) {
    return (
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<div className="min-h-screen bg-tech-dark" />}>
          <Admin path={path} />
        </Suspense>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>
      <div className="overflow-hidden grain relative">
        <Background />
        <ScrollProgress />
        <CustomCursor />
        <Navbar path={path} sectionsReady={showRest} />
        <main className="relative z-10 min-h-screen">
          {isBlog ? (
            <Blog path={path} />
          ) : (
            <>
              <Hero ready={!loading} />
              {showRest && (
                <>
                  <About />
                  <Skills />
                  <Projects />
                  <Vision />
                  <Contact />
                </>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
