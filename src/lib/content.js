import { useEffect, useState } from 'react'
import { BLOG_POSTS, PROFILE, PROJECTS } from '../data'
import { asset } from './assets'
import { blocksToText, parseContent } from './post-format'

export { blocksToText, parseContent }

// ---------- Row <-> app shape ----------

// The default profile photos also exist as 480px copies (name-480.webp), so phones download the smaller one.
// Photos uploaded from the admin panel have no copy and get no srcset.
const RESPONSIVE_PHOTOS = [PROFILE.photo, PROFILE.aboutPhoto]
export const photoSrcSet = (src) => (RESPONSIVE_PHOTOS.includes(src) ? `${src.replace(/\.webp$/, '-480.webp')} 480w, ${src} 640w` : undefined)

export const postFromRow = (r) => ({
  id: r.id,
  slug: r.slug,
  githubId: r.github_id || null,
  title: r.title,
  excerpt: r.excerpt,
  content: parseContent(r.content),
  cover: asset(r.cover),
  category: r.category,
  readTime: r.read_time,
  metaTitle: r.meta_title || '',
  metaDescription: r.meta_description || '',
  tags: r.tags || [],
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
  repoLink: r.repo_link || '',
  status: r.status || '',
  githubId: r.github_id || null,
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
    meta_title: p.metaTitle || '',
    meta_description: p.metaDescription || '',
    tags: p.tags || [],
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
    badge: 'Available for freelance projects & collaborations',
    typed: PROFILE.heroType,
    headline: PROFILE.headline,
    photo: PROFILE.photo,
    chipTitle: 'AI Dost',
    chipText: 'Voice AI in development',
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
    vision: PROFILE.vision,
    visionButton: "Let's Build Together",
    visionMarquee: ['Think Different', 'Build Fearless', 'Ship Daily', 'Dream Bigger', 'Made in Haryana'],
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
    // Rows saved before the image rename still hold old paths; map them to the current files.
    if (out[key].photo) out[key].photo = asset(out[key].photo)
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
