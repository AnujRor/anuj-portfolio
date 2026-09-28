import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link } from '../router'

const LINKS = [
  { name: 'ABOUT', href: '/#about' },
  { name: 'SKILLS', href: '/#skills' },
  { name: 'PROJECTS', href: '/#projects' },
  { name: 'SERVICES', href: '/#services' },
  { name: 'BLOG', href: '/blog', page: true },
  { name: 'CONTACT', href: '/#contact' },
]

export default function Navbar({ path = '/', sectionsReady = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState('')
  const [hovered, setHovered] = useState(null)
  const isBlog = path.startsWith('/blog')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which home section is on screen; re-run when returning to the home page
  useEffect(() => {
    if (isBlog) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(`/#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['hero', ...LINKS.filter((l) => !l.page).map((l) => l.href.split('#')[1])].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isBlog, sectionsReady])

  const active = isBlog ? '/blog' : section
  const highlight = hovered ?? active

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Main navigation"
        className={`w-full transition-all duration-500 ${
          scrolled || open ? 'max-w-4xl mt-4 rounded-2xl glass shadow-[0_8px_40px_rgba(0,0,0,0.45)] px-5' : 'max-w-7xl mt-0 px-4 sm:px-6 lg:px-8 border border-transparent'
        }`}
      >
        <div className="flex justify-between h-16 items-center">
          <Link to="/#hero" onClick={() => setOpen(false)} className="group flex items-center font-exo text-xl font-bold text-white tracking-wide">
            <span className="text-neon-blue mr-1 transition-transform duration-300 group-hover:-translate-x-1">&lt;</span>
            Anuj
            <span className="text-neon-blue ml-1 transition-transform duration-300 group-hover:translate-x-1">/&gt;</span>
          </Link>

          <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {LINKS.map((l) => (
              <Link
                key={l.name}
                to={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className={`relative px-4 py-2 text-xs font-semibold tracking-[0.15em] transition-colors duration-300 ${
                  active === l.href ? 'text-neon-blue' : 'text-gray-300 hover:text-white'
                }`}
              >
                {highlight === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-neon-blue/10 border border-neon-blue/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {l.name}
                  {l.page && <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-glow-purple animate-pulse" />}
                </span>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="text-gray-300 hover:text-neon-blue focus:outline-none" aria-label="Toggle menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
                {LINKS.map((l, i) => (
                  <motion.div key={l.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium tracking-widest transition-colors duration-300 ${
                        active === l.href ? 'text-neon-blue bg-neon-blue/10' : 'text-gray-300 hover:text-neon-blue'
                      }`}
                    >
                      {l.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
