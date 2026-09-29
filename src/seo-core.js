// Pure SEO data + JSON-LD builders. No React / browser / Vite APIs here, so the
// build script (scripts/seo-build.mjs) can import this file in Node as well.
import { PROFILE } from './data.js'
import { SOCIALS } from './config.js'

// Keyword targets: the full name (branded search), "AI developer" / "voice AI developer" + India/Haryana (local
// intent) and the project names. Titles stay under ~60 characters and descriptions under ~160 so Google shows them whole.
export const SITE = {
  name: `${PROFILE.fullName} | AI Developer`,
  locale: 'en_IN',
  defaultTitle: `${PROFILE.fullName} | AI Developer & Voice AI Builder, Haryana, India`,
  defaultDescription:
    'Anuj Ror is a self-taught AI developer and entrepreneur from Haryana, India, building voice AI assistants like AI Dost, real-time AI agents and smart AI tools.',
  image: '/og-image.png',
  blogTitle: 'AI & Voice AI Blog: Projects, Tutorials & Lessons',
  blogDescription:
    'Voice AI, real-time AI agents and AI project breakdowns from Anuj Ror, a self-taught AI developer from Haryana, India. Practical lessons from building AI.',
  keywords: [
    'Anuj Ror',
    'Anuj AI developer',
    'AI developer India',
    'AI developer Haryana',
    'voice AI developer',
    'AI entrepreneur India',
    'conversational AI',
    'real-time voice assistant',
    'AI agents',
    'AI Dost',
  ],
}

export const pageTitle = (title) => (title ? `${title} | ${PROFILE.fullName}` : SITE.defaultTitle)

// Post SEO with fallbacks: a missing meta title/description falls back to the title/excerpt
export const postMetaTitle = (post) => pageTitle(post.metaTitle || post.title)
export const postMetaDescription = (post) => post.metaDescription || post.excerpt || SITE.defaultDescription
export const postKeywords = (post) => [...new Set([...(post.tags || []), post.category, PROFILE.fullName].filter(Boolean))]

// Only raster images work as social previews (Facebook, WhatsApp, LinkedIn, X ignore SVG)
export const shareImage = (src) => (src && !src.endsWith('.svg') ? src : SITE.image)

// Other posts ranked by shared tags, then same category, then newest (internal links for readers and Google)
export function relatedPosts(post, posts, limit = 3) {
  const tags = new Set((post.tags || []).map((t) => t.toLowerCase()))
  const score = (p) => (p.tags || []).filter((t) => tags.has(t.toLowerCase())).length * 2 + (p.category === post.category ? 1 : 0)
  return posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => score(b) - score(a) || new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export const makeAbs = (siteUrl) => (path = '/') =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

// Social profiles that are real (placeholders from config.js are skipped)
export const sameAs = () => SOCIALS.map((s) => s.href).filter((h) => h && !h.includes('your-profile'))

export const personSchema = (siteUrl) => ({
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: PROFILE.fullName,
  givenName: PROFILE.name,
  familyName: PROFILE.fullName.split(' ').slice(1).join(' '),
  alternateName: [PROFILE.name, 'AnujRor', 'anuj_ror_13'],
  url: `${siteUrl}/`,
  image: makeAbs(siteUrl)(PROFILE.photo),
  jobTitle: 'AI Developer & Voice AI Entrepreneur',
  hasOccupation: { '@type': 'Occupation', name: 'AI Developer', occupationLocation: { '@type': 'Country', name: 'India' } },
  description: SITE.defaultDescription,
  nationality: { '@type': 'Country', name: 'India' },
  address: { '@type': 'PostalAddress', addressLocality: 'Harsola', addressRegion: 'Haryana', addressCountry: 'IN' },
  knowsAbout: [
    'Artificial Intelligence',
    'Voice AI',
    'Conversational AI',
    'AI Agents',
    'Large Language Models',
    'Speech Recognition',
    'Text to Speech',
    'Real-time Communication',
    'OpenAI GPT',
    'ElevenLabs',
    'Deepgram',
    'LiveKit',
  ],
  ...(sameAs().length ? { sameAs: sameAs() } : {}),
})

export const websiteSchema = (siteUrl) => ({
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: SITE.name,
  alternateName: [PROFILE.fullName, `${PROFILE.name} Portfolio`],
  description: SITE.defaultDescription,
  inLanguage: 'en',
  publisher: { '@id': `${siteUrl}/#person` },
})

export const profilePageSchema = (siteUrl) => ({
  '@type': 'ProfilePage',
  '@id': `${siteUrl}/#profile`,
  url: `${siteUrl}/`,
  name: SITE.defaultTitle,
  isPartOf: { '@id': `${siteUrl}/#website` },
  mainEntity: { '@id': `${siteUrl}/#person` },
  inLanguage: 'en',
})

// Projects as structured data, so Google can connect project names (AI Dost, IQ World...) to the person
export const projectsSchema = (siteUrl, projects) => ({
  '@type': 'ItemList',
  '@id': `${siteUrl}/#projects`,
  name: `AI projects by ${PROFILE.fullName}`,
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: p.title,
      description: p.description || p.longDescription || '',
      applicationCategory: p.tag || 'AI Application',
      operatingSystem: 'Web',
      url: /^https?:\/\//.test(p.demoLink || '') ? p.demoLink : `${siteUrl}/#projects`,
      creator: { '@id': `${siteUrl}/#person` },
      ...(p.techStack?.length ? { keywords: p.techStack.join(', ') } : {}),
    },
  })),
})

export const breadcrumbSchema = (siteUrl, items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: makeAbs(siteUrl)(path) })),
})

export const blogSchema = (siteUrl, posts) => ({
  '@type': 'Blog',
  '@id': `${siteUrl}/blog#blog`,
  url: `${siteUrl}/blog`,
  name: SITE.blogTitle,
  description: SITE.blogDescription,
  author: { '@id': `${siteUrl}/#person` },
  inLanguage: 'en',
  blogPost: posts.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: postMetaDescription(p),
    url: `${siteUrl}/blog/${p.slug}`,
    image: makeAbs(siteUrl)(shareImage(p.cover)),
    datePublished: p.date,
    dateModified: p.updatedAt || p.date,
    author: { '@id': `${siteUrl}/#person` },
  })),
})

const plainText = (content) =>
  (Array.isArray(content) ? content : []).map((b) => (typeof b === 'string' ? b : b.h || b.quote || '')).join(' ')

export const blogPostingSchema = (siteUrl, post) => {
  const url = `${siteUrl}/blog/${post.slug}`
  const words = plainText(post.content).split(/\s+/).filter(Boolean).length
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title.slice(0, 110),
    description: postMetaDescription(post),
    image: [makeAbs(siteUrl)(shareImage(post.cover))],
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    // Name + url inline as well as the @id, which is what Google's article author check reads
    author: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: PROFILE.fullName, url: `${siteUrl}/` },
    publisher: { '@id': `${siteUrl}/#person` },
    isPartOf: { '@id': `${siteUrl}/blog#blog` },
    articleSection: post.category,
    keywords: postKeywords(post).join(', '),
    wordCount: words,
    timeRequired: `PT${Math.max(1, Math.round(words / 200))}M`,
    inLanguage: 'en',
  }
}

// Everything a route needs for its <head>
export function routeSeo(siteUrl, { path, posts = [], post, notFound, projects = [] }) {
  const base = [personSchema(siteUrl), websiteSchema(siteUrl)]
  if (notFound) return { title: pageTitle('Page not found'), description: SITE.defaultDescription, path, noindex: true, schema: base }
  if (post) {
    return {
      title: postMetaTitle(post),
      description: postMetaDescription(post),
      keywords: postKeywords(post),
      path,
      image: shareImage(post.cover),
      imageAlt: post.title,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      section: post.category,
      tags: post.tags || [],
      schema: [...base, blogPostingSchema(siteUrl, post), breadcrumbSchema(siteUrl, [['Home', '/'], ['Blog', '/blog'], [post.title, path]])],
    }
  }
  if (path.startsWith('/blog')) {
    return {
      title: pageTitle(SITE.blogTitle),
      description: SITE.blogDescription,
      keywords: [...new Set([PROFILE.fullName, 'AI blog', 'voice AI blog', ...SITE.keywords.slice(1), ...posts.flatMap((p) => p.tags || [])])].slice(0, 20),
      path: '/blog',
      schema: [...base, blogSchema(siteUrl, posts), breadcrumbSchema(siteUrl, [['Home', '/'], ['Blog', '/blog']])],
    }
  }
  return {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    keywords: SITE.keywords,
    path: '/',
    schema: [...base, profilePageSchema(siteUrl), ...(projects.length ? [projectsSchema(siteUrl, projects)] : [])],
  }
}
