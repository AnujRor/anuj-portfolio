import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { PROFILE } from '../data'

function useTypewriter(words, typeSpeed = 60, deleteSpeed = 30, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    let timeout

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          setText(current.slice(0, deleting ? text.length - 1 : text.length + 1))
        },
        deleting ? deleteSpeed : typeSpeed,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause])

  return text
}

export default function Hero() {
  const typed = useTypewriter([PROFILE.heroType])
  const particlesRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: '#00f6ff' },
          shape: { type: 'circle' },
          opacity: { value: 0.4, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#00f6ff', opacity: 0.3, width: 1 },
          move: { enable: true, speed: 2.5, direction: 'none', random: true, out_mode: 'out' },
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
          modes: { grab: { distance: 140, line_linked: { opacity: 0.8 } }, push: { particles_nb: 5 } },
        },
      })
    }
  }, [])

  const stars = Array.from({ length: 20 })

  return (
    <section id="hero" className="relative min-h-[100vh] lg:min-h-[90vh] flex items-center overflow-hidden pb-8 md:pb-0">
      <div id="particles-js" ref={particlesRef} className="absolute inset-0" />

      <div className="absolute inset-0 overflow-hidden">
        {stars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            initial={{ opacity: 0.1 + Math.random() * 0.5 }}
            animate={{
              opacity: [0.1 + Math.random() * 0.5, 0.7 + Math.random() * 0.3, 0.1 + Math.random() * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{ repeat: Infinity, duration: 2 + Math.random() * 3, delay: Math.random() * 2 }}
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, boxShadow: '0 0 10px 2px rgba(0, 246, 255, 0.7)' }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 pt-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="w-full lg:w-1/2 mb-10 lg:mb-0"
          >
            <h1 className="font-exo text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide">
              <span className="hero-typing">{typed}</span>
              <span className="text-neon-blue animate-pulse">|</span>
            </h1>

            <h2 className="font-exo text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-wide">
              <span className="text-gradient">{PROFILE.headline}</span>
            </h2>

            <div className="flex flex-wrap gap-4">
              <a
                href="#about"
                className="group px-6 py-3 bg-tech-dark border border-neon-blue rounded-md font-medium text-neon-blue hover:bg-neon-blue/10 transition-all duration-300 flex items-center shadow-glow"
              >
                <span>Explore My Journey</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="#projects"
                className="group px-6 py-3 bg-neon-blue text-tech-dark rounded-md font-medium hover:bg-neon-blue/90 transition-all duration-300 border border-neon-blue flex items-center"
              >
                <span>View Projects</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full lg:w-1/2 flex justify-center items-center lg:justify-center lg:pr-8"
          >
            <div className="relative max-w-xs md:max-w-sm">
              <div className="absolute inset-0 bg-neon-blue/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 -translate-x-2 -translate-y-2 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
              <motion.div animate={{ y: [-10, 10, -10], rotateZ: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className="relative">
                <img
                  src={PROFILE.photo}
                  alt={`${PROFILE.name} - AI Entrepreneur`}
                  className="relative rounded-full w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover border-4 border-neon-blue shadow-lg"
                />
                <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-ping-slow" />
                <div className="absolute inset-0 scale-110 border-2 border-neon-blue/20 rounded-full" />
                <div className="absolute inset-0 scale-125 border border-neon-blue/10 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <a href="#about" className="text-neon-blue hover:text-white transition-colors duration-300 p-2">
          <ArrowDown className="w-7 h-7" />
        </a>
      </motion.div>
    </section>
  )
}