import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Camera, ArrowRight } from 'lucide-react'
import { PROJECTS } from '../data'

const GRID_BG =
  "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTBoODB2ODBoLTgweiIgc3Ryb2tlPSIjMDBmNmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMjBoNjB2NjBoLTYweiIgc3Ryb2tlPSIjMDBmNmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzAgMzBoNDB2NDBoLTQweiIgc3Ryb2tlPSIjMDBmNmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNDAgNDBoMjB2MjBoLTIweiIgc3Ryb2tlPSIjMDBmNmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')"

export default function Projects() {
  const [active, setActive] = useState({})

  useEffect(() => {
    const init = {}
    PROJECTS.forEach((p) => (init[p.id] = 0))
    setActive(init)
  }, [])

  const set = (id, index) => setActive((prev) => ({ ...prev, [id]: index }))

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: GRID_BG }} />
      <div className="absolute inset-0 bg-radial-gradient opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-exo text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-white"
        >
          My <span className="text-neon-blue">AI Innovations</span>
        </motion.h2>

        <div className="space-y-24">
          {PROJECTS.map((project, idx) => {
            const current = active[project.id] ?? 0
            const count = project.images.length
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-xl overflow-hidden border border-neon-blue/30 shadow-lg shadow-neon-blue/10 bg-dark-slate/70">
                    <div className="h-80 sm:h-96 lg:h-[32rem] overflow-hidden relative bg-tech-dark border-b border-neon-blue/20">
                      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 to-transparent opacity-50" />
                      {project.images.map((img, i) => (
                        <motion.div
                          key={img}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: current === i ? 1 : 0, scale: current === i ? 1 : 1.05 }}
                          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ display: current === i ? 'flex' : 'none', zIndex: current === i ? 2 : 1 }}
                        >
                          <img src={img} alt={`${project.title} Screenshot ${i + 1}`} className="w-full h-full object-contain p-2" />
                        </motion.div>
                      ))}

                      <button
                        onClick={() => set(project.id, (current - 1 + count) % count)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-dark-slate/70 text-neon-blue p-2 rounded-full hover:bg-neon-blue/20 hover:text-white transition-all duration-300 z-10 backdrop-blur-sm border border-neon-blue/20"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => set(project.id, (current + 1) % count)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-slate/70 text-neon-blue p-2 rounded-full hover:bg-neon-blue/20 hover:text-white transition-all duration-300 z-10 backdrop-blur-sm border border-neon-blue/20"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" strokeWidth={2} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-slate/95 to-transparent p-4 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                          <div className="text-white font-medium flex items-center">
                            <Camera className="text-neon-blue mr-2 h-4 w-4 inline-block" />
                            <span>
                              {current + 1} / {count}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {project.images.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => set(project.id, i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  current === i ? 'bg-neon-blue scale-125 ring-2 ring-neon-blue/30' : 'bg-gray-400 opacity-60 hover:opacity-100'
                                }`}
                                aria-label={`View image ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex p-3 bg-dark-slate/90 border-t border-neon-blue/10 justify-center gap-2">
                      {project.images.map((img, i) => (
                        <motion.div
                          key={img}
                          onClick={() => set(project.id, i)}
                          whileHover={{ y: -2, scale: 1.05 }}
                          whileTap={{ y: 1, scale: 0.98 }}
                          className={`cursor-pointer w-1/5 transition-all duration-300 ${current === i ? 'opacity-100' : 'opacity-40 hover:opacity-90'}`}
                        >
                          <div className={`h-14 rounded-md overflow-hidden shadow-md ${current === i ? 'ring-2 ring-neon-blue border border-neon-blue/50' : 'border border-gray-700'}`}>
                            <img src={img} alt={`${project.title} Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                            {current === i && <div className="absolute inset-0 bg-neon-blue/10 pointer-events-none" />}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="bg-dark-slate/70 rounded-xl p-6 backdrop-blur-sm border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-blue/30 rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-blue/30 rounded-br-lg" />

                    <div className="relative">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-exo text-2xl md:text-3xl font-bold text-white">{project.title}</h3>
                        <span className="px-3 py-1 rounded text-sm text-white bg-neon-blue/20 border border-neon-blue/30">{project.tag}</span>
                      </div>
                      <p className="text-light-gray text-lg mb-6">{project.longDescription}</p>

                      <div className="mb-6">
                        <h4 className="text-neon-blue font-semibold mb-4">Key Features</h4>
                        <ul className="space-y-2">
                          {project.features.map((f, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-neon-blue mr-2">▸</span>
                              <span className="text-white">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-neon-blue font-semibold mb-3">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((t, i) => (
                            <span key={i} className="bg-tech-dark text-sm px-3 py-1 rounded-full text-white border border-neon-blue/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={project.demoLink}
                        className="inline-flex items-center px-6 py-3 bg-neon-blue text-tech-dark rounded-md font-medium hover:bg-neon-blue/90 transition-all duration-300 text-sm md:text-base"
                      >
                        <span>View Live Demo</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}