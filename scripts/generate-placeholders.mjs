import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const assetsDir = join(__dirname, '..', 'public', 'assets')
mkdirSync(assetsDir, { recursive: true })

const projects = [
  { name: 'AI Dost', slug: 'aidost', accent: '#00f6ff', emoji: '\u{1F916}' },
  { name: 'Ozy Sneakers', slug: 'ozy', accent: '#b026ff', emoji: '\u{1F9E6}' },
  { name: 'IQ World', slug: 'iqworld', accent: '#22c55e', emoji: '\u{1F9E0}' },
  { name: 'AI Caption Generator', slug: 'caption', accent: '#f97316', emoji: '\u{1F3A5}' },
  { name: 'Universal Downloader', slug: 'downloader', accent: '#38bdf8', emoji: '\u{2B07}\uFE0F' },
]

const slides = ['Overview', 'Interface', 'Features', 'Live Demo']

const svg = (title, label, accent, emoji) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M30 0H0V30" fill="none" stroke="${accent}" stroke-opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="#0d1117"/>
  <rect width="800" height="600" fill="url(#grid)"/>
  <rect width="800" height="600" fill="url(#g)"/>
  <rect x="24" y="24" width="752" height="552" fill="none" stroke="${accent}" stroke-opacity="0.4" stroke-width="2" rx="16"/>
  <circle cx="70" cy="70" r="6" fill="${accent}" fill-opacity="0.9"/>
  <text x="95" y="78" font-family="Arial" font-size="20" fill="#ffffff" fill-opacity="0.6">${title}</text>
  <text x="400" y="150" text-anchor="middle" font-family="Arial" font-size="52" font-weight="bold" fill="#ffffff">${emoji}</text>
  <text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="44" font-weight="bold" fill="${accent}">${title}</text>
  <text x="400" y="360" text-anchor="middle" font-family="Arial" font-size="26" fill="#e0e0e0" fill-opacity="0.85">${label}</text>
  <text x="400" y="410" text-anchor="middle" font-family="Arial" font-size="18" fill="#888888">Portfolio Screenshot Placeholder</text>
  <rect x="300" y="470" width="200" height="44" rx="22" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-opacity="0.5"/>
  <text x="400" y="499" text-anchor="middle" font-family="Arial" font-size="17" fill="${accent}">${title.split(' ').map(s => s[0]).join('').toUpperCase()}</text>
</svg>`

for (const p of projects) {
  writeFileSync(join(assetsDir, `${p.slug}-main.svg`), svg(p.name, 'Main Screenshot', p.accent))
  slides.forEach((label, i) => {
    writeFileSync(join(assetsDir, `${p.slug}-${i + 1}.svg`), svg(p.name, `${label}`, p.accent))
  })
}

console.log('Generated placeholder screenshots for', projects.length, 'projects')