import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Quote } from 'lucide-react'
import { PROFILE } from '../data'
import { SectionTitle, Tilt } from './fx'
import { photoSrcSet, useSiteContent } from '../lib/content'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  const { about, journey } = useSiteContent()
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 80%', 'end 60%'] })

  return (
    <section id="about" className="cv-auto py-28 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle index="01" eyebrow="About Anuj Ror" accent="Me">
          About
        </SectionTitle>

        <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="w-full md:w-2/3"
          >
            <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-exo font-bold text-white mb-6">
              <span className="text-shine">{about.title}</span> {about.from}
            </motion.h3>
            {about.paragraphs.map((p, i) => (
              <motion.p key={i} variants={fadeUp} className="text-light-gray text-lg leading-relaxed mb-6">
                {p}
              </motion.p>
            ))}
            <motion.p variants={fadeUp} className="text-lg leading-relaxed">
              <span className="bg-gradient-to-r from-neon-blue via-white to-neon-purple text-transparent bg-clip-text text-2xl font-bold">
                {about.closing}
              </span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <Tilt max={12}>
              <div className="relative w-64 h-64 md:w-56 md:h-56 lg:w-80 lg:h-80">
                <div className="absolute inset-0 bg-neon-blue/25 rounded-[2.5rem] blur-2xl -translate-x-3 -translate-y-3" />
                <div className="absolute inset-0 bg-neon-purple/20 rounded-[2.5rem] blur-2xl translate-x-3 translate-y-3" />
                <div className="border-spin relative w-full h-full rounded-[2.5rem] p-[3px] bg-dark-slate">
                  <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden">
                    <img src={about.photo} srcSet={photoSrcSet(about.photo)} sizes="(min-width: 1024px) 320px, (min-width: 768px) 224px, 256px" alt={`${PROFILE.fullName}, AI developer and entrepreneur from Harsola, Haryana`} width="640" height="640" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-dark/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 glass rounded-xl px-4 py-2 text-sm text-white flex items-center gap-2" style={{ transform: 'translateZ(40px)' }}>
                      <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                      {about.place}
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-20"
        >
          <div className="border-spin p-8 md:p-10 rounded-3xl glass relative overflow-hidden">
            <Quote className="absolute -top-2 right-6 w-28 h-28 text-neon-blue/10 rotate-180" />
            <h3 className="text-2xl md:text-3xl font-exo font-bold text-white mb-6 pl-6 border-l-4 border-neon-blue">{about.storyTitle}</h3>
            <div className="space-y-6 text-lg relative">
              {about.story.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className={i === 0 ? 'text-white text-xl font-semibold' : 'text-light-gray'}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-exo font-bold text-white mb-10 text-center">
            My <span className="text-neon-blue">Journey</span>
          </h3>
          <div ref={timelineRef} className="relative pl-10">
            <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[15px] top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-neon-blue to-neon-purple rounded-full shadow-[0_0_12px_rgba(0,246,255,0.8)]"
            />
            {journey.timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="relative mb-8 last:mb-0"
              >
                <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-tech-dark border-2 border-neon-blue shadow-glow">
                  <div className="absolute inset-1 rounded-full bg-neon-blue animate-pulse" />
                </div>
                <div className="group glass rounded-2xl p-5 md:p-6 hover:border-neon-blue/40 transition-all duration-300 hover:translate-x-1">
                  <span className="inline-block font-exo font-bold text-3xl text-outline group-hover:text-neon-blue transition-colors duration-500 mb-1">
                    {t.year}
                  </span>
                  <p className="text-white/90">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
