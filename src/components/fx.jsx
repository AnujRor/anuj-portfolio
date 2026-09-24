import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

// Section heading with a small eyebrow label and word-by-word blur reveal
export function SectionTitle({ eyebrow, index, children, accent, className = '', as: Heading = 'h2' }) {
  const words = String(children).split(' ')
  return (
    <div className={`text-center mb-16 ${className}`}>
      {eyebrow && (
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block h-px w-16 origin-right bg-gradient-to-l from-neon-blue/60 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-semibold tracking-[0.25em] uppercase"
          >
            {index ? <span className="text-white/50 font-exo">{index}</span> : <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />}
            {index && <span className="w-3 h-px bg-neon-blue/50" />}
            {eyebrow}
          </motion.div>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block h-px w-16 origin-left bg-gradient-to-r from-neon-blue/60 to-transparent"
          />
        </div>
      )}
      <Heading className="font-exo text-3xl md:text-4xl lg:text-5xl font-bold text-white">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mr-[0.25em]"
          >
            {w}
          </motion.span>
        ))}
        {accent && (
          <motion.span
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: words.length * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-shine"
          >
            {accent}
          </motion.span>
        )}
      </Heading>
    </div>
  )
}

// Card with a radial glow that follows the mouse
export function SpotlightCard({ children, className = '', color = '0, 246, 255', ...rest }) {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(${color}, 0.16), transparent 70%)`
  const border = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, rgba(${color}, 0.8), transparent 70%)`

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <motion.div onMouseMove={onMove} onMouseLeave={() => { x.set(-200); y.set(-200) }} className={`group relative ${className}`} {...rest}>
      <motion.div className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 spotlight-border" style={{ background: border }} />
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: bg }} />
      {children}
    </motion.div>
  )
}

// 3D tilt on hover
export function Tilt({ children, className = '', max = 10 }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { px.set(0.5); py.set(0.5) }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Element that gets pulled toward the cursor
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const x = useSpring(0, { stiffness: 180, damping: 14 })
  const y = useSpring(0, { stiffness: 180, damping: 14 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  return (
    <motion.div onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

// Infinite horizontal ticker
export function Marquee({ items, reverse = false, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`relative flex overflow-hidden marquee-mask ${className}`}>
      <div className={`flex shrink-0 gap-10 pr-10 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-exo text-lg md:text-2xl font-bold text-white/70">
            {t}
            <span className="text-neon-blue text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
