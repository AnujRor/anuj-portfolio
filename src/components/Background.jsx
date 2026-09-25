import { useEffect, useRef } from 'react'

// Full-page animated background: a dot matrix that ripples like a signal wave,
// lights up around the cursor, and occasionally fires "data pulses" along the grid.
const CYAN = [0, 246, 255]
const PURPLE = [176, 38, 255]
const BUCKETS = 10 // dots are grouped by brightness and drawn in 10 batched fills instead of one call each

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // Lite mode (low-end device, set in index.html) and reduced motion get one static frame only
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('perf-lite')
    const light = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768 || navigator.connection?.saveData
    const GAP = light ? 38 : 30
    const FRAME_MS = light ? 1000 / 20 : 1000 / 30
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let w = 0
    let h = 0
    let raf
    let running = false
    let last = 0
    let pulses = []
    let gradient
    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let sizes = new Float32Array(0)
    let levels = new Uint8Array(0)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // One horizontal cyan -> purple gradient replaces a colour string per dot
      gradient = ctx.createLinearGradient(0, 0, w, 0)
      gradient.addColorStop(0, `rgb(${CYAN})`)
      gradient.addColorStop(1, `rgb(${PURPLE})`)
      const cols = Math.ceil(w / GAP) + 1
      const rows = Math.ceil(h / GAP) + 1
      const n = cols * rows
      xs = new Float32Array(n)
      ys = new Float32Array(n)
      sizes = new Float32Array(n)
      levels = new Uint8Array(n)
      let k = 0
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++, k++) {
          xs[k] = i * GAP + GAP / 2
          ys[k] = j * GAP + GAP / 2
        }
      if (!running) draw(performance.now(), true)
    }

    const spawnPulse = () => {
      const horizontal = Math.random() > 0.5
      const lane = Math.floor(Math.random() * ((horizontal ? h : w) / GAP)) * GAP + GAP / 2
      pulses.push({ horizontal, lane, pos: -80, speed: 6 + Math.random() * 8, color: Math.random() > 0.5 ? CYAN : PURPLE })
    }

    const draw = (t, once = false) => {
      if (!once) {
        raf = requestAnimationFrame(draw)
        if (t - last < FRAME_MS) return
        last = t
      }
      const time = t / 1000
      mouse.x += (mouse.tx - mouse.x) * 0.25
      mouse.y += (mouse.ty - mouse.y) * 0.25
      ctx.clearRect(0, 0, w, h)

      // Pass 1: brightness + size per dot
      for (let k = 0; k < xs.length; k++) {
        const x = xs[k]
        const y = ys[k]
        // Two crossing waves give a slow, organic shimmer
        const wave = Math.max(0, Math.sin(x * 0.012 + y * 0.008 - time * 0.9) * 0.5 + Math.sin(y * 0.015 - x * 0.004 + time * 0.6) * 0.5)
        const dx = x - mouse.x
        const dy = y - mouse.y
        const d2 = dx * dx + dy * dy
        const near = d2 < 48400 ? 1 - Math.sqrt(d2) / 220 : 0
        const alpha = 0.06 + wave * 0.12 + near * 0.7
        sizes[k] = 1 + near * 1.8 + wave * 0.4
        levels[k] = Math.min(BUCKETS - 1, (alpha / 0.88) * BUCKETS) | 0
      }

      // Pass 2: one fill per brightness bucket
      ctx.fillStyle = gradient
      for (let b = 0; b < BUCKETS; b++) {
        ctx.globalAlpha = ((b + 0.5) / BUCKETS) * 0.88
        ctx.beginPath()
        for (let k = 0; k < xs.length; k++) {
          if (levels[k] !== b) continue
          const s = sizes[k]
          ctx.rect(xs[k] - s / 2, ys[k] - s / 2, s, s)
        }
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Data pulses travelling along grid lanes
      if (!once && Math.random() < 0.05 && pulses.length < 6) spawnPulse()
      pulses = pulses.filter((p) => {
        p.pos += p.speed
        const len = 120
        const [cr, cg, cb] = p.color
        const grad = p.horizontal ? ctx.createLinearGradient(p.pos - len, 0, p.pos, 0) : ctx.createLinearGradient(0, p.pos - len, 0, p.pos)
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`)
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0.7)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.beginPath()
        if (p.horizontal) {
          ctx.moveTo(p.pos - len, p.lane)
          ctx.lineTo(p.pos, p.lane)
        } else {
          ctx.moveTo(p.lane, p.pos - len)
          ctx.lineTo(p.lane, p.pos)
        }
        ctx.stroke()
        return p.pos - len < (p.horizontal ? w : h)
      })
    }

    const start = () => {
      if (running || reduce || document.hidden || scrolling) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
    }
    const onLeave = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    // Freeze the animation while the page scrolls: the glass cards above the canvas would otherwise
    // re-blur the moving dots on every frame, which is what makes scrolling stutter
    let scrollTimer
    let scrolling = false
    const onScroll = () => {
      if (!scrolling && running) stop()
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        scrolling = false
        start()
      }, 200)
    }

    resize() // paints one static frame immediately
    // Start animating only after the page has loaded, so it never competes with first paint
    let startTimer
    const scheduleStart = () => (startTimer = setTimeout(() => (window.requestIdleCallback || setTimeout)(start), 1500))
    if (document.readyState === 'complete') scheduleStart()
    else window.addEventListener('load', scheduleStart, { once: true })

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      clearTimeout(startTimer)
      clearTimeout(scrollTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', scheduleStart)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-tech-dark">
      {/* Deep colour wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,246,255,0.12),transparent_60%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(176,38,255,0.12),transparent_60%)]" />
      <div className="aurora w-[45vw] h-[45vw] bg-neon-blue/30 -top-[15vw] -left-[10vw]" />
      <div className="aurora w-[40vw] h-[40vw] bg-neon-purple/30 top-[35vh] -right-[15vw]" style={{ animationDelay: '-6s' }} />
      <div className="aurora w-[30vw] h-[30vw] bg-[#0066ff]/25 bottom-[-12vw] left-[25vw]" style={{ animationDelay: '-12s' }} />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Vignette keeps the edges dark so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,8,12,0.85)_100%)]" />
    </div>
  )
}
