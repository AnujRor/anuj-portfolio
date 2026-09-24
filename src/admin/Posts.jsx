import { useEffect, useState } from 'react'
import { ArrowLeft, Eye, ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { parseContent } from '../lib/content'
import { Link, navigate } from '../router'
import { Button, Card, Empty, Field, ImageInput, Spinner, Toggle, inputCls, useToast } from './ui'

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

const readTime = (text) => `${Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200))} min read`

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover: '',
  category: 'General',
  read_time: '',
  published: false,
  published_at: new Date().toISOString().slice(0, 10),
}

function PostList() {
  const [posts, setPosts] = useState(null)
  const [q, setQ] = useState('')
  const toast = useToast()

  const load = async () => {
    const { data, error } = await supabase.from('posts').select('id, title, slug, category, published, published_at').order('published_at', { ascending: false })
    if (error) toast(error.message, 'error')
    setPosts(data || [])
  }
  useEffect(() => {
    load()
  }, [])

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('posts').delete().eq('id', p.id)
    if (error) return toast(error.message, 'error')
    toast('Post deleted')
    setPosts((x) => x.filter((y) => y.id !== p.id))
  }

  const togglePublish = async (p) => {
    const { error } = await supabase.from('posts').update({ published: !p.published }).eq('id', p.id)
    if (error) return toast(error.message, 'error')
    setPosts((x) => x.map((y) => (y.id === p.id ? { ...y, published: !p.published } : y)))
    toast(p.published ? 'Moved to drafts' : 'Published')
  }

  if (!posts) return <Spinner />
  const shown = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <label className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts..." className={`${inputCls} pl-10`} />
        </label>
        <Button onClick={() => navigate('/admin/posts/new')}>
          <Plus className="w-4 h-4" /> New post
        </Button>
      </div>

      <Card className="overflow-hidden">
        {shown.length === 0 ? (
          <Empty>No posts yet. Create your first one!</Empty>
        ) : (
          <div className="divide-y divide-white/5">
            {shown.map((p) => (
              <div key={p.id} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4 hover:bg-white/[0.02]">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.category} · {p.published_at} · /blog/{p.slug}
                  </p>
                </div>
                <button
                  onClick={() => togglePublish(p)}
                  className={`self-start md:self-auto px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                    p.published ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  }`}
                  title="Click to toggle"
                >
                  {p.published ? 'Published' : 'Draft'}
                </button>
                <div className="flex gap-1">
                  {p.published && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-white/5" title="View">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <Link to={`/admin/posts/${p.id}`} className="p-2 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-white/5" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => remove(p)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Preview({ post }) {
  return (
    <div className="space-y-4 text-light-gray leading-relaxed">
      {post.cover && <img src={post.cover} alt="" className="w-full max-h-56 object-cover rounded-xl" />}
      <h1 className="font-exo text-3xl font-bold text-white">{post.title || 'Untitled'}</h1>
      {parseContent(post.content).map((b, i) =>
        typeof b === 'string' ? (
          <p key={i}>{b}</p>
        ) : b.h ? (
          <h2 key={i} className="font-exo text-xl font-bold text-white pl-3 border-l-4 border-neon-blue">
            {b.h}
          </h2>
        ) : (
          <blockquote key={i} className="glass rounded-xl p-4 text-white font-semibold">
            “{b.quote}”
          </blockquote>
        ),
      )}
    </div>
  )
}

function PostEditor({ id }) {
  const isNew = id === 'new'
  const [post, setPost] = useState(isNew ? EMPTY : null)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('write')
  const toast = useToast()

  useEffect(() => {
    if (isNew) return
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast(error.message, 'error')
          navigate('/admin/posts')
        } else setPost(data)
      })
  }, [id])

  if (!post) return <Spinner />

  const set = (k, v) =>
    setPost((p) => {
      const next = { ...p, [k]: v }
      if (k === 'title' && !slugTouched) next.slug = slugify(v)
      return next
    })

  const save = async (e) => {
    e.preventDefault()
    if (!post.title.trim() || !post.slug.trim()) return toast('Title and slug are required', 'error')
    setSaving(true)
    const { id: _id, created_at, updated_at, ...fields } = post
    const row = { ...fields, slug: slugify(fields.slug), read_time: fields.read_time || readTime(fields.content) }
    const { data, error } = isNew ? await supabase.from('posts').insert(row).select().single() : await supabase.from('posts').update(row).eq('id', id).select().single()
    setSaving(false)
    if (error) return toast(error.code === '23505' ? 'This slug is already used by another post' : error.message, 'error')
    toast(isNew ? 'Post created' : 'Changes saved')
    if (isNew) navigate(`/admin/posts/${data.id}`)
    else setPost(data)
  }

  return (
    <form onSubmit={save}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link to="/admin/posts" className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-blue">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <div className="flex items-center gap-4">
          <Toggle checked={post.published} onChange={(v) => set('published', v)} label={post.published ? 'Published' : 'Draft'} />
          <Button type="submit" loading={saving}>
            {isNew ? 'Create post' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-5">
          <input
            value={post.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Post title"
            className="w-full bg-transparent font-exo text-2xl md:text-3xl font-bold text-white placeholder:text-gray-600 focus:outline-none"
          />
          <div className="flex gap-1 border-b border-white/10">
            {['write', 'preview'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${tab === t ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {t === 'preview' ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                {t}
              </button>
            ))}
          </div>
          {tab === 'write' ? (
            <div>
              <textarea
                value={post.content}
                onChange={(e) => set('content', e.target.value)}
                rows={18}
                placeholder={'Write your post here...\n\nLeave a blank line between paragraphs.\n\n## This becomes a heading\n\n> This becomes a highlighted quote'}
                className={`${inputCls} font-mono leading-relaxed resize-y`}
              />
              <p className="text-xs text-gray-500 mt-2">
                Blank line = new paragraph · <code className="text-neon-blue">## </code> heading · <code className="text-neon-blue">&gt; </code> quote
              </p>
            </div>
          ) : (
            <Preview post={post} />
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <Field label="URL slug" hint={`yoursite.com/blog/${post.slug || '...'}`}>
              <input
                value={post.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug', e.target.value)
                }}
                className={inputCls}
              />
            </Field>
            <Field label="Short excerpt" hint="Shown on the blog cards">
              <textarea value={post.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <input value={post.category} onChange={(e) => set('category', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Date">
                <input type="date" value={post.published_at} onChange={(e) => set('published_at', e.target.value)} className={`${inputCls} [color-scheme:dark]`} />
              </Field>
            </div>
            <Field label="Read time" hint="Leave empty to calculate automatically">
              <input value={post.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder={readTime(post.content)} className={inputCls} />
            </Field>
          </Card>
          <Card className="p-6">
            <Field label="Cover image">
              <ImageInput value={post.cover} onChange={(v) => set('cover', v)} folder="posts" nameHint={post.title && `${post.title} cover`} />
            </Field>
          </Card>
        </div>
      </div>
    </form>
  )
}

export default function Posts({ sub }) {
  return sub ? <PostEditor key={sub} id={sub} /> : <PostList />
}
