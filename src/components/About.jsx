import { motion } from 'framer-motion'
import { PROFILE } from '../data'

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      <div className="absolute inset-0 bg-radial-gradient" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center font-exo text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-white"
        >
          About <span className="text-neon-blue">Me</span>
        </motion.h2>

        <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="w-full md:w-2/3"
          >
            <h3 className="text-2xl md:text-3xl font-exo font-bold text-white mb-6">
              <span className="text-neon-blue">{PROFILE.dreamer}</span> {PROFILE.from}
            </h3>
            {PROFILE.about.paragraphs.map((p, i) => (
              <p key={i} className="text-light-gray text-lg leading-relaxed mb-6">
                {p}
              </p>
            ))}
            <p className="text-light-gray text-lg leading-relaxed">
              <span className="bg-gradient-to-r from-neon-blue to-white text-transparent bg-clip-text text-2xl font-bold">{PROFILE.about.closing}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl transform -translate-x-2 -translate-y-2" />
              <div className="absolute inset-0 bg-neon-purple/10 rounded-full blur-xl transform translate-x-2 translate-y-2" />
              <div className="relative rounded-full border-4 border-neon-blue/50 overflow-hidden w-64 h-64 md:w-80 md:h-80">
                <img src={PROFILE.aboutPhoto} alt={`${PROFILE.name} - AI Entrepreneur`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full animate-ping-slow" />
                <div className="absolute inset-0 scale-110 border-2 border-neon-blue/10 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          className="mb-16"
        >
          <div className="p-8 rounded-xl bg-dark-slate/80 backdrop-blur-md border border-neon-blue/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-blue/40 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-blue/40 rounded-br-lg" />
            <h3 className="text-2xl md:text-3xl font-exo font-bold text-white mb-6 pl-6 border-l-4 border-neon-blue">My Story</h3>
            <div className="space-y-6 text-lg">
              {PROFILE.about.story.map((p, i) => (
                <p key={i} className="text-light-gray">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <h3 className="text-2xl md:text-3xl font-exo font-bold text-white mb-8 text-center">
              My <span className="text-neon-blue">Journey</span>
            </h3>
            <div className="timeline-container p-4 bg-dark-slate/50 backdrop-blur-sm rounded-lg border border-gray-800">
              <div className="timeline-line" />
              {PROFILE.about.timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 * (i + 1) }}
                  className="timeline-item"
                >
                  <div className="timeline-dot animate-pulse" />
                  <div className="timeline-content">
                    <h3 className="text-neon-blue font-exo font-bold text-xl">{t.year}</h3>
                    <p className="text-white">{t.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}