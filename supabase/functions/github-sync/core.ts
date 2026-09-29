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

// README sections that are instructions for developers, not a story for blog readers
const SKIP_SECTION = /install|setup|set up|getting started|usage|run locally|running|requirements|prerequisites|deploy|environment|env var|license|contribut|table of contents|scripts|folder structure|project structure|credits|acknowledg/i

// README -> blog body in the site's post format ("## " heading, "> " quote, "- " list, blank line between blocks)
export function readmeToPost(md: string): string {
  const text = md.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '').replace(/\r/g, '')
  const blocks: string[] = []
  let para: string[] = []
  let list: string[] = []
  let quote: string[] = []
  let skipLevel = 0 // > 0 while inside a skipped section of that heading level
  let seenTitle = false

  const flush = () => {
    const p = plain(para.join(' '))
    if (p) blocks.push(p)
    if (list.length) blocks.push(list.map((i) => `- ${i}`).join('\n'))
    const q = plain(quote.join(' '))
    if (q) blocks.push(`> ${q}`)
    para = []
    list = []
    quote = []
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flush()
      const level = h[1].length
      const title = plain(h[2])
      if (skipLevel && level > skipLevel) continue
      skipLevel = SKIP_SECTION.test(title) ? level : 0
      // The first H1 is the repo name, which is already the post title
      if (level === 1 && !seenTitle) {
        seenTitle = true
        continue
      }
      if (!skipLevel && title) blocks.push(`## ${title}`)
      continue
    }
    if (skipLevel) continue
    const bullet = line.match(/^(?:[-*+]|\d+[.)])\s+(.*)$/)
    if (bullet) {
      if (para.length || quote.length) {
        const keep = list
        list = []
        flush()
        list = keep
      }
      const item = plain(bullet[1].replace(/^\[[ x]\]\s*/i, ''))
      if (item) list.push(item)
      continue
    }
    if (line.startsWith('>')) {
      if (para.length || list.length) flush()
      quote.push(line.replace(/^>\s?/, ''))
      continue
    }
    if (!line || line.startsWith('|') || /^[-=*_]{3,}$/.test(line)) {
      flush()
      continue
    }
    if (list.length || quote.length) flush()
    para.push(line)
  }
  flush()

  // Drop headings left with nothing under them
  return blocks
    .filter((b, i) => !(b.startsWith('## ') && (i === blocks.length - 1 || blocks[i + 1].startsWith('## '))))
    .join('\n\n')
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

const readTime = (text: string) => `${Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200))} min read`

// Blog post fields GitHub owns. `md` is the README (null = no new commits, so the body is left alone).
export function postFields(repo: Repo, md: string | null, cover: string) {
  const title = prettify(repo.name)
  const topics = (repo.topics || []).filter((t) => t !== HIDE_TOPIC)
  const about = md != null ? parseReadme(md).about : ''
  const excerpt = repo.description?.trim() || about.split('\n')[0].slice(0, 200) || `${title}, a project by Anuj Ror.`
  const fields: Record<string, unknown> = {
    github_id: repo.id,
    title,
    // Without a description the excerpt comes from the README, so it is only rewritten when the README was read
    ...(repo.description?.trim() || md != null ? { excerpt } : {}),
    category: 'Projects',
    tags: [...new Set([title, ...topics.map(prettify), repo.language].filter(Boolean) as string[])],
    cover,
    published_at: repo.created_at.slice(0, 10),
    published: true,
  }
  if (md != null) {
    const content = readmeToPost(md) || excerpt
    fields.content = content
    fields.read_time = readTime(content)
  }
  return fields
}

export const isShown =(repo: Repo, portfolioRepo: string) =>
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
