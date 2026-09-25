import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '../data'
import { Link } from '../router'

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap'

// Blog fonts and page colours are only loaded while the blog is open, so the portfolio stays untouched
function useBlogTheme() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONTS_HREF}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = FONTS_HREF
      document.head.appendChild(link)
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    const prevTheme = themeMeta?.getAttribute('content')
    themeMeta?.setAttribute('content', '#FFFFFF')
    document.body.classList.add('blog-mode')
    return () => {
      document.body.classList.remove('blog-mode')
      if (prevTheme) themeMeta?.setAttribute('content', prevTheme)
    }
  }, [])
}

function BlogNavbar({ isPost }) {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white/70 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_#E2E8F0]' : ''}`}>
      <nav aria-label="Blog navigation" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/blog" className="flex items-baseline gap-2 text-ink">
          <span className="font-serif text-2xl font-semibold tracking-tight">{PROFILE.name}<span className="text-accent">.</span></span>
          <span className="font-ui text-[11px] font-medium uppercase tracking-[0.22em] text-ink-faint">Journal</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 font-ui text-sm">
          <Link to="/blog" className="hidden sm:inline-flex px-3 py-2 text-ink-soft hover:text-ink transition-colors">
            Articles
          </Link>
          <Link to="/#about" className="hidden sm:inline-flex px-3 py-2 text-ink-soft hover:text-ink transition-colors">
            About
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-medium text-white shadow-sm shadow-accent/20 hover:bg-accent/90 transition-colors"
          >
            Portfolio
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </nav>
      <div className="h-px bg-rule" />
      {isPost && <motion.div style={{ scaleX: progress }} className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-accent" />}
    </header>
  )
}

function BlogFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 w-[36rem] h-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 grid gap-8 md:grid-cols-[1.4fr_1fr] items-start">
        <div>
          <p className="font-serif text-2xl font-semibold text-white">
            {PROFILE.name} <span className="font-normal italic text-indigo-300">Journal</span>
          </p>
          <p className="mt-3 max-w-md font-serif text-lg leading-relaxed text-slate-300">
            Notes on building AI from a small village in Haryana: projects, experiments and lessons learned along the way.
          </p>
        </div>
        <nav aria-label="Footer" className="font-ui text-sm md:justify-self-end">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            {[
              ['All articles', '/blog'],
              ['Portfolio', '/'],
              ['Projects', '/#projects'],
              ['Contact', '/#contact'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-slate-300 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative py-5 border-t border-white/10 font-ui text-xs text-slate-400 flex flex-col sm:flex-row gap-2 justify-between">
        <p>
          © {year} {PROFILE.fullName}. All rights reserved.
        </p>
        <p>{PROFILE.location}</p>
      </div>
    </footer>
  )
}

export default function BlogShell({ isPost, children }) {
  useBlogTheme()
  return (
    <div className="relative isolate min-h-screen flex flex-col bg-paper text-ink font-ui antialiased">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute -top-32 right-[-10rem] w-[36rem] h-[36rem] rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 w-[40rem] h-[30rem] rounded-full bg-sky-200/50 blur-3xl" />
      </div>
      <BlogNavbar isPost={isPost} />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  )
}
