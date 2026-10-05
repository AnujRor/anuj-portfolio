import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import { usePath } from './router'
import { useRouteSeo } from './seo'
import { useProjects } from './lib/content'

// Admin code is only downloaded when someone opens /admin
const Admin = lazy(() => import('./admin/Admin'))

// Blog and the sections below the hero are separate chunks: blog readers skip the portfolio code and
// home visitors skip the blog code. A blog URL starts its download right away instead of after React renders.
const loadBlog = () => import('./components/Blog')
if (window.location.pathname.startsWith('/blog')) loadBlog()
const Blog = lazy(loadBlog)
const HomeSections = lazy(() => import('./components/HomeSections'))

// Heavy decorative components: load after first paint on desktop only
const Background = lazy(() => import('./components/Background'))
const CustomCursor = lazy(() => import('./components/CustomCursor'))

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
  const [sectionsReady, setSectionsReady] = useState(false)
  useEffect(() => {
    startTransition(() => setShowRest(true))
  }, [])

  // Opening /#projects directly: scroll once the lower sections exist
  useEffect(() => {
    if (!sectionsReady || isBlog || !window.location.hash) return
    requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView())
  }, [sectionsReady])

  // Load decorative components after first paint (desktop only)
  const [showDecor, setShowDecor] = useState(false)
  useEffect(() => {
    if (isBlog || isAdmin || window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) {
      setShowDecor(false)
      return
    }
    const timer = requestIdleCallback?.(() => setShowDecor(true)) ?? setTimeout(() => setShowDecor(true), 2000)
    return () => { cancelIdleCallback?.(timer); clearTimeout(timer) }
  }, [isBlog, isAdmin])

  // Projects feed the home page's structured data (same cached request the Projects section uses)
  const { data: projects, loading: projectsLoading } = useProjects()
  useRouteSeo({ path: '/', projects }, !isBlog && !isAdmin && !projectsLoading)

  if (isAdmin) {
    return (
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<div className="min-h-screen bg-tech-dark" />}>
          <Admin path={path} />
        </Suspense>
      </MotionConfig>
    )
  }

  // The blog is its own light editorial site: no portfolio navbar, neon background, cursor or footer
  if (isBlog) {
    return (
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<div className="min-h-screen bg-paper" />}>
          <Blog path={path} />
        </Suspense>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>
      <div className="overflow-hidden grain relative">
        {showDecor && <Suspense fallback={null}><Background /></Suspense>}
        <ScrollProgress />
        {showDecor && <Suspense fallback={null}><CustomCursor /></Suspense>}
        <Navbar path={path} sectionsReady={sectionsReady} />
        <main className="relative z-10 min-h-screen">
          <Hero ready={!loading} />
          {showRest && (
            <Suspense fallback={null}>
              <HomeSections onReady={() => setSectionsReady(true)} />
            </Suspense>
          )}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
