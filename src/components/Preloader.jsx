import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Preloader() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / 1000, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-tech-dark flex flex-col items-center justify-center"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        className="font-exo text-5xl md:text-7xl font-bold text-white tracking-wide"
      >
        <span className="text-neon-blue">&lt;</span>
        <span className="text-shine">Anuj</span>
        <span className="text-neon-blue">/&gt;</span>
      </motion.div>
      <div className="mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-glow" style={{ width: `${count}%` }} />
      </div>
      <p className="mt-4 font-exo text-sm tracking-[0.4em] text-neon-blue/80">{String(count).padStart(3, '0')}%</p>
    </motion.div>
  )
}
