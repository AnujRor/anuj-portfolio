import { useEffect, useState } from 'react'
import { BLOG_POSTS, PROFILE, PROJECTS } from '../data'

// ---------- Post body format ----------
// Stored as plain text: blank line = new paragraph, "## " = heading, "> " = pull quote.

export function parseContent(text = '') {
  return text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith('## ')) return { h: b.slice(3).trim() }
      if (b.startsWith('> ')) return { quote: b.slice(2).trim() }
      return b
    })
}

export function blocksToText(blocks = []) {
  return blocks
    .map((b) => (typeof b === 'string' ? b : b.h ? `## ${b.h}` : b.quote ? `> ${b.quote}` : ''))
    .filter(Boolean)
    .join('\n\n')
}

// ---------- Row <-> app shape ----------

// Images were renamed to SEO-friendly names; rows saved before that still hold the old paths.
// Map them here so the site never shows a broken image (supabase/rename-images.sql fixes the rows themselves).
const RENAMED_ASSETS = {
  'aidost-main.svg': 'ai-dost-voice-ai-friend-cover.svg',
  'aidost-1.svg': 'ai-dost-voice-ai-friend-screenshot-1.svg',
  'aidost-2.svg': 'ai-dost-voice-ai-friend-screenshot-2.svg',
  'aidost-3.svg': 'ai-dost-voice-ai-friend-screenshot-3.svg',
  'aidost-4.svg': 'ai-dost-voice-ai-friend-screenshot-4.svg',
  'ozy-main.svg': 'ozy-sneakers-ai-ecommerce-store-cover.svg',
  'ozy-1.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-1.svg',
  'ozy-2.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-2.svg',
  'ozy-3.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-3.svg',
  'ozy-4.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-4.svg',
  'iqworld-main.svg': 'iq-world-sentence-brain-game-cover.svg',
  'iqworld-1.svg': 'iq-world-sentence-brain-game-screenshot-1.svg',
  'iqworld-2.svg': 'iq-world-sentence-brain-game-screenshot-2.svg',
  'iqworld-3.svg': 'iq-world-sentence-brain-game-screenshot-3.svg',
  'iqworld-4.svg': 'iq-world-sentence-brain-game-screenshot-4.svg',
  'caption-main.svg': 'ai-video-caption-generator-cover.svg',
  'caption-1.svg': 'ai-video-caption-generator-screenshot-1.svg',
  'caption-2.svg': 'ai-video-caption-generator-screenshot-2.svg',
  'caption-3.svg': 'ai-video-caption-generator-screenshot-3.svg',
  'caption-4.svg': 'ai-video-caption-generator-screenshot-4.svg',
  'downloader-main.svg': 'universal-video-downloader-cover.svg',
  'downloader-1.svg': 'universal-video-downloader-screenshot-1.svg',
  'downloader-2.svg': 'universal-video-downloader-screenshot-2.svg',
  'downloader-3.svg': 'universal-video-downloader-screenshot-3.svg',
  'downloader-4.svg': 'universal-video-downloader-screenshot-4.svg',
  'profile-hero.png': 'anuj-ai-entrepreneur.webp',
  'profile-hero.webp': 'anuj-ai-entrepreneur.webp',
  'profile-about.png': 'anuj-ai-builder-harsola-haryana.webp',
  'profile-about.webp': 'anuj-ai-builder-harsola-haryana.webp',
  'profile.svg': 'portfolio-placeholder.svg',
}
const asset = (src) => {
  const name = src?.startsWith('/assets/') ? src.slice(8) : null
  return name && RENAMED_ASSETS[name] ? `/assets/${RENAMED_ASSETS[name]}` : src
}

export const postFromRow = (r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  content: parseContent(r.content),
  cover: asset(r.cover),
  category: r.category,
  readTime: r.read_time,
  date: r.published_at,
  updatedAt: r.updated_at?.slice(0, 10),
  published: r.published,
})

export const projectFromRow = (r) => ({
  id: r.id,
  title: r.title,
  tag: r.tag,
  description: r.description,
  longDescription: r.long_description,
  images: r.images?.length ? r.images.map(asset) : ['/assets/portfolio-placeholder.svg'],
  features: r.features || [],
  techStack: r.tech_stack || [],
  demoLink: r.demo_link || '#',
})

// Static data.js content converted to table rows (used by the admin "import" button)
export const staticPostRows = () =>
  BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: blocksToText(p.content),
    cover: p.cover,
    category: p.category,
    read_time: p.readTime,
    published_at: p.date,
    published: true,
  }))

export const staticProjectRows = () =>
  PROJECTS.map((p, i) => ({
    title: p.title,
    tag: p.tag,
    description: p.description || '',
    long_description: (p.longDescription || '').trim(),
    images: p.images,
    features: p.features,
    tech_stack: p.techStack,
    demo_link: p.demoLink || '#',
    sort_order: i,
    published: true,
  }))

// ---------- Public hooks ----------
// Without Supabase keys: static data.js content. With keys: Supabase is the source of truth,
// falling back to static content only if the request fails.

// The public site talks to Supabase's REST API with plain fetch, so the (large) supabase-js
// library is only downloaded by the admin panel.
const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const hasSupabase = Boolean(SB_URL && SB_KEY)

export async function supabaseRest(path, init = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', ...init.headers },
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// One request per resource per page load, shared by every component that asks for it
const cache = new Map()
const loadOnce = (key, load) => {
  if (!cache.has(key)) cache.set(key, load().catch((err) => (cache.delete(key), Promise.reject(err))))
  return cache.get(key)
}

function useRemote(key, fallback, load) {
  const [state, setState] = useState({ data: hasSupabase ? [] : fallback, loading: hasSupabase })
  useEffect(() => {
    if (!hasSupabase) return
    let alive = true
    loadOnce(key, load)
      .then((rows) => alive && setState({ data: rows, loading: false }))
      .catch((err) => {
        console.warn('Supabase fetch failed, using local content:', err.message)
        if (alive) setState({ data: fallback, loading: false })
      })
    return () => {
      alive = false
    }
  }, [])
  return state
}

export function usePosts() {
  return useRemote('posts', BLOG_POSTS, async () => (await supabaseRest('posts?select=*&published=eq.true&order=published_at.desc')).map(postFromRow))
}

export function useProjects() {
  return useRemote('projects', PROJECTS, async () => (await supabaseRest('projects?select=*&published=eq.true&order=sort_order')).map(projectFromRow))
}

// ---------- Editable site sections (admin "img" page) ----------
// Each section is one row in site_content (key -> data). Fields saved there override these
// data.js defaults; anything never saved keeps showing the default.

export const SITE_DEFAULTS = {
  hero: {
    badge: 'Building AI that speaks, feels & helps',
    typed: PROFILE.heroType,
    headline: PROFILE.headline,
    photo: PROFILE.photo,
    chipTitle: 'AI Dost',
    chipText: 'Live & learning',
  },
  about: {
    title: PROFILE.dreamer,
    from: PROFILE.from,
    paragraphs: PROFILE.about.paragraphs,
    closing: PROFILE.about.closing,
    photo: PROFILE.aboutPhoto,
    place: `${PROFILE.location.split(',')[0]}, India`,
    storyTitle: 'My Story',
    story: PROFILE.about.story,
  },
  capabilities: {
    skills: PROFILE.skills,
    stats: PROFILE.stats,
  },
  journey: {
    timeline: PROFILE.about.timeline,
  },
}

const mergeSections = (rows = []) => {
  const out = {}
  for (const key of Object.keys(SITE_DEFAULTS)) {
    const saved = rows.find((r) => r.key === key)?.data || {}
    out[key] = { ...SITE_DEFAULTS[key], ...saved }
  }
  return out
}

// Starts with the defaults (so the hero paints instantly), then swaps in saved content
export function useSiteContent() {
  const [content, setContent] = useState(() => mergeSections())
  useEffect(() => {
    if (!hasSupabase) return
    let alive = true
    loadOnce('site_content', () => supabaseRest('site_content?select=key,data'))
      .then((rows) => alive && setContent(mergeSections(rows)))
      .catch((err) => console.warn('Supabase fetch failed, using local content:', err.message))
    return () => {
      alive = false
    }
  }, [])
  return content
}
