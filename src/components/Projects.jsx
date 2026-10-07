import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown, Camera, ArrowRight, BookOpen, Github } from 'lucide-react'
import { usePosts, useProjects } from '../lib/content'
import { Link } from '../router'
import { SectionTitle, SpotlightCard, Magnetic } from './fx'

const hasDemo = (project) => /^https?:\/\//.test(project.demoLink || '')
const hasRepo = (project) => /^https?:\/\//.test(project.repoLink || '')
// Status set in admin wins; otherwise a project with a live demo is "Live", the rest "In development"
const statusOf = (project) => project.status || (hasDemo(project) ? 'Live' : 'In development')

// Projects shown before the "See more" button
const INITIAL_COUNT = 4


export default function Projects() {
  const { data: PROJECTS } = useProjects()
  const { data: posts } = usePosts()
  // Blog post the GitHub sync wrote for a project (same repo id)
  const storyOf = (project) => project.githubId && posts.find((p) => p.githubId === project.githubId)
  const [active, setActive] = useState({})
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT)
  const hidden = PROJECTS.length - INITIAL_COUNT

  const toggleAll = () => {
    setShowAll((v) => !v)
    // After "Show less", keep the button in view instead of leaving the reader far below the list
    if (showAll) requestAnimationFrame(() => document.getElementById('projects-more')?.scrollIntoView({ block: 'center' }))
  }


  const set = (id, index) => setActive((prev) => ({ ...prev, [id]: index }))

  return (
    <section id="projects" className="cv-auto py-28 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle index="03" eyebrow="AI & Voice AI Projects" accent="AI Innovations">
          My
        </SectionTitle>

        <div className="space-y-28">
          {shown.map((project, idx) => {
            const current = active[project.id] ?? 0
            const count = project.images.length
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="border-spin relative rounded-3xl overflow-hidden bg-dark-slate/70 shadow-[0_20px_80px_-20px_rgba(0,246,255,0.25)] transition-transform duration-500 hover:-translate-y-1">
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
                          <img src={img} alt={`${project.title} by Anuj Ror — ${project.tag} project screenshot ${i + 1}`} loading="lazy" decoding="async" width="1200" height="800" className="w-full h-full object-contain p-2" />
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
                            <img src={img} alt={`${project.title} by Anuj Ror — thumbnail ${i + 1}`} loading="lazy" decoding="async" width="160" height="56" className="w-full h-full object-cover" />
                            {current === i && <div className="absolute inset-0 bg-neon-blue/10 pointer-events-none" />}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <SpotlightCard className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    <span className="absolute -top-4 right-4 font-exo font-bold text-8xl md:text-9xl text-outline select-none pointer-events-none">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="relative">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="font-exo text-2xl md:text-4xl font-bold text-white">{project.title}</h3>
                        <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-neon-blue bg-neon-blue/10 border border-neon-blue/30">
                          {project.tag}
                        </span>
                      </div>
                      <p className={`inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase ${statusOf(project) === 'Live' ? 'text-neon-green' : 'text-amber-300'}`}>
                        <span className={`w-2 h-2 rounded-full ${statusOf(project) === 'Live' ? 'bg-neon-green' : 'bg-amber-300'}`} />
                        {statusOf(project)}
                      </p>
                      <p className="text-light-gray text-lg mb-6 whitespace-pre-line">{project.longDescription || project.description}</p>

                      {/* Projects synced from GitHub may have no features / stack; skip the empty headings */}
                      {project.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-neon-blue font-semibold mb-4 text-sm tracking-[0.2em] uppercase">Key Features</h4>
                        <ul className="space-y-2">
                          {project.features.map((f, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -16 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + i * 0.08 }}
                              className="flex items-start"
                            >
                              <span className="text-neon-blue mr-2">▸</span>
                              <span className="text-white/90">{f}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      )}

                      {project.techStack.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-neon-blue font-semibold mb-3 text-sm tracking-[0.2em] uppercase">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((t, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4 + i * 0.05 }}
                              whileHover={{ y: -3 }}
                              className="bg-tech-dark/70 text-sm px-3 py-1 rounded-full text-white border border-neon-blue/30 hover:border-neon-blue hover:shadow-glow transition-[border-color,box-shadow]"
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                      <Magnetic strength={0.25}>
                        <a
                          // Until a project has a real demo URL, the button leads to the contact form instead of a dead "#"
                          {...(hasDemo(project)
                            ? { href: project.demoLink, target: '_blank', rel: 'noopener noreferrer' }
                            : { href: '#contact' })}
                          className="group relative inline-flex items-center px-6 py-3 bg-neon-blue text-tech-dark rounded-full font-semibold overflow-hidden text-sm md:text-base shadow-[0_0_25px_rgba(0,246,255,0.3)]"
                        >
                          <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                          <span className="relative">{hasDemo(project) ? 'View Live Demo' : 'Ask About This Project'}</span>
                          <ArrowRight className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </Magnetic>
                      {storyOf(project) && (
                        <Link
                          to={`/blog/${storyOf(project).slug}`}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass text-white font-semibold text-sm md:text-base hover:text-neon-blue transition-colors"
                        >
                          <BookOpen className="w-5 h-5" /> Read full story
                        </Link>
                      )}
                      {hasRepo(project) && (
                        <a
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass text-white font-semibold text-sm md:text-base hover:text-neon-blue transition-colors"
                        >
                          <Github className="w-5 h-5" /> View Code
                        </a>
                      )}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </motion.div>
            )
          })}
        </div>

        {hidden > 0 && (
          <div id="projects-more" className="mt-20 flex justify-center">
            <button
              type="button"
              onClick={toggleAll}
              aria-expanded={showAll}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass border border-neon-blue/40 text-white font-semibold hover:text-neon-blue hover:border-neon-blue hover:shadow-glow transition-[color,border-color,box-shadow]"
            >
              {showAll ? 'Show less' : `See more projects (${hidden})`}
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}