import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { name: 'ABOUT', href: '#about' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'VISION', href: '#vision' },
  { name: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-tech-dark/80 backdrop-blur-md border-b border-neon-blue/20' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <a href="#hero" onClick={() => setOpen(false)} className="flex items-center font-exo text-xl font-bold text-white tracking-wide">
            <span className="text-neon-blue mr-1">&lt;</span>
            Anuj
            <span className="text-neon-blue ml-1">/&gt;</span>
          </a>

          <div className="hidden md:flex space-x-8">
            {LINKS.map((l) => (
              <a key={l.name} href={l.href} className="text-sm font-medium text-gray-300 hover:text-neon-blue transition-colors duration-300">
                {l.name}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="text-gray-300 hover:text-neon-blue focus:outline-none" aria-label="Toggle menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-slate border-b border-neon-blue/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {LINKS.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-gray-300 hover:text-neon-blue transition-colors duration-300 text-sm font-medium"
                >
                  {l.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}