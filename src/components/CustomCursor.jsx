import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, input, textarea, select, .clickable'

export default function CustomCursor() {
  const [supported, setSupported] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 })
  const glowX = useSpring(x, { stiffness: 60, damping: 20 })
  const glowY = useSpring(y, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const m = window.matchMedia('(hover: hover) and (pointer: fine)')
    setSupported(m.matches)
    const change = (e) => setSupported(e.matches)
    m.addEventListener('change', change)
    return () => m.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!supported) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    // Delegated so elements rendered later are picked up too
    const over = (e) => setHovering(!!e.target.closest?.(INTERACTIVE))
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [supported, x, y])

  if (!supported) return null

  const size = hovering ? 64 : 28

  return (
    <>
      {/* Big soft light that trails the pointer */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[1] w-[500px] h-[500px] -ml-[250px] -mt-[250px] rounded-full"
        style={{ x: glowX, y: glowY, background: 'radial-gradient(circle, rgba(0,246,255,0.07), transparent 60%)' }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-neon-blue"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          scale: pressed ? 0.8 : 1,
          backgroundColor: hovering ? 'rgba(0, 246, 255, 0.15)' : 'rgba(0, 246, 255, 0)',
          borderColor: hovering ? 'rgba(0, 246, 255, 0.9)' : 'rgba(0, 246, 255, 0.6)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-neon-blue shadow-glow"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </>
  )
}
