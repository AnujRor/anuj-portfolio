// Pure helpers for the GitHub -> Projects sync: no Deno / network APIs, so they can be tested in Node.

export type Repo = {
  id: number
  name: string
  full_name: string
  description: string | null
  homepage: string | null
  html_url: string
  language: string | null
  topics?: string[]
  private: boolean
  fork: boolean
  pushed_at: string
  created_at: string
}

// Topic that keeps a repo off the portfolio
export const HIDE_TOPIC = 'hide-from-portfolio'

const UPPER = new Set(['ai', 'iq', 'ui', 'ux', 'api', 'ml', 'llm', 'gpt', 'sdk', 'cli', 'seo', 'css', 'html', 'sql', 'pdf', 'ar', 'vr', '3d', 'ios'])
const KNOWN: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  nextjs: 'Next.js',
  nodejs: 'Node.js',
  reactjs: 'React',
  tailwindcss: 'Tailwind CSS',
  openai: 'OpenAI',
  livekit: 'LiveKit',
  elevenlabs: 'ElevenLabs',
  fastapi: 'FastAPI',
  mongodb: 'MongoDB',
  postgresql: 'PostgreSQL',
  github: 'GitHub',
  chatgpt: 'ChatGPT',
  webrtc: 'WebRTC',
  ffmpeg: 'FFmpeg',
}

// "ai-dost" -> "AI Dost", "voice-ai" -> "Voice AI", "nextjs" -> "Next.js"
export function prettify(slug: string): string {
  if (KNOWN[slug.toLowerCase()]) return KNOWN[slug.toLowerCase()]
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => KNOWN[w.toLowerCase()] || (UPPER.has(w.toLowerCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Markdown inline -> plain text
function plain(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images / badges
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/<[^>]+>/g, '') // html tags
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|\s)[*_]([^*_\n]+)[*_](?=\s|[.,!?]|$)/g, '$1$2')
    .replace(/:[a-z0-9_+-]+:/g, '') // :emoji: shortcodes
    .replace(/\s+/g, ' ')
    .trim()
}

// Up to 2 prose paragraphs (the "about" text) and the bullet list under a "Features"-like heading
export function parseReadme(md: string): { about: string; features: string[] } {
  const text = md.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '').replace(/\r/g, '')
  const paragraphs: string[] = []
  const features: string[] = []
  let heading = ''
  let buffer: string[] = []

  const flush = () => {
    const p = plain(buffer.join(' '))
    buffer = []
    if (paragraphs.length < 2 && p.length >= 40 && !/^(table of contents|license|installation)/i.test(heading)) paragraphs.push(p)
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const h = line.match(/^#{1,6}\s+(.*)$/)
    if (h) {
      flush()
      heading = plain(h[1])
      continue
    }
    const bullet = line.match(/^(?:[-*+]|\d+[.)])\s+(.*)$/)
    if (bullet) {
      flush()
      const item = plain(bullet[1].replace(/^\[[ x]\]\s*/i, ''))
      if (/feature|highlight|what it does|what can it do/i.test(heading) && item && features.length < 8) features.push(item)
      continue
    }
    if (!line || line.startsWith('|') || line.startsWith('>') || /^[-=*_]{3,}$/.test(line)) {
      flush()
      continue
    }
    buffer.push(line)
  }
  flush()

  const about = paragraphs.join('\n\n')
  return { about: about.length > 900 ? `${about.slice(0, 897).replace(/\s+\S*$/, '')}...` : about, features }
}

export const isShown = (repo: Repo, portfolioRepo: string) =>
  !repo.fork && repo.name.toLowerCase() !== portfolioRepo.toLowerCase() && !(repo.topics || []).includes(HIDE_TOPIC)

// Fields GitHub owns. A field is only written when GitHub has a value, so a thin README
// never wipes text that was written in the admin panel.
export function githubFields(repo: Repo, readme: { about: string; features: string[] } | null) {
  const topics = (repo.topics || []).filter((t) => t !== HIDE_TOPIC)
  const stack = [...new Set([repo.language, ...topics.map(prettify)].filter(Boolean) as string[])]
  const fields: Record<string, unknown> = {
    title: prettify(repo.name),
    github_id: repo.id,
    github_name: repo.name,
    github_pushed_at: repo.pushed_at,
    // Private repos 404 for visitors, so they get no "View Code" button
    repo_link: repo.private ? '' : repo.html_url,
  }
  if (repo.description?.trim()) fields.description = repo.description.trim()
  if (repo.homepage && /^https?:\/\//.test(repo.homepage)) fields.demo_link = repo.homepage
  if (topics.length) fields.tag = prettify(topics[0])
  if (stack.length) fields.tech_stack = stack
  if (readme?.about) fields.long_description = readme.about
  if (readme?.features.length) fields.features = readme.features
  return fields
}

// Defaults for a brand-new row (fields GitHub didn't fill)
export function newRowDefaults(repo: Repo) {
  return {
    tag: repo.language || 'Project',
    description: '',
    long_description: repo.description || '',
    images: [] as string[],
    features: [] as string[],
    tech_stack: [] as string[],
    demo_link: '#',
    status: '',
    published: true,
  }
}
