import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { SITE_DEFAULTS } from '../lib/content'
import { Link } from '../router'
import { Button, Card, Field, ImageInput, ListInput, Spinner, inputCls, useToast } from './ui'

const TABS = [
  { key: 'hero', label: 'Hero section' },
  { key: 'about', label: 'About me' },
  { key: 'journey', label: 'My journey' },
]

const cardTitle = 'text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3'

function HeroForm({ value, set }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-5">
        <Field label="Badge text" hint="Small pill above the big heading">
          <input value={value.badge} onChange={(e) => set('badge', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Typing text" hint="Typed out letter by letter, e.g. “I am Anuj”">
          <input value={value.typed} onChange={(e) => set('typed', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Headline">
          <textarea value={value.headline} onChange={(e) => set('headline', e.target.value)} rows={2} className={`${inputCls} resize-y`} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Floating chip title">
            <input value={value.chipTitle} onChange={(e) => set('chipTitle', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Floating chip text">
            <input value={value.chipText} onChange={(e) => set('chipText', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>
      <Card className="p-6">
        <p className={cardTitle}>Hero photo</p>
        <div className="w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-2 border-neon-blue/40 bg-tech-dark">
          {value.photo && <img src={value.photo} alt="" className="w-full h-full object-cover" />}
        </div>
        <ImageInput value={value.photo} onChange={(v) => set('photo', v)} folder="site" nameHint="anuj ror ai developer hero" />
      </Card>
    </div>
  )
}

function AboutForm({ value, set }) {
  const textList = (key, placeholder) => (
    <ListInput
      value={value[key]}
      onChange={(v) => set(key, v)}
      render={(item, update) => <textarea value={item} onChange={(e) => update(e.target.value)} rows={3} placeholder={placeholder} className={`${inputCls} resize-y`} />}
    />
  )
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heading (glowing part)">
              <input value={value.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Heading (rest)">
              <input value={value.from} onChange={(e) => set('from', e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div>
            <p className={cardTitle}>Paragraphs</p>
            {textList('paragraphs', 'Paragraph')}
          </div>
          <Field label="Closing line" hint="Big gradient line after the paragraphs">
            <input value={value.closing} onChange={(e) => set('closing', e.target.value)} className={inputCls} />
          </Field>
        </Card>
        <Card className="p-6 space-y-5">
          <Field label="Story box title">
            <input value={value.storyTitle} onChange={(e) => set('storyTitle', e.target.value)} className={inputCls} />
          </Field>
          <div>
            <p className={cardTitle}>Story paragraphs</p>
            {textList('story', 'Story paragraph')}
          </div>
        </Card>
      </div>
      <Card className="p-6 space-y-5 self-start">
        <p className={cardTitle}>About photo</p>
        <div className="w-44 h-44 mx-auto rounded-[1.5rem] overflow-hidden border-2 border-neon-blue/40 bg-tech-dark">
          {value.photo && <img src={value.photo} alt="" className="w-full h-full object-cover" />}
        </div>
        <ImageInput value={value.photo} onChange={(v) => set('photo', v)} folder="site" nameHint="anuj ror about photo" />
        <Field label="Location label on photo">
          <input value={value.place} onChange={(e) => set('place', e.target.value)} className={inputCls} />
        </Field>
      </Card>
    </div>
  )
}

function JourneyForm({ value, set }) {
  const items = value.timeline
  const update = (i, k, v) => set('timeline', items.map((t, j) => (j === i ? { ...t, [k]: v } : t)))
  const remove = (i) => set('timeline', items.filter((_, j) => j !== i))
  const move = (i, dir) => {
    const next = [...items]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    set('timeline', next)
  }
  return (
    <Card className="p-6">
      <p className={cardTitle}>Timeline (top to bottom)</p>
      <div className="space-y-3">
        {items.map((t, i) => (
          <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-tech-dark/40 border border-white/5">
            <div className="flex flex-col pt-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move up">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move down">
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <input value={t.year} onChange={(e) => update(i, 'year', e.target.value)} placeholder="Year" className={`${inputCls} !w-24 shrink-0`} />
            <textarea value={t.text} onChange={(e) => update(i, 'text', e.target.value)} rows={2} placeholder="What happened" className={`${inputCls} resize-y`} />
            <button type="button" onClick={() => remove(i)} className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Remove">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => set('timeline', [...items, { year: '', text: '' }])} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-neon-blue hover:text-white">
        <Plus className="w-3.5 h-3.5" /> Add year
      </button>
    </Card>
  )
}

const FORMS = { hero: HeroForm, about: AboutForm, journey: JourneyForm }

// Drop empty list entries before saving
function clean(key, data) {
  if (key === 'about') {
    const trim = (arr) => arr.map((s) => s.trim()).filter(Boolean)
    return { ...data, paragraphs: trim(data.paragraphs), story: trim(data.story) }
  }
  if (key === 'journey') return { timeline: data.timeline.filter((t) => t.year.trim() || t.text.trim()) }
  return data
}

export default function SiteContent({ sub }) {
  const tab = TABS.some((t) => t.key === sub) ? sub : 'hero'
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, data')
      .then(({ data, error }) => {
        if (error) toast(error.message.includes('site_content') ? 'Run supabase/site-content.sql in Supabase first' : error.message, 'error')
        const rows = data || []
        setContent(Object.fromEntries(Object.keys(SITE_DEFAULTS).map((k) => [k, { ...SITE_DEFAULTS[k], ...rows.find((r) => r.key === k)?.data }])))
      })
  }, [])

  if (!content) return <Spinner />

  const value = content[tab]
  const set = (k, v) => setContent((c) => ({ ...c, [tab]: { ...c[tab], [k]: v } }))
  const Form = FORMS[tab]

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = clean(tab, value)
    const { error } = await supabase.from('site_content').upsert({ key: tab, data })
    setSaving(false)
    if (error) return toast(error.message, 'error')
    setContent((c) => ({ ...c, [tab]: data }))
    toast('Saved — live on your website')
  }

  const reset = () => {
    if (!confirm('Put back the original text and photo for this section? (Not saved until you click Save.)')) return
    setContent((c) => ({ ...c, [tab]: SITE_DEFAULTS[tab] }))
  }

  return (
    <form onSubmit={save}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 p-1 rounded-xl glass">
          {TABS.map((t) => (
            <Link
              key={t.key}
              to={`/admin/img/${t.key}`}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'text-tech-dark' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === t.key && <motion.span layoutId="img-tab" className="absolute inset-0 rounded-lg bg-neon-blue" />}
              <span className="relative">{t.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={`/#${tab === 'hero' ? 'hero' : 'about'}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-neon-blue">
            <ExternalLink className="w-4 h-4" /> Preview
          </a>
          <Button type="button" variant="ghost" onClick={reset}>
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button type="submit" loading={saving}>
            Save
          </Button>
        </div>
      </div>
      <Form key={tab} value={value} set={set} />
    </form>
  )
}
