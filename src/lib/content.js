import { useEffect, useState } from 'react'
import { BLOG_POSTS, PROJECTS } from '../data'

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

export const postFromRow = (r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  content: parseContent(r.content),
  cover: r.cover,
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
  images: r.images?.length ? r.images : ['/assets/profile.svg'],
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
