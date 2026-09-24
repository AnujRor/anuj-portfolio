import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { PROFILE } from '../data'
import { Magnetic } from './fx'
import { Link } from '../router'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 pt-16 pb-8 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-blue/60 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center select-none mb-10"
        >
          <span className="font-exo font-bold leading-none text-[22vw] md:text-[16vw] text-outline block">{PROFILE.name.toUpperCase()}</span>
          <span
            className="absolute inset-0 font-exo font-bold leading-none text-[22vw] md:text-[16vw] text-shine opacity-20 blur-2xl"
            aria-hidden
          >
            {PROFILE.name.toUpperCase()}
          </span>
        </motion.div>

        <nav aria-label="Footer" className="mb-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              ['About', '/#about'],
              ['Skills', '/#skills'],
              ['Projects', '/#projects'],
              ['Vision', '/#vision'],
              ['Blog', '/blog'],
              ['Contact', '/#contact'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-neon-blue transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {year} {PROFILE.name}. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">The Future of Intelligent Innovation</p>
          <Magnetic>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              aria-label="Back to top"
              className="group flex w-11 h-11 items-center justify-center rounded-full glass text-neon-blue hover:bg-neon-blue hover:text-tech-dark transition-colors duration-300"
            >
              <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
