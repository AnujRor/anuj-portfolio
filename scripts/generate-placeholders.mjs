import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Generates polished mock "app screens" for projects that don't have real screenshots yet.
// Swap any file in public/assets for a real screenshot with the same name when you have one.

const __dirname = dirname(fileURLToPath(import.meta.url))
const assetsDir = join(__dirname, '..', 'public', 'assets')
mkdirSync(assetsDir, { recursive: true })

const projects = [
  { name: 'AI Dost', slug: 'ai-dost-voice-ai-friend', accent: '#00f6ff', accent2: '#b026ff', url: 'aidost.app', tagline: 'Your AI friend that talks, listens & helps' },
  { name: 'Ozy Sneakers', slug: 'ozy-sneakers-ai-ecommerce-store', accent: '#b026ff', accent2: '#ff4fd8', url: 'ozysneakers.store', tagline: 'AI-powered sneaker shopping experience' },
  { name: 'IQ World', slug: 'iq-world-sentence-brain-game', accent: '#22c55e', accent2: '#00f6ff', url: 'iqworld.game', tagline: 'Train your brain, one sentence at a time' },
  { name: 'AI Caption Generator', slug: 'ai-video-caption-generator', accent: '#f97316', accent2: '#facc15', url: 'captions.ai', tagline: 'Accurate captions for any video in seconds' },
  { name: 'Universal Downloader', slug: 'universal-video-downloader', accent: '#38bdf8', accent2: '#6366f1', url: 'downloader.app', tagline: 'Save videos from any platform, in one click' },
]

const FONT = "Inter, 'Segoe UI', Arial, sans-serif"
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const bar = (x, y, w, h = 10, o = 0.14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#ffffff" fill-opacity="${o}"/>`

// Content area inside the browser window: x 60..740, y 120..550
const layouts = {
  overview: (p) => `
    <text x="100" y="230" font-family="${FONT}" font-size="46" font-weight="700" fill="#ffffff">${esc(p.name)}</text>
    <text x="100" y="270" font-family="${FONT}" font-size="19" fill="#cbd5e1">${esc(p.tagline)}</text>
    <rect x="100" y="305" width="150" height="46" rx="23" fill="url(#btn)"/>
    <text x="175" y="334" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="600" fill="#0b0f14">Get started</text>
    <rect x="266" y="305" width="130" height="46" rx="23" fill="none" stroke="#ffffff" stroke-opacity="0.25"/>
    <text x="331" y="334" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#e2e8f0">Learn more</text>
    ${[0, 1, 2].map((i) => `<rect x="${100 + i * 205}" y="395" width="190" height="115" rx="14" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.08"/>
    <circle cx="${128 + i * 205}" cy="425" r="12" fill="${i % 2 ? p.accent2 : p.accent}" fill-opacity="0.8"/>
    ${bar(118 + i * 205, 452, 130)}${bar(118 + i * 205, 472, 95, 8, 0.08)}${bar(118 + i * 205, 488, 115, 8, 0.08)}`).join('')}
    <circle cx="640" cy="230" r="70" fill="url(#orb)"/>`,
  interface: (p) => `
    <rect x="60" y="120" width="170" height="430" fill="#ffffff" fill-opacity="0.03"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="78" y="${150 + i * 42}" width="134" height="28" rx="8" fill="${i === 0 ? p.accent : '#ffffff'}" fill-opacity="${i === 0 ? 0.18 : 0.04}"/>${bar(92, 159 + i * 42, i === 0 ? 80 : 60 + i * 8, 10, i === 0 ? 0.5 : 0.15)}`).join('')}
    <rect x="270" y="160" width="300" height="56" rx="18" fill="#ffffff" fill-opacity="0.07"/>
    ${bar(290, 177, 220)}${bar(290, 195, 150, 8, 0.08)}
    <rect x="400" y="240" width="300" height="56" rx="18" fill="url(#btn)" fill-opacity="0.9"/>
    <rect x="420" y="257" width="230" height="10" rx="5" fill="#0b0f14" fill-opacity="0.35"/><rect x="420" y="275" width="160" height="8" rx="4" fill="#0b0f14" fill-opacity="0.25"/>
    <rect x="270" y="320" width="340" height="76" rx="18" fill="#ffffff" fill-opacity="0.07"/>
    ${bar(290, 340, 280)}${bar(290, 358, 240, 8, 0.08)}${bar(290, 374, 180, 8, 0.08)}
    <rect x="270" y="480" width="430" height="46" rx="23" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1"/>
    ${bar(295, 498, 170, 10, 0.12)}
    <circle cx="677" cy="503" r="17" fill="${p.accent}"/>
    <path d="M671 503h12M678 497l6 6-6 6" stroke="#0b0f14" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  features: (p) => `
    <text x="400" y="190" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="700" fill="#ffffff">Why ${esc(p.name)}?</text>
    <text x="400" y="222" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#94a3b8">${esc(p.tagline)}</text>
    ${[0, 1, 2, 3].map((i) => {
      const x = 100 + (i % 2) * 310
      const y = 255 + Math.floor(i / 2) * 140
      return `<rect x="${x}" y="${y}" width="290" height="120" rx="16" fill="#ffffff" fill-opacity="0.05" stroke="${i === 0 ? p.accent : '#ffffff'}" stroke-opacity="${i === 0 ? 0.5 : 0.08}"/>
    <rect x="${x + 20}" y="${y + 22}" width="40" height="40" rx="11" fill="${i % 2 ? p.accent2 : p.accent}" fill-opacity="0.2"/>
    <circle cx="${x + 40}" cy="${y + 42}" r="8" fill="${i % 2 ? p.accent2 : p.accent}"/>
    ${bar(x + 76, y + 30, 150, 11, 0.4)}${bar(x + 76, y + 52, 180, 8, 0.1)}${bar(x + 20, y + 84, 240, 8, 0.1)}`
    }).join('')}`,
  demo: (p) => `
    <rect x="100" y="150" width="600" height="300" rx="18" fill="#000000" fill-opacity="0.35" stroke="#ffffff" stroke-opacity="0.08"/>
    <circle cx="400" cy="300" r="120" fill="url(#orb)"/>
    <circle cx="400" cy="300" r="44" fill="url(#btn)"/>
    <path d="M388 280v40l32-20z" fill="#0b0f14"/>
    <rect x="130" y="415" width="540" height="6" rx="3" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="130" y="415" width="210" height="6" rx="3" fill="url(#btn)"/>
    <circle cx="340" cy="418" r="8" fill="#ffffff"/>
    <text x="100" y="500" font-family="${FONT}" font-size="22" font-weight="700" fill="#ffffff">${esc(p.name)} — live demo</text>
    <text x="100" y="528" font-family="${FONT}" font-size="15" fill="#94a3b8">${esc(p.tagline)}</text>`,
}

const svg = (p, layout) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#0a0d14"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="10%" r="75%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="10%" cy="100%" r="70%">
      <stop offset="0%" stop-color="${p.accent2}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${p.accent2}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${p.accent2}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${p.accent2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="btn" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="100%" stop-color="${p.accent2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <rect width="800" height="600" fill="url(#glow2)"/>
  <rect x="60" y="60" width="680" height="490" rx="18" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.1"/>
  <path d="M60 78a18 18 0 0 1 18-18h644a18 18 0 0 1 18 18v42H60z" fill="#ffffff" fill-opacity="0.04"/>
  <circle cx="88" cy="90" r="6" fill="#ff5f57"/><circle cx="108" cy="90" r="6" fill="#febc2e"/><circle cx="128" cy="90" r="6" fill="#28c840"/>
  <rect x="290" y="77" width="220" height="26" rx="13" fill="#ffffff" fill-opacity="0.06"/>
  <text x="400" y="95" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#94a3b8">${esc(p.url)}</text>
  <line x1="60" y1="120" x2="740" y2="120" stroke="#ffffff" stroke-opacity="0.08"/>
  ${layouts[layout](p)}
</svg>
`

const slides = ['overview', 'interface', 'features', 'demo']

for (const p of projects) {
  writeFileSync(join(assetsDir, `${p.slug}-cover.svg`), svg(p, 'overview'))
  slides.forEach((layout, i) => writeFileSync(join(assetsDir, `${p.slug}-screenshot-${i + 1}.svg`), svg(p, layout)))
}

console.log('Generated mock screens for', projects.length, 'projects')
