import { useEffect } from 'react'
import { SITE, makeAbs, routeSeo } from './seo-core'

// Set VITE_SITE_URL (e.g. https://anuj.dev, no trailing slash) in .env.local and in your hosting env.
// Until then the current origin is used.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
const abs = makeAbs(SITE_URL)

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (content == null || content === '') return el?.remove()
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applySeo({ title, description = SITE.defaultDescription, path = '/', image = SITE.image, type = 'website', noindex, publishedTime, modifiedTime, schema = [] }) {
  const url = abs(path)
  const img = abs(image)

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  if (noindex) document.head.querySelector('link[rel="canonical"]')?.remove()
  else upsertLink('canonical', url)

  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', img)
  upsertMeta('property', 'og:image:alt', title)
  upsertMeta('property', 'article:published_time', type === 'article' ? publishedTime : null)
  upsertMeta('property', 'article:modified_time', type === 'article' ? modifiedTime : null)

  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', img)

  let ld = document.getElementById('ld-json')
  if (!ld) {
    ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.id = 'ld-json'
    document.head.appendChild(ld)
  }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': schema })
}

/** Route-level SEO: pass the same shape routeSeo() accepts ({ path, posts, post, notFound }) */
export function useRouteSeo(input, enabled = true) {
  const key = JSON.stringify([input.path, input.post?.slug, input.post?.updatedAt, input.posts?.length, input.projects?.length, input.notFound, enabled])
  useEffect(() => {
    if (enabled) applySeo(routeSeo(SITE_URL, input))
  }, [key])
}

/** For pages that must never be indexed (admin) */
export function useNoIndex(title) {
  useEffect(() => {
    applySeo({ title, noindex: true, path: window.location.pathname })
  }, [title])
}
