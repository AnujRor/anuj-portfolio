import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useSiteContent } from '../lib/content'
import { Magnetic, Marquee, SectionTitle } from './fx'

export default function Vision() {
  const { capabilities } = useSiteContent()
  const { vision } = capabilities
  const letterContainer = {
    hidden: { opacity: 0, y: 20 },
    visible: (n) => ({
      opacity: 1,
      y: 0,
      transition: { delay: n * 0.04, duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] },
    }),
  }

  return (
    <section id="vision" className="cv-auto min-h-screen flex items-center justify-center relative py-28 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(0,246,255,0.06),rgba(5,8,12,0.7)_70%)]">
        <div className="absolute inset-0 circuit-pattern opacity-10 animate-circuit-glow" />
        <div className="absolute inset-0 bg-radial-gradient" />
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-neon-blue/20 rounded-full animate-ring"
              style={{ width: `${(i + 1) * 15}%`, height: `${(i + 1) * 15}%`, animationDuration: `${20 + i * 5}s` }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <SectionTitle index="04" eyebrow="Manifesto" accent="Vision" className="!mb-20">
          My
        </SectionTitle>

        <div className="flex flex-col items-center space-y-10 mb-16">
          {vision.map((statement, row) => (
            <motion.div
              key={row}
              className="overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 blur-md text-neon-blue opacity-30 pointer-events-none font-bold text-center text-[clamp(1.35rem,6.5vw,1.5rem)] md:text-3xl lg:text-5xl"
                  aria-hidden
                >
                  {statement}
                </div>
                <h3
                  className={`font-exo font-bold text-white tracking-wide inline-block max-w-full text-[clamp(1.35rem,6.5vw,1.5rem)] md:text-3xl lg:text-5xl ${
                    row % 2 === 0 ? '' : 'text-neon-blue'
                  }`}
                >
                  {/* Words stay whole but can wrap onto a new line on narrow phones */}
                  {statement.split(' ').map((word, w, words) => {
                    const start = words.slice(0, w).join(' ').length + (w ? 1 : 0)
                    return (
                      <Fragment key={w}>
                        <span className="inline-block whitespace-nowrap">
                          {word.split('').map((ch, i) => (
                            <motion.span key={i} custom={start + i} variants={letterContainer} className="inline-block">
                              {ch}
                            </motion.span>
                          ))}
                        </span>
                        {w < words.length - 1 && ' '}
                      </Fragment>
                    )
                  })}
                </h3>
                {row % 2 === 1 && (
                  <motion.div
                    className="h-[2px] bg-neon-blue mt-2 mx-auto rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: vision.length * 0.2 + 0.5, duration: 1 }}
          className="relative mt-12 flex justify-center"
        >
          <Magnetic className="relative">
          <div className="absolute inset-0 blur-lg bg-neon-blue opacity-30 rounded-full scale-110" />
          <a
            href="#contact"
            className="relative inline-flex items-center px-8 py-4 bg-tech-dark text-neon-blue rounded-full font-semibold border border-neon-blue transition-all duration-300 overflow-hidden group hover:shadow-glow-intense"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-neon-blue/10 skew-x-[-20deg] transform -translate-x-full group-hover:translate-x-[200%] transition-all duration-1000" />
            <span className="relative z-10">{capabilities.visionButton}</span>
            <span className="relative z-10 ml-2 animate-nudge-x">
              <ArrowRight className="h-5 w-5" />
            </span>
          </a>
          </Magnetic>
        </motion.div>
      </div>

      <div className="absolute bottom-6 inset-x-0 opacity-40 pointer-events-none">
        <Marquee reverse items={capabilities.visionMarquee} />
      </div>
    </section>
  )
}