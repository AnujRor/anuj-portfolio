// Pure SEO data + JSON-LD builders. No React / browser / Vite APIs here, so the
// build script (scripts/seo-build.mjs) can import this file in Node as well.
import { PROFILE } from './data.js'
import { SOCIALS } from './config.js'

export const SITE = {
  name: `${PROFILE.name} | AI Entrepreneur`,
  locale: 'en_IN',
  defaultTitle: `${PROFILE.name} — AI Entrepreneur & Voice AI Builder from Haryana, India`,
  defaultDescription:
    'Anuj is a 19-year-old self-taught AI entrepreneur from Harsola, Haryana building voice AI companions like AI Dost, real-time assistants and AI tools that speak, feel and solve real problems.',
  image: '/og-image.png',
  blogTitle: 'Blog — Voice AI, Projects & Lessons',
  blogDescription:
    'Notes from Anuj on building AI from a small village in Haryana: voice AI, real-time assistants, project breakdowns and lessons learned as a self-taught AI entrepreneur.',
}

export const pageTitle = (title) => (title ? `${title} | ${PROFILE.name}` : SITE.defaultTitle)

export const makeAbs = (siteUrl) => (path = '/') =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

// Social profiles that are real (placeholders from config.js are skipped)
export const sameAs = () => SOCIALS.map((s) => s.href).filter((h) => h && !h.includes('your-profile'))

export const personSchema = (siteUrl) => ({
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: PROFILE.name,
  url: `${siteUrl}/`,
  image: makeAbs(siteUrl)(PROFILE.photo),
  jobTitle: 'AI Entrepreneur & Voice AI Developer',
  description: SITE.defaultDescription,
  address: { '@type': 'PostalAddress', addressLocality: 'Harsola', addressRegion: 'Haryana', addressCountry: 'IN' },
  knowsAbout: ['Artificial Intelligence', 'Voice AI', 'Conversational AI', 'Speech Recognition', 'Text to Speech', 'Real-time Communication'],
  ...(sameAs().length ? { sameAs: sameAs() } : {}),
})

export const websiteSchema = (siteUrl) => ({
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: SITE.name,
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
  blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${siteUrl}/blog/${p.slug}`, datePublished: p.date })),
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
    headline: post.title,
    description: post.excerpt,
    image: makeAbs(siteUrl)(post.cover || SITE.image),
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { '@id': `${siteUrl}/#person` },
    publisher: { '@id': `${siteUrl}/#person` },
    articleSection: post.category,
    wordCount: words,
    inLanguage: 'en',
  }
}

// Everything a route needs for its <head>
export function routeSeo(siteUrl, { path, posts = [], post, notFound }) {
  const base = [personSchema(siteUrl), websiteSchema(siteUrl)]
  if (notFound) return { title: pageTitle('Page not found'), description: SITE.defaultDescription, path, noindex: true, schema: base }
  if (post) {
    return {
      title: pageTitle(post.title),
      description: post.excerpt || SITE.defaultDescription,
      path,
      image: post.cover && !post.cover.endsWith('.svg') ? post.cover : SITE.image,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      schema: [...base, blogPostingSchema(siteUrl, post), breadcrumbSchema(siteUrl, [['Home', '/'], ['Blog', '/blog'], [post.title, path]])],
    }
  }
  if (path.startsWith('/blog')) {
    return {
      title: pageTitle(SITE.blogTitle),
      description: SITE.blogDescription,
      path: '/blog',
      schema: [...base, blogSchema(siteUrl, posts), breadcrumbSchema(siteUrl, [['Home', '/'], ['Blog', '/blog']])],
    }
  }
  return { title: SITE.defaultTitle, description: SITE.defaultDescription, path: '/', schema: [...base, profilePageSchema(siteUrl)] }
}
