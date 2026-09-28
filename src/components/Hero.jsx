import { useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Bot, Brain, Download, Mic, Sparkles } from 'lucide-react'
import { RESUME_URL } from '../config'
import { PROFILE, PROJECTS as STATIC_PROJECTS } from '../data'
import { useProjects, useSiteContent } from '../lib/content'
import { Magnetic, Marquee } from './fx'

function useTypewriter(words, typeSpeed = 60, deleteSpeed = 30, pause = 1600, enabled = true) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!enabled) return
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
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, enabled])

  return text
}

const ORBIT = [Bot, Brain, Mic, Sparkles]

// Own component so each typed letter re-renders only this line, not the whole hero
function TypedLine({ ready, text }) {
  const words = useMemo(() => [text], [text])
  const typed = useTypewriter(words, 60, 30, 1600, ready)
  return (
    <>
      <span>{typed}</span>
      <span className="text-neon-blue animate-pulse">|</span>
    </>
  )
}

export default function Hero({ ready = true }) {
  const { data: remoteProjects } = useProjects()
  const PROJECTS = remoteProjects.length ? remoteProjects : STATIC_PROJECTS
  const { hero } = useSiteContent()

  // Mouse parallax for the portrait
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-25, 25]), { stiffness: 80, damping: 20 })
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-25, 25]), { stiffness: 80, damping: 20 })

  // Content drifts and fades as you scroll away
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, 120])
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0])

  const onMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  const headlineWords = hero.headline.split(' ')
  const show = ready ? 'visible' : 'hidden'

  return (
    <section id="hero" onMouseMove={onMove} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-8">
      {/* Giant faint wordmark behind the hero */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-exo font-bold leading-none text-[28vw] text-outline opacity-40">AI</span>
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative flex-1 flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial="hidden"
            animate={show}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass text-sm text-light-gray"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-green" />
              </span>
              {hero.badge}
            </motion.div>

            {/* Full heading for search engines & screen readers; the typing effect below is visual only */}
            <h1 className="sr-only">{PROFILE.fullName} — AI Developer &amp; Voice AI Builder from Haryana, India</h1>
            <motion.div
              aria-hidden="true"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="font-exo text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide min-h-[1.2em]"
            >
              <TypedLine ready={ready} text={hero.typed} />
            </motion.div>

            <p className="font-exo text-3xl md:text-4xl lg:text-5xl font-bold mb-10 tracking-wide leading-tight">
              {headlineWords.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-1">
                  <motion.span
                    className="inline-block text-shine"
                    variants={{ hidden: { y: '110%', rotate: 6 }, visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neon-blue text-tech-dark font-semibold overflow-hidden shadow-[0_0_30px_rgba(0,246,255,0.35)]"
                >
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative">View My Work</span>
                  <ArrowUpRight className="relative w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="border-spin relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-white font-semibold hover:text-neon-blue transition-colors">
                  Let's Talk
                </a>
              </Magnetic>
              {RESUME_URL && (
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-light-gray font-semibold hover:text-neon-blue transition-colors">
                  <Download className="w-4 h-4" /> Resume
                </a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            // Photo is the LCP element: visible from the first frame, only a gentle zoom-in
            initial={{ scale: 0.92 }}
            animate={ready ? { scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: px, y: py }}
            className="w-full lg:w-1/2 flex justify-center items-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem]">
              <div className="absolute inset-0 bg-neon-blue/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 -translate-x-4 -translate-y-4 bg-neon-purple/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />

              {/* Spinning gradient ring */}
              <div
                className="absolute -inset-3 rounded-full animate-spin-slow"
                style={{ background: 'conic-gradient(from 0deg, #00f6ff, transparent 30%, #b026ff 55%, transparent 80%, #00f6ff)' }}
              />
              <div className="absolute -inset-2 rounded-full bg-tech-dark" />

              <img
                src={hero.photo}
                alt={`${PROFILE.fullName}, AI developer and voice AI builder from India`}
                width="640"
                height="640"
                fetchpriority="high"
                decoding="async"
                className="relative rounded-full w-full h-full object-cover animate-float"
              />

              {/* Dashed orbit with floating icons */}
              <div className="absolute -inset-10 md:-inset-14 rounded-full border border-dashed border-neon-blue/25 animate-spin" style={{ animationDuration: '30s' }}>
                {ORBIT.map((Icon, i) => {
                  const angle = (i / ORBIT.length) * Math.PI * 2
                  return (
                    <div
                      key={i}
                      className="absolute w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 rounded-xl glass flex items-center justify-center text-neon-blue shadow-glow animate-spin-reverse"
                      style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  )
                })}
              </div>

              {/* Floating info chips */}
              <div className="absolute -left-6 md:-left-16 top-6 animate-float" style={{ animationDuration: '4s' }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={ready ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-green" />
                </span>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold leading-tight">{hero.chipTitle}</p>
                  <p className="text-gray-400 text-[11px]">{hero.chipText}</p>
                </div>
              </motion.div>
              </div>
              <div className="absolute -right-4 md:-right-14 bottom-8 animate-float" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={ready ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-tech-dark">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold leading-tight">{PROJECTS.length} AI Projects</p>
                  <p className="text-gray-400 text-[11px]">Designed & built solo</p>
                </div>
              </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.4 }} className="relative z-10 mt-16 space-y-3">
        <Marquee items={['AI Dost', 'Voice AI', ...PROJECTS.map((p) => p.title).filter((t) => t !== 'AI Dost'), 'Real-time Agents', 'Future Builder']} />
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll down"
        className="hidden md:flex absolute bottom-24 right-10 z-10 flex-col items-center gap-2 text-neon-blue/80 hover:text-white transition-colors animate-bob"
      >
        <span className="text-[10px] tracking-[0.4em] [writing-mode:vertical-rl]">SCROLL</span>
        <ArrowDown className="w-4 h-4" />
      </a>
    </section>
  )
}
