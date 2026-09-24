import { useMemo, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Search } from 'lucide-react'
import { PROFILE } from '../data'
import { usePosts } from '../lib/content'
import { useRouteSeo } from '../seo'
import { Link } from '../router'
import { SectionTitle, SpotlightCard } from './fx'

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function Meta({ post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
      <span className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-neon-blue" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-neon-blue" />
        {post.readTime}
      </span>
    </div>
  )
}

function Cover({ post, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-tech-dark ${className}`}>
      <img src={post.cover} alt={post.title} loading="lazy" decoding="async" width="800" height="450" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-tech-dark via-tech-dark/20 to-transparent" />
      <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-[11px] font-semibold tracking-wider uppercase text-neon-blue">
        {post.category}
      </span>
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
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle as="h1" eyebrow="Blog" accent="& Ideas" className="!mb-6">
          Thoughts, Lessons
        </SectionTitle>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-light-gray max-w-2xl mx-auto mb-12"
        >
          Notes from my journey building AI from a small village — projects, experiments and everything I learn along the way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'text-tech-dark' : 'text-gray-300 hover:text-white glass'}`}
              >
                {category === c && (
                  <motion.span layoutId="blog-cat" className="absolute inset-0 rounded-full bg-neon-blue shadow-glow" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <label className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full glass rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-blue/60"
            />
          </label>
        </motion.div>

        {posts.length === 0 && <p className="text-center text-gray-400 py-20">No posts found. Try a different search.</p>}

        <>
          {featured && (
            <motion.div key={featured.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
              <Link to={`/blog/${featured.slug}`} className="block">
                <SpotlightCard className="border-spin glass rounded-3xl overflow-hidden grid md:grid-cols-2">
                  <Cover post={featured} className="h-64 md:h-full min-h-[18rem]" />
                  <div className="relative p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-xs font-semibold tracking-[0.25em] text-neon-purple uppercase mb-4">Latest post</span>
                    <h2 className="font-exo text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">{featured.title}</h2>
                    <p className="text-light-gray mb-6">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Meta post={featured} />
                      <span className="flex w-11 h-11 items-center justify-center rounded-full bg-neon-blue text-tech-dark transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.div key={post.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <SpotlightCard color={i % 2 ? '176, 38, 255' : '0, 246, 255'} className="glass rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-500 hover:-translate-y-1.5">
                    <Cover post={post} className="h-48" />
                    <div className="relative p-6 flex flex-col flex-1">
                      <h2 className="font-exo text-xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">{post.title}</h2>
                      <p className="text-light-gray text-sm mb-6 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <Meta post={post} />
                        <ArrowUpRight className="w-5 h-5 text-neon-blue transition-transform duration-300 group-hover:rotate-45" />
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      </div>
    </section>
  )
}

function BlogPost({ post, allPosts }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <article className="pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.nav aria-label="Breadcrumb" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-neon-blue transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link to="/blog" className="group inline-flex items-center gap-1.5 hover:text-neon-blue transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                Blog
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li aria-current="page" className="text-gray-300 truncate max-w-[16rem]">
              {post.title}
            </li>
          </ol>
        </motion.nav>

        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-block px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-semibold tracking-[0.2em] uppercase mb-5">
          {post.category}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-exo text-3xl md:text-5xl font-bold text-white leading-tight mb-6"
        >
          {post.title}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 mb-10">
          <img src={PROFILE.photo} alt={PROFILE.name} width="44" height="44" loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover border-2 border-neon-blue/60" />
          <div>
            <p className="text-white font-semibold text-sm">{PROFILE.name}</p>
            <Meta post={post} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="border-spin rounded-3xl overflow-hidden mb-12"
        >
          <img src={post.cover} alt={post.title} width="1200" height="630" fetchpriority="high" decoding="async" className="w-full max-h-[26rem] object-cover" />
        </motion.div>

        <div className="space-y-6 text-lg leading-relaxed text-light-gray">
          {post.content.map((block, i) => {
            const anim = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.5 } }
            if (typeof block === 'string') return <motion.p key={i} {...anim}>{block}</motion.p>
            if (block.h)
              return (
                <motion.h2 key={i} {...anim} className="font-exo text-2xl md:text-3xl font-bold text-white pt-6 pl-4 border-l-4 border-neon-blue">
                  {block.h}
                </motion.h2>
              )
            if (block.quote)
              return (
                <motion.blockquote key={i} {...anim} className="glass rounded-2xl p-6 md:p-8 my-8 font-exo text-xl md:text-2xl font-semibold text-white">
                  <span className="text-shine">“{block.quote}”</span>
                </motion.blockquote>
              )
            return null
          })}
        </div>

        {others.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <h3 className="font-exo text-2xl font-bold text-white mb-6">
              Keep <span className="text-neon-blue">reading</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="block">
                  <SpotlightCard className="glass rounded-2xl p-6 h-full">
                    <span className="relative text-[11px] font-semibold tracking-wider uppercase text-neon-blue">{p.category}</span>
                    <h4 className="relative font-exo text-lg font-bold text-white mt-2 mb-3 group-hover:text-neon-blue transition-colors">{p.title}</h4>
                    <div className="relative">
                      <Meta post={p} />
                    </div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reading progress on the left edge */}
      <motion.div style={{ scaleY: progress }} className="hidden lg:block fixed left-6 top-1/4 h-1/2 w-[2px] origin-top bg-gradient-to-b from-neon-blue to-neon-purple rounded-full z-40" />
    </article>
  )
}

export default function Blog({ path }) {
  const slug = path.replace(/^\/blog\/?/, '').replace(/\/$/, '')
  const { data: posts, loading } = usePosts()
  const post = slug ? posts.find((p) => p.slug === slug) : null

  useRouteSeo({ path: slug ? `/blog/${slug}` : '/blog', posts, post, notFound: Boolean(slug && !post) }, !loading)

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center pt-24">
        <div className="w-10 h-10 rounded-full border-2 border-neon-blue/20 border-t-neon-blue animate-spin" />
      </section>
    )
  }

  if (slug && !post) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <p className="font-exo text-7xl font-bold text-outline mb-4">404</p>
        <h1 className="font-exo text-2xl font-bold text-white mb-2">Post not found</h1>
        <p className="text-light-gray mb-8">This post doesn't exist or may have been moved.</p>
        <Link to="/blog" className="px-6 py-3 rounded-full bg-neon-blue text-tech-dark font-semibold">
          Back to blog
        </Link>
      </section>
    )
  }

  return (
    <motion.div key={slug || 'list'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {post ? <BlogPost post={post} allPosts={posts} /> : <BlogList allPosts={posts} />}
    </motion.div>
  )
}
