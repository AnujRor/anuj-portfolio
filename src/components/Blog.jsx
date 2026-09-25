import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { PROFILE } from '../data'
import { usePosts } from '../lib/content'
import { useRouteSeo } from '../seo'
import { Link } from '../router'
import BlogShell from './BlogShell'

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
const ease = [0.22, 1, 0.36, 1]
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }

function Meta({ post, className = '' }) {
  return (
    <p className={`font-ui text-[13px] text-ink-faint ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className="mx-2" aria-hidden>·</span>
      {post.readTime}
    </p>
  )
}

function Kicker({ children }) {
  return <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{children}</span>
}

function Cover({ post, className = '', priority }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-paper-deep ${className}`}>
      <img
        src={post.cover}
        alt={post.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width="800"
        height="450"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
  )
}

function BlogList({ allPosts }) {
  const categories = useMemo(() => ['All', ...new Set(allPosts.map((p) => p.category))], [allPosts])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...allPosts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
  }, [allPosts, category, query])

  const [featured, ...rest] = posts

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.header {...fadeUp} transition={{ duration: 0.6, ease }} className="relative isolate pt-14 pb-10 md:pt-20 md:pb-14 border-b border-rule">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-80 -z-10 bg-[radial-gradient(ellipse_at_top,#EEF2FF,transparent_65%)]" />
        <h1>
          <Kicker>AI &amp; Voice AI Blog by {PROFILE.fullName}</Kicker>
          <span className="block mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink leading-[1.05] max-w-3xl">
            Thoughts, lessons <span className="italic text-accent">&amp; ideas</span>
          </span>
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg md:text-xl leading-relaxed text-ink-soft">
          Notes from my journey building AI from a small village in Haryana: voice AI, real-time AI agents, project breakdowns and everything I learn along the way.
        </p>
      </motion.header>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.1, ease }}
        className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 py-5 border-b border-rule"
      >
        <div role="tablist" aria-label="Filter by category" className="flex gap-6 overflow-x-auto font-ui text-sm">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`relative whitespace-nowrap py-2 transition-colors ${category === c ? 'text-ink font-medium' : 'text-ink-faint hover:text-ink'}`}
            >
              {c}
              {category === c && <motion.span layoutId="blog-tab" className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            </button>
          ))}
        </div>
        <label className="relative w-full md:w-64">
          <span className="sr-only">Search articles</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="w-full rounded-lg border border-rule bg-white pl-9 pr-3 py-2 font-ui text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
          />
        </label>
      </motion.div>

      {posts.length === 0 && <p className="py-24 text-center font-serif text-xl text-ink-soft">No articles found. Try a different search.</p>}

      {featured && (
        <motion.div key={featured.slug} {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease }} className="py-10 md:py-12">
          <Link to={`/blog/${featured.slug}`} className="group grid md:grid-cols-[1.25fr_1fr] gap-6 md:gap-10 items-center rounded-2xl bg-white p-3 ring-1 ring-ink/5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(67,56,202,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(67,56,202,0.3)] md:p-4 md:pr-10">
            <Cover post={featured} priority className="aspect-[16/10]" />
            <div>
              <div className="flex items-center gap-3">
                <Kicker>{featured.category}</Kicker>
                <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-faint">Latest</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight text-ink group-hover:underline decoration-1 underline-offset-[6px] decoration-ink/30">
                {featured.title}
              </h2>
              <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">{featured.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <Meta post={featured} />
                <span className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-accent">
                  Read article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 py-12 md:py-14">
          {rest.map((post, i) => (
            <motion.article key={post.slug} {...fadeUp} transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease }}>
              <Link to={`/blog/${post.slug}`} className="group block h-full rounded-2xl bg-white p-3 ring-1 ring-ink/5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(67,56,202,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(67,56,202,0.3)]">
                <Cover post={post} className="aspect-[16/10]" />
                <div className="mt-5 px-2 pb-3">
                  <Kicker>{post.category}</Kicker>
                  <h2 className="mt-2 font-serif text-2xl font-medium leading-snug tracking-tight text-ink group-hover:underline decoration-1 underline-offset-[5px] decoration-ink/30">
                    {post.title}
                  </h2>
                  <p className="mt-3 font-serif text-[17px] leading-relaxed text-ink-soft line-clamp-3">{post.excerpt}</p>
                  <Meta post={post} className="mt-4" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}

function BlogPost({ post, allPosts }) {
  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article className="pb-20">
      <header className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 md:pt-16">
        <motion.nav aria-label="Breadcrumb" {...fadeUp} transition={{ duration: 0.5, ease }}>
          <ol className="flex items-center gap-2 font-ui text-sm text-ink-faint">
            <li>
              <Link to="/blog" className="group inline-flex items-center gap-1.5 hover:text-ink transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                All articles
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink-soft">
              {post.category}
            </li>
          </ol>
        </motion.nav>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.05, ease }}
          className="mt-8 font-serif text-4xl sm:text-5xl md:text-[3.4rem] font-medium leading-[1.1] tracking-tight text-ink"
        >
          {post.title}
        </motion.h1>
        {post.excerpt && (
          <motion.p {...fadeUp} transition={{ duration: 0.7, delay: 0.1, ease }} className="mt-5 font-serif text-xl md:text-2xl leading-relaxed text-ink-soft">
            {post.excerpt}
          </motion.p>
        )}
        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15, ease }} className="mt-8 flex items-center gap-3 py-5 border-y border-rule">
          <img src={PROFILE.photo} alt={PROFILE.fullName} width="44" height="44" loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover" />
          <div>
            <p className="font-ui text-sm font-semibold text-ink">{PROFILE.fullName}</p>
            <Meta post={post} />
          </div>
        </motion.div>
      </header>

      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="mx-auto max-w-5xl px-4 sm:px-6 mt-10 md:mt-12"
      >
        <img src={post.cover} alt={post.title} width="1200" height="630" fetchpriority="high" decoding="async" className="w-full max-h-[34rem] object-cover rounded-xl bg-paper-deep" />
      </motion.figure>

      <div className="mx-auto max-w-[42rem] px-4 sm:px-6 mt-12 md:mt-16 font-serif text-[1.2rem] md:text-[1.3rem] leading-[1.75] text-ink/90">
        {post.content.map((block, i) => {
          if (typeof block === 'string')
            return (
              <p key={i} className={`mb-7 ${i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.2rem] first-letter:leading-[0.85] first-letter:font-semibold first-letter:text-accent' : ''}`}>
                {block}
              </p>
            )
          if (block.h)
            return (
              <h2 key={i} className="mt-14 mb-5 font-serif text-[1.75rem] md:text-3xl font-semibold leading-snug tracking-tight text-ink">
                {block.h}
              </h2>
            )
          if (block.quote)
            return (
              <blockquote key={i} className="my-12 rounded-r-xl border-l-[3px] border-accent bg-accent-soft/60 py-6 pr-6 pl-6 md:pl-8 font-serif text-2xl md:text-[1.75rem] italic leading-snug text-ink">
                “{block.quote}”
              </blockquote>
            )
          return null
        })}

        <div className="mt-14 pt-8 border-t border-rule flex items-center gap-4">
          <img src={PROFILE.photo} alt="" width="56" height="56" loading="lazy" decoding="async" className="w-14 h-14 rounded-full object-cover" />
          <div className="font-ui">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-faint">Written by</p>
            <p className="text-base font-semibold text-ink">{PROFILE.fullName}</p>
            <p className="text-sm text-ink-soft">
              AI entrepreneur from {PROFILE.location.split(',')[0]}.{' '}
              <Link to="/#about" className="text-accent hover:underline underline-offset-4">
                More about me
              </Link>
            </p>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-heading" className="mt-20 border-t border-rule bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-baseline justify-between mb-8">
              <h2 id="more-heading" className="font-serif text-3xl font-medium tracking-tight text-ink">
                Keep reading
              </h2>
              <Link to="/blog" className="font-ui text-sm font-medium text-ink-soft hover:text-ink inline-flex items-center gap-1.5">
                All articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {others.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group block rounded-2xl bg-white p-3 ring-1 ring-ink/5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(67,56,202,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(67,56,202,0.3)]">
                  <Cover post={p} className="aspect-[16/10]" />
                  <div className="mt-4 px-2 pb-3">
                    <Kicker>{p.category}</Kicker>
                    <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-ink group-hover:underline decoration-1 underline-offset-4 decoration-ink/30">{p.title}</h3>
                    <Meta post={p} className="mt-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export default function Blog({ path }) {
  const slug = path.replace(/^\/blog\/?/, '').replace(/\/$/, '')
  const { data: posts, loading } = usePosts()
  const post = slug ? posts.find((p) => p.slug === slug) : null

  useRouteSeo({ path: slug ? `/blog/${slug}` : '/blog', posts, post, notFound: Boolean(slug && !post) }, !loading)

  let body
  if (loading) {
    body = (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-rule border-t-accent animate-spin" />
      </div>
    )
  } else if (slug && !post) {
    body = (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="font-serif text-7xl font-medium text-ink-faint mb-4">404</p>
        <h1 className="font-serif text-3xl font-medium text-ink mb-2">Article not found</h1>
        <p className="font-serif text-lg text-ink-soft mb-8">This article doesn't exist or may have been moved.</p>
        <Link to="/blog" className="rounded-full bg-accent px-6 py-3 font-ui text-sm font-medium text-white hover:bg-accent/90 transition-colors">
          Back to all articles
        </Link>
      </div>
    )
  } else {
    body = (
      <motion.div key={slug || 'list'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {post ? <BlogPost post={post} allPosts={posts} /> : <BlogList allPosts={posts} />}
      </motion.div>
    )
  }

  return <BlogShell isPost={Boolean(post)}>{body}</BlogShell>
}
