import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, ExternalLink, FileText, FolderKanban, Image, LayoutDashboard, Lock, LogOut, Mail, Menu, Settings as SettingsIcon, UploadCloud, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { staticPostRows, staticProjectRows } from '../lib/content'
import { Link, navigate } from '../router'
import { useNoIndex } from '../seo'
import { Button, Card, Field, Spinner, ToastProvider, inputCls, useToast } from './ui'
import Posts from './Posts'
import Projects from './Projects'
import Messages from './Messages'
import SiteContent from './SiteContent'
import Capabilities from './Capabilities'
import Settings from './Settings'

const NAV = [
  { key: '', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'posts', label: 'Blog posts', icon: FileText },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'img', label: 'img', icon: Image },
  { key: 'capabilities', label: 'My Capabilities', icon: Cpu },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
]

const TABBED = ['img', 'capabilities']

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-tech-dark text-white relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(0,246,255,0.10),transparent_60%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(176,38,255,0.10),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  )
}

function Logo() {
  return (
    <span className="font-exo text-xl font-bold tracking-wide">
      <span className="text-neon-blue">&lt;</span>Anuj<span className="text-neon-blue">/&gt;</span>
      <span className="ml-2 text-xs font-sans font-semibold tracking-[0.2em] text-neon-purple align-middle">ADMIN</span>
    </span>
  )
}

function SetupGuide() {
  return (
    <Shell>
      <div className="max-w-2xl mx-auto px-4 py-20">
        <Logo />
        <h1 className="font-exo text-3xl font-bold mt-8 mb-3">Connect Supabase</h1>
        <p className="text-light-gray mb-8">The admin panel needs your Supabase keys. Follow these steps once:</p>
        <Card className="p-6">
          <ol className="space-y-4 text-sm text-light-gray list-decimal list-inside">
            <li>
              Create a free project at <a className="text-neon-blue underline" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">supabase.com</a>.
            </li>
            <li>
              Open <b className="text-white">SQL Editor</b>, paste everything from <code className="text-neon-blue">supabase/schema.sql</code> and click <b className="text-white">Run</b>.
            </li>
            <li>
              Copy <code className="text-neon-blue">.env.example</code> to <code className="text-neon-blue">.env.local</code> and fill in the URL and anon key from <b className="text-white">Project Settings → API</b>.
            </li>
            <li>Restart the dev server (<code className="text-neon-blue">npm run dev</code>) and reload this page.</li>
          </ol>
        </Card>
      </div>
    </Shell>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Logo />
          </div>
          <Card className="border-spin p-8">
            <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mb-5">
              <Lock className="w-5 h-5 text-neon-blue" />
            </div>
            <h1 className="font-exo text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm text-gray-400 mb-6">Sign in to manage your portfolio.</p>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Email">
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Password">
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              </Field>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">
                Sign in
              </Button>
            </form>
          </Card>
          <Link to="/" className="block text-center text-sm text-gray-500 hover:text-neon-blue mt-6">
            ← Back to website
          </Link>
        </motion.div>
      </div>
    </Shell>
  )
}

function NotAdmin({ email }) {
  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="font-exo text-2xl font-bold mb-3">Not an admin yet</h1>
          <p className="text-sm text-light-gray mb-4">
            You're signed in as <b className="text-white">{email}</b>, but this account isn't in the <code className="text-neon-blue">admins</code> table. Run this in the Supabase SQL Editor:
          </p>
          <pre className="text-left text-xs bg-tech-dark rounded-xl p-4 text-neon-blue overflow-x-auto mb-6">
            {`insert into public.admins (user_id)\nselect id from auth.users\nwhere email = '${email}';`}
          </pre>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>I've done it — reload</Button>
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </Shell>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [importing, setImporting] = useState(false)
  const toast = useToast()

  const load = async () => {
    const count = (table, filter) => {
      let q = supabase.from(table).select('id', { count: 'exact', head: true })
      if (filter) q = filter(q)
      return q.then((r) => r.count || 0)
    }
    const [posts, drafts, projects, messages, unread] = await Promise.all([
      count('posts'),
      count('posts', (q) => q.eq('published', false)),
      count('projects'),
      count('messages'),
      count('messages', (q) => q.eq('read', false)),
    ])
    setStats({ posts, drafts, projects, messages, unread })
  }
  useEffect(() => {
    load()
  }, [])

  const importStatic = async () => {
    setImporting(true)
    try {
      if (!stats.posts) {
        const { error } = await supabase.from('posts').insert(staticPostRows())
        if (error) throw error
      }
      if (!stats.projects) {
        const { error } = await supabase.from('projects').insert(staticProjectRows())
        if (error) throw error
      }
      toast('Existing content imported')
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setImporting(false)
    }
  }

  // Overwrites the built-in articles (matched by slug) with the latest text from data.js;
  // publish state/date and any other posts stay as they are
  const [syncing, setSyncing] = useState(false)
  const syncPosts = async () => {
    if (!confirm('Replace the built-in blog articles with the latest version from data.js? Edits you made to those articles here will be overwritten.')) return
    setSyncing(true)
    try {
      for (const { published, published_at, ...row } of staticPostRows()) {
        const { data, error } = await supabase.from('posts').update(row).eq('slug', row.slug).select('id')
        if (error) throw error
        if (!data.length) {
          const { error: insertError } = await supabase.from('posts').insert({ ...row, published, published_at })
          if (insertError) throw insertError
        }
      }
      toast('Blog articles updated')
      await load()
    } catch (err) {
      toast(/meta_|tags/.test(err.message) ? 'Run supabase/post-seo.sql in Supabase first' : err.message, 'error')
    } finally {
      setSyncing(false)
    }
  }

  if (!stats) return <Spinner />

  const cards = [
    { label: 'Blog posts', value: stats.posts, sub: `${stats.drafts} drafts`, to: '/admin/posts', icon: FileText },
    { label: 'Projects', value: stats.projects, sub: 'on your website', to: '/admin/projects', icon: FolderKanban },
    { label: 'Messages', value: stats.messages, sub: `${stats.unread} unread`, to: '/admin/messages', icon: Mail, hot: stats.unread > 0 },
  ]

  return (
    <div className="space-y-6">
      {(!stats.posts || !stats.projects) && (
        <Card className="border-spin p-6 flex flex-col md:flex-row md:items-center gap-4">
          <UploadCloud className="w-8 h-8 text-neon-blue shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-white">Import your current website content</p>
            <p className="text-sm text-gray-400">
              Copies the {!stats.posts && 'blog posts'}
              {!stats.posts && !stats.projects && ' and '}
              {!stats.projects && 'projects'} from <code className="text-neon-blue">data.js</code> into Supabase so you can edit them here.
            </p>
          </div>
          <Button onClick={importStatic} loading={importing}>
            Import now
          </Button>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={c.to} className="block group">
              <Card className="p-6 hover:border-neon-blue/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">{c.label}</span>
                  <c.icon className={`w-5 h-5 ${c.hot ? 'text-neon-purple' : 'text-neon-blue'}`} />
                </div>
                <p className="font-exo text-4xl font-bold text-white group-hover:text-neon-blue transition-colors">{c.value}</p>
                <p className={`text-xs mt-1 ${c.hot ? 'text-neon-purple' : 'text-gray-500'}`}>{c.sub}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <p className="font-semibold text-white mb-4">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/admin/posts/new')}>Write a new post</Button>
          <Button variant="ghost" onClick={() => navigate('/admin/projects/new')}>
            Add a project
          </Button>
          <Button variant="ghost" onClick={syncPosts} loading={syncing}>
            Update built-in blog articles
          </Button>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold glass text-white hover:text-neon-blue">
            <ExternalLink className="w-4 h-4" /> View website
          </a>
        </div>
      </Card>
    </div>
  )
}

function Panel({ session, section, sub }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const current = NAV.find((n) => n.key === section) || NAV[0]
  const page = { '': <Dashboard />, posts: <Posts sub={sub} />, projects: <Projects sub={sub} />, messages: <Messages />, img: <SiteContent sub={sub} />, capabilities: <Capabilities sub={sub} />, settings: <Settings session={session} /> }[section] ?? <Dashboard />

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="px-2 mb-8">
        <Logo />
      </div>
      <div className="space-y-1 flex-1">
        {NAV.map((n) => (
          <Link
            key={n.key}
            to={`/admin${n.key ? `/${n.key}` : ''}`}
            onClick={() => setMenuOpen(false)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              section === n.key ? 'text-neon-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {section === n.key && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-neon-blue/10 border border-neon-blue/20" />}
            <n.icon className="relative w-4 h-4" />
            <span className="relative">{n.label}</span>
          </Link>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
          <ExternalLink className="w-4 h-4" /> View website
        </a>
        <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
        <p className="px-3 pt-2 text-[11px] text-gray-600 truncate">{session.user.email}</p>
      </div>
    </nav>
  )

  return (
    <Shell>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 p-5 border-r border-white/5 bg-tech-dark/60 backdrop-blur-xl">{sidebar}</aside>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} className="relative w-64 p-5 bg-dark-slate border-r border-white/10">
            {sidebar}
          </motion.aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-8 h-16 border-b border-white/5 bg-tech-dark/70 backdrop-blur-xl">
          <button className="lg:hidden text-gray-300" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="font-exo text-lg font-bold">{current.label}</h1>
        </header>
        <main className="px-4 sm:px-8 py-8 max-w-6xl">
          {/* Tabbed pages keep their state (and unsaved edits) when switching tabs */}
          <motion.div key={TABBED.includes(section) ? section : `${section}/${sub}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {page}
          </motion.div>
        </main>
      </div>
    </Shell>
  )
}

export default function Admin({ path }) {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(null)
  const [, section = '', sub = ''] = path.replace(/^\/admin\/?/, '/').replace(/\/$/, '').split('/')

  useNoIndex('Admin | Anuj')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(null)
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)))
  }, [session?.user.id])

  // Unknown admin sections fall back to the dashboard URL
  useEffect(() => {
    if (section && !NAV.some((n) => n.key === section)) navigate('/admin')
  }, [section])

  if (!supabase) return <SetupGuide />
  if (session === undefined || (session && isAdmin === null))
    return (
      <Shell>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      </Shell>
    )
  if (!session) return <Login />
  if (!isAdmin) return <NotAdmin email={session.user.email} />

  return (
    <ToastProvider>
      <Panel session={session} section={section} sub={sub} />
    </ToastProvider>
  )
}
