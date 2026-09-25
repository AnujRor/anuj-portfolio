import { motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, MapPin } from 'lucide-react'
import { SOCIALS } from '../config'
import { PROFILE } from '../data'
import { Magnetic } from './fx'
import { Link } from '../router'

const SOCIAL_ICONS = { linkedin: Linkedin, instagram: Instagram, github: Github }
const SOCIAL_LABELS = { linkedin: 'LinkedIn', instagram: 'Instagram', github: 'GitHub' }

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      ['About', '/#about'],
      ['Skills', '/#skills'],
      ['Projects', '/#projects'],
      ['Vision', '/#vision'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Blog', '/blog'],
      ['Contact', '/#contact'],
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 mt-10 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent to-black/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-16 md:py-20 border-b border-white/10"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-neon-blue mb-4">Let's work together</p>
            <h2 className="font-exo text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Have an idea worth building? <span className="text-gray-500">Let's make it real.</span>
            </h2>
          </div>
          <Magnetic>
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-neon-blue px-7 py-4 font-semibold text-tech-dark hover:shadow-glow transition-shadow duration-300"
            >
              Start a conversation
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Magnetic>
        </motion.div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-8 py-14">
          <div className="col-span-2 md:col-span-5">
            <Link to="/#hero" className="group inline-flex items-center font-exo text-2xl font-bold text-white tracking-wide">
              <span className="text-neon-blue mr-1 transition-transform duration-300 group-hover:-translate-x-1">&lt;</span>
              {PROFILE.name}
              <span className="text-neon-blue ml-1 transition-transform duration-300 group-hover:translate-x-1">/&gt;</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Self-taught AI entrepreneur building voice AI companions and real-time assistants that speak, feel and solve real problems.
            </p>
            <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
              </span>
              Open to collaborations
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">{col.title}</h3>
              <ul className="space-y-3 text-sm">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-400 hover:text-neon-blue transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">Connect</h3>
            <ul className="space-y-3 text-sm">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.type] || Linkedin
                return (
                  <li key={s.type}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                      <span className="flex w-8 h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] group-hover:border-neon-blue/50 group-hover:text-neon-blue transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      {SOCIAL_LABELS[s.type] || s.type}
                    </a>
                  </li>
                )
              })}
            </ul>
            <p className="mt-6 flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-neon-blue" />
              {PROFILE.location}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/10">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {year} {PROFILE.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p className="hidden sm:block text-gray-500 text-sm">The Future of Intelligent Innovation</p>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              aria-label="Back to top"
              className="group flex w-10 h-10 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:border-neon-blue hover:text-neon-blue transition-colors duration-300"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
