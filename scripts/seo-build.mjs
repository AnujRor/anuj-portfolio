// Runs after `vite build`. For every public route it writes a static HTML file with that
// route's own <title>, meta description, canonical, Open Graph/Twitter tags, JSON-LD and a
// crawlable text version of the content. Also writes sitemap.xml, robots.txt and 404.html.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { loadEnv } from 'vite'
import { BLOG_POSTS, PROFILE, PROJECTS } from '../src/data.js'
import { SITE, makeAbs, postMetaDescription, relatedPosts, routeSeo } from '../src/seo-core.js'

const DIST = 'dist'
const env = loadEnv('production', process.cwd(), '')
const SITE_URL = (env.VITE_SITE_URL || 'http://localhost:4173').replace(/\/$/, '')
if (!env.VITE_SITE_URL) {
  console.warn('\n⚠️  VITE_SITE_URL is not set — canonical URLs & sitemap use http://localhost:4173.')
  console.warn('   Add VITE_SITE_URL=https://your-domain.com to .env.local / hosting env before deploying.\n')
}
const abs = makeAbs(SITE_URL)

// ---------- Content (Supabase if configured, otherwise data.js) ----------
const parseContent = (text = '') =>
  text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith('## ') ? { h: b.slice(3).trim() } : b.startsWith('> ') ? { quote: b.slice(2).trim() } : b))

async function fetchTable(table, query) {
  const res = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` },
  })
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function loadContent() {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) return { posts: BLOG_POSTS, projects: PROJECTS, source: 'data.js' }
  try {
    const [postRows, projectRows] = await Promise.all([
      fetchTable('posts', 'select=*&published=eq.true&order=published_at.desc'),
      fetchTable('projects', 'select=*&published=eq.true&order=sort_order'),
    ])
    return {
      posts: postRows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: parseContent(r.content),
        cover: r.cover,
        category: r.category,
        readTime: r.read_time,
        metaTitle: r.meta_title || '',
        metaDescription: r.meta_description || '',
        tags: r.tags || [],
        date: r.published_at,
        updatedAt: r.updated_at?.slice(0, 10),
      })),
      projects: projectRows.map((r) => ({ title: r.title, tag: r.tag, description: r.description, longDescription: r.long_description, techStack: r.tech_stack || [], demoLink: r.demo_link })),
      source: 'Supabase',
    }
  } catch (err) {
    console.warn(`⚠️  Supabase fetch failed (${err.message}); using data.js content for SEO pages.`)
    return { posts: BLOG_POSTS, projects: PROJECTS, source: 'data.js (fallback)' }
  }
}

// ---------- HTML helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headTags(seo) {
  const url = abs(seo.path)
  const img = abs(seo.image || SITE.image)
  const desc = seo.description || SITE.defaultDescription
  const type = seo.type || 'website'
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
    seo.keywords?.length ? `<meta name="keywords" content="${esc(seo.keywords.join(', '))}" />` : '',
    seo.noindex ? '' : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:alt" content="${esc(seo.imageAlt || seo.title)}" />`,
    ...(type === 'article'
      ? [
          seo.publishedTime ? `<meta property="article:published_time" content="${esc(seo.publishedTime)}" />` : '',
          seo.modifiedTime ? `<meta property="article:modified_time" content="${esc(seo.modifiedTime)}" />` : '',
          `<meta property="article:author" content="${esc(abs('/'))}" />`,
          seo.section ? `<meta property="article:section" content="${esc(seo.section)}" />` : '',
          ...(seo.tags || []).map((t) => `<meta property="article:tag" content="${esc(t)}" />`),
        ]
      : []),
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    `<meta name="twitter:image:alt" content="${esc(seo.imageAlt || seo.title)}" />`,
    `<script type="application/ld+json" id="ld-json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': seo.schema || [] }).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

const wrap = (inner) =>
  `<main style="max-width:760px;margin:40px auto;padding:0 16px;font-family:sans-serif;line-height:1.6;color:#e0e0e0;background:#0b0f14">${inner}</main>`

const postLinks = (posts) =>
  `<ul>${posts.map((p) => `<li><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a> — ${esc(p.excerpt)}</li>`).join('')}</ul>`

function homeBody({ posts, projects }) {
  return wrap(`
    <h1>${esc(PROFILE.fullName)} — AI Developer &amp; Voice AI Builder from Haryana, India</h1>
    <p>${esc(PROFILE.headline)}.</p>
    <h2>About</h2>
    ${PROFILE.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
    <h2>Projects</h2>
    <ul>${projects.map((p) => `<li><strong>${esc(p.title)}</strong>${p.tag ? ` (${esc(p.tag)})` : ''} — ${esc(p.description || '')}</li>`).join('')}</ul>
    <h2>Skills</h2>
    <p>${PROFILE.skills.map((s) => esc(s.name)).join(', ')}</p>
    ${posts.length ? `<h2>Latest from the blog</h2>${postLinks(posts.slice(0, 5))}` : ''}
    <p><a href="/blog">Blog</a> · <a href="/#contact">Contact</a></p>`)
}

const blogBody = ({ posts }) => wrap(`<h1>${esc(SITE.blogTitle)}</h1><p>${esc(SITE.blogDescription)}</p>${postLinks(posts)}<p><a href="/">Home</a></p>`)

function postBody(post, posts) {
  const blocks = post.content
    .map((b) => (typeof b === 'string' ? `<p>${esc(b)}</p>` : b.h ? `<h2>${esc(b.h)}</h2>` : b.quote ? `<blockquote>${esc(b.quote)}</blockquote>` : ''))
    .join('')
  const related = relatedPosts(post, posts)
  return wrap(`
    <nav><a href="/">Home</a> › <a href="/blog">Blog</a></nav>
    <article>
      <h1>${esc(post.title)}</h1>
      <p>By <a href="/">${esc(PROFILE.fullName)}</a> · <time datetime="${esc(post.date)}">${esc(post.date)}</time> · ${esc(post.readTime || '')}</p>
      ${blocks}
      ${post.tags?.length ? `<p>Topics: ${post.tags.map(esc).join(', ')}</p>` : ''}
    </article>
    ${related.length ? `<h2>Related articles</h2>${postLinks(related)}` : ''}`)
}

// ---------- Write pages ----------
const template = readFileSync(join(DIST, 'index.html'), 'utf8')
if (!template.includes('<!--seo:start-->') || !template.includes('<!--noscript:start-->')) {
  throw new Error('index.html is missing the <!--seo:start--> / <!--noscript:start--> markers')
}

// Search engine ownership checks (Google Search Console / Bing Webmaster Tools "HTML tag" method)
const verifyTags = [
  env.VITE_GOOGLE_SITE_VERIFICATION && `<meta name="google-site-verification" content="${esc(env.VITE_GOOGLE_SITE_VERIFICATION)}" />`,
  env.VITE_BING_SITE_VERIFICATION && `<meta name="msvalidate.01" content="${esc(env.VITE_BING_SITE_VERIFICATION)}" />`,
]
  .filter(Boolean)
  .join('\n    ')

function render(seo, body) {
  return template
    .replace('<!--verify-->', verifyTags)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${headTags(seo)}\n    <!--seo:end-->`)
    .replace(/<!--noscript:start-->[\s\S]*?<!--noscript:end-->/, `<!--noscript:start-->${body}<!--noscript:end-->`)
}

function write(route, html) {
  const file = route === '/' ? join(DIST, 'index.html') : route.endsWith('.html') ? join(DIST, route) : join(DIST, route, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const content = await loadContent()
const { posts } = content

write('/', render(routeSeo(SITE_URL, { path: '/', projects: content.projects }), homeBody(content)))
write('/blog', render(routeSeo(SITE_URL, { path: '/blog', posts }), blogBody(content)))
for (const post of posts) {
  const path = `/blog/${post.slug}`
  write(path, render(routeSeo(SITE_URL, { path, post }), postBody(post, posts)))
}
write('/admin', render({ title: 'Admin | Anuj', noindex: true, path: '/admin' }, wrap('<p>Admin</p>')))
write('404.html', render(routeSeo(SITE_URL, { path: '/404', notFound: true }), wrap('<h1>Page not found</h1><p><a href="/">Go to the homepage</a></p>')))

// ---------- sitemap.xml & robots.txt ----------
const today = new Date().toISOString().slice(0, 10)
const latestPost = posts.map((p) => p.updatedAt || p.date).sort().pop() || today
const urls = [
  { loc: '/', lastmod: today, changefreq: 'weekly', priority: '1.0', image: SITE.image },
  { loc: '/blog', lastmod: latestPost, changefreq: 'weekly', priority: '0.8' },
  ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt || p.date, changefreq: 'monthly', priority: '0.7', image: p.cover && !p.cover.endsWith('.svg') ? p.cover : null })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(abs(u.loc))}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `\n    <image:image><image:loc>${esc(abs(u.image))}</image:loc></image:image>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

// ---------- rss.xml (blog feed: readers, Feedly, and faster discovery of new posts) ----------
const rssDate = (d) => new Date(d).toUTCString()
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(`${PROFILE.fullName} | ${SITE.blogTitle}`)}</title>
    <link>${esc(abs('/blog'))}</link>
    <description>${esc(SITE.blogDescription)}</description>
    <language>en-in</language>
    <atom:link href="${esc(abs('/rss.xml'))}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${rssDate(new Date())}</lastBuildDate>
${posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(abs(`/blog/${p.slug}`))}</link>
      <guid isPermaLink="true">${esc(abs(`/blog/${p.slug}`))}</guid>
      <description>${esc(postMetaDescription(p))}</description>
      <pubDate>${rssDate(p.date)}</pubDate>
      <dc:creator>${esc(PROFILE.fullName)}</dc:creator>
${[p.category, ...(p.tags || [])].filter(Boolean).map((c) => `      <category>${esc(c)}</category>`).join('\n')}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`
writeFileSync(join(DIST, 'rss.xml'), rss)

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

console.log(`✓ SEO: ${posts.length + 2} pages, sitemap.xml (${urls.length} URLs), robots.txt, rss.xml, 404.html — content from ${content.source}`)
