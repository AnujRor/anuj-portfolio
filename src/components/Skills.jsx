import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
  const [value, setValue] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now()
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              setValue(Math.floor(progress * target))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )
    const el = document.querySelector('.stats-counter')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <>
      {value}
      {suffix && <span className="text-neon-blue">{suffix}</span>}
    </>
  )
}

export default function Skills() {
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <section id="skills" className="py-24 relative bg-tech-dark/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-exo text-3xl md:text-4xl font-bold mb-16"
        >
          My <span className="text-neon-blue">Capabilities</span>
        </motion.h2>

        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
          {PROFILE.skills.map((s) => {
            const Icon = ICONS[s.iconType] || Lightbulb
            return (
              <motion.div key={s.name} variants={item} whileHover={{ scale: 1.05 }} className="skill-card group">
                <div className="relative bg-dark-slate bg-opacity-50 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center text-center overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-neon-blue" />
                    <div className="absolute inset-y-0 right-0 w-[2px] bg-neon-blue" />
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neon-blue" />
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-neon-blue" />
                    <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,246,255,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="w-12 h-12 mb-4 text-neon-blue flex items-center justify-center">
                    <Icon size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-exo font-semibold text-white mb-2">{s.name}</h3>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {PROFILE.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
              className="stats-counter text-center"
            >
              <div className="text-neon-blue font-exo text-4xl md:text-5xl font-bold mb-2">
                <Counter target={s.value} suffix={s.suffix} duration={i === 1 ? 2000 : 1000 + i * 500} />
              </div>
              <p className="text-light-gray font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}