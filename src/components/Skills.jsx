import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Bot,
  Volume2,
  AudioWaveform,
  Heart,
  Video,
  Mic,
  MessageCircle,
  Brain,
  Pencil,
  Lightbulb,
} from 'lucide-react'
import { PROFILE } from '../data'
import { SectionTitle, SpotlightCard } from './fx'

const ICONS = {
  Bot,
  Volume2,
  Waveform: AudioWaveform,
  Heart,
  Video,
  Mic,
  MessageCircle,
  Brain,
  Pencil,
  Lightbulb,
}

function Counter({ target, suffix, duration }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.floor((1 - Math.pow(1 - progress, 4)) * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix && <span className="text-neon-blue">{suffix}</span>}
    </span>
  )
}

export default function Skills() {
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }
  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }
  const [active, setActive] = useState(null)

  return (
    <section id="skills" className="cv-auto py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle index="02" eyebrow="Toolkit" accent="Capabilities">
          My
        </SectionTitle>

        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-24">
          {PROFILE.skills.map((s, i) => {
            const Icon = ICONS[s.iconType] || Lightbulb
            const showName = active === s.name
            return (
              <motion.div key={s.name} variants={item} whileHover={{ y: -6 }} whileTap={{ scale: 0.97 }} onClick={() => setActive(showName ? null : s.name)} className="clickable">
                <SpotlightCard
                  color={i % 2 ? '176, 38, 255' : '0, 246, 255'}
                  className="h-full rounded-2xl glass p-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[150px] cursor-pointer"
                >
                  <div className="relative mb-4 animate-float-sm" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="absolute inset-0 rounded-2xl bg-neon-blue/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {s.image ? (
                      <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <img src={s.image} alt={s.name} loading="lazy" decoding="async" width="36" height="36" className="w-9 h-9 object-contain" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
                      </div>
                    ) : (
                      <div className="relative w-14 h-14 rounded-2xl text-neon-blue flex items-center justify-center border border-neon-blue/30">
                        <Icon size={24} />
                      </div>
                    )}
                  </div>
                  <span className={`relative font-exo font-semibold text-sm md:text-[0.95rem] leading-tight transition-colors duration-300 ${showName ? 'text-neon-blue' : 'text-white/85 group-hover:text-white'}`}>
                    {s.name}
                  </span>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PROFILE.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.6 }}
            >
              <SpotlightCard className="border-spin rounded-2xl glass p-8 text-center">
                <div className="relative text-white font-exo text-4xl md:text-5xl font-bold mb-2">
                  <Counter target={s.value} suffix={s.suffix} duration={1800 + i * 300} />
                </div>
                <p className="relative text-light-gray font-medium text-sm tracking-wide uppercase">{s.label}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
