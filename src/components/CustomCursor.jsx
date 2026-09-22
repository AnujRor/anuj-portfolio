import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [state, setState] = useState('default')

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    const over = () => setState('link')
    const out = () => setState('default')
    const els = document.querySelectorAll('a, button, input, textarea, select, .clickable')
    els.forEach((el) => {
      el.addEventListener('mouseenter', over)
      el.addEventListener('mouseleave', out)
    })
    return () => {
      window.removeEventListener('mousemove', move)
      els.forEach((el) => {
        el.removeEventListener('mouseenter', over)
        el.removeEventListener('mouseleave', out)
      })
    }
  }, [])

  const [supported, setSupported] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(hover: hover)')
    setSupported(m.matches)
    const change = (e) => setSupported(e.matches)
    m.addEventListener('change', change)
    return () => m.removeEventListener('change', change)
  }, [])

  const variants = {
    default: { x: position.x - 12, y: position.y - 12, height: 24, width: 24, backgroundColor: 'rgba(0, 0, 0, 0)', mixBlendMode: 'difference' },
    link: { x: position.x - 32, y: position.y - 32, height: 64, width: 64, backgroundColor: 'rgba(0, 246, 255, 0.2)', mixBlendMode: 'normal' },
  }

  const dotVariants = {
    default: { x: position.x - 3, y: position.y - 3, opacity: 1 },
    link: { x: position.x - 3, y: position.y - 3, opacity: 0 },
  }

  if (!supported) return null

  return (
    <>
      <motion.div className="cursor fixed pointer-events-none z-50 border-2 border-neon-blue rounded-full" variants={variants} animate={state} transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }} />
      <motion.div className="cursor-dot fixed pointer-events-none z-50 bg-neon-blue rounded-full w-1.5 h-1.5" variants={dotVariants} animate={state} transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }} />
    </>
  )
}