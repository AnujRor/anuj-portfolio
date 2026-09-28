import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { SITE_DEFAULTS } from '../lib/content'
import { ICONS } from '../components/Skills'
import { Link } from '../router'
import { Button, Card, Field, ImageInput, ListInput, Spinner, inputCls, useToast } from './ui'

const KEY = 'capabilities'
const cardTitle = 'text-xs font-semibold tracking-wider uppercase text-gray-400'

// Each tab edits some fields of the one "capabilities" row
const TABS = [
  { key: 'tools', label: 'AI tools', fields: ['skills'], preview: 'skills' },
  { key: 'numbers', label: 'Numbers', fields: ['stats'], preview: 'skills' },
  { key: 'vision', label: 'My Vision', fields: ['vision', 'visionButton', 'visionMarquee'], preview: 'vision' },
]

// Up/down/delete controls shared by the tool and stat rows
function RowControls({ i, count, onMove, onRemove }) {
  return (
    <>
      <div className="flex flex-col pt-1">
        <button type="button" onClick={() => onMove(i, -1)} disabled={i === 0} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move up">
          <ArrowUp className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => onMove(i, 1)} disabled={i === count - 1} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move down">
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
      <button type="button" onClick={() => onRemove(i)} className="order-last p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Remove">
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  )
}

// Helpers for editing an array of objects
const listOps = (items, setItems) => ({
  update: (i, k, v) => setItems(items.map((t, j) => (j === i ? { ...t, [k]: v } : t))),
  remove: (i) => setItems(items.filter((_, j) => j !== i)),
  move: (i, dir) => {
    const next = [...items]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    setItems(next)
  },
})

export default function Capabilities({ sub }) {
  const tab = TABS.find((t) => t.key === sub) || TABS[0]
  const [value, setValue] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    supabase
      .from('site_content')
      .select('data')
      .eq('key', KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast(error.message.includes('site_content') ? 'Run supabase/site-content.sql in Supabase first' : error.message, 'error')
        setValue({ ...SITE_DEFAULTS[KEY], ...data?.data })
      })
  }, [])

  if (!value) return <Spinner />

  const set = (k, v) => setValue((c) => ({ ...c, [k]: v }))
  const tools = listOps(value.skills, (v) => set('skills', v))
  const stats = listOps(value.stats, (v) => set('stats', v))

  const save = async (e) => {
    e.preventDefault()
    const trim = (arr) => arr.map((x) => x.trim()).filter(Boolean)
    const data = {
      ...value,
      vision: trim(value.vision),
      visionButton: value.visionButton.trim(),
      visionMarquee: trim(value.visionMarquee),
      skills: value.skills.filter((s) => s.name.trim()).map((s) => ({ ...s, name: s.name.trim(), image: (s.image || '').trim() })),
      stats: value.stats.filter((s) => s.label.trim()).map((s) => ({ ...s, value: Number(s.value) || 0 })),
    }
    setSaving(true)
    const { error } = await supabase.from('site_content').upsert({ key: KEY, data })
    setSaving(false)
    if (error) return toast(error.message, 'error')
    setValue(data)
    toast('Saved — live on your website')
  }

  const reset = () => {
    if (!confirm(`Put back the original ${tab.label}? (Not saved until you click Save.)`)) return
    setValue((c) => ({ ...c, ...Object.fromEntries(tab.fields.map((f) => [f, SITE_DEFAULTS[KEY][f]])) }))
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 rounded-xl glass">
          {TABS.map((t) => (
            <Link
              key={t.key}
              to={`/admin/capabilities/${t.key}`}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab.key === t.key ? 'text-tech-dark' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.key === t.key && <motion.span layoutId="cap-tab" className="absolute inset-0 rounded-lg bg-neon-blue" />}
              <span className="relative">{t.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={`/#${tab.preview}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-neon-blue">
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

      {tab.key === 'tools' && (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className={cardTitle}>AI tools ({value.skills.length})</p>
          <Button type="button" variant="ghost" className="!py-1.5 text-xs" onClick={() => set('skills', [...value.skills, { name: '', image: '', iconType: 'Bot' }])}>
            <Plus className="w-3.5 h-3.5" /> Add AI tool
          </Button>
        </div>
        <div className="grid xl:grid-cols-2 gap-3">
          {value.skills.map((s, i) => {
            const Icon = ICONS[s.iconType] || ICONS.Lightbulb
            return (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-tech-dark/40 border border-white/5">
                <RowControls i={i} count={value.skills.length} onMove={tools.move} onRemove={tools.remove} />
                <div className="flex-1 min-w-0 space-y-3">
                  <input value={s.name} onChange={(e) => tools.update(i, 'name', e.target.value)} placeholder="Tool name, e.g. Claude" className={inputCls} />
                  <ImageInput value={s.image || ''} onChange={(v) => tools.update(i, 'image', v)} folder="tools" nameHint={s.name && `${s.name} logo`} />
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="shrink-0">Icon if no logo:</span>
                    <select value={s.iconType || 'Lightbulb'} onChange={(e) => tools.update(i, 'iconType', e.target.value)} className={`${inputCls} !py-1.5 !w-auto`}>
                      {Object.keys(ICONS).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <Icon className="w-4 h-4 text-neon-blue" />
                  </label>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Tip: for a company logo you can paste <code className="text-neon-blue">https://www.google.com/s2/favicons?domain=THEIR-SITE.com&amp;sz=128</code> as the image URL.
        </p>
      </Card>
      )}

      {tab.key === 'numbers' && (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className={cardTitle}>Numbers ({value.stats.length})</p>
          <Button type="button" variant="ghost" className="!py-1.5 text-xs" onClick={() => set('stats', [...value.stats, { value: 0, suffix: '+', label: '' }])}>
            <Plus className="w-3.5 h-3.5" /> Add number
          </Button>
        </div>
        <div className="space-y-3">
          {value.stats.map((s, i) => (
            <div key={i} className="flex gap-3 items-end p-3 rounded-xl bg-tech-dark/40 border border-white/5">
              <RowControls i={i} count={value.stats.length} onMove={stats.move} onRemove={stats.remove} />
              <Field label="Number" className="w-28 shrink-0">
                <input type="number" min="0" value={s.value} onChange={(e) => stats.update(i, 'value', e.target.value)} className={inputCls} />
              </Field>
              <Field label="After" className="w-20 shrink-0">
                <input value={s.suffix} onChange={(e) => stats.update(i, 'suffix', e.target.value)} placeholder="+" className={inputCls} />
              </Field>
              <Field label="Label" className="flex-1">
                <input value={s.label} onChange={(e) => stats.update(i, 'label', e.target.value)} placeholder="AI Tools Mastered" className={inputCls} />
              </Field>
            </div>
          ))}
        </div>
      </Card>
      )}

      {tab.key === 'vision' && (
      <Card className="p-6 space-y-5">
        <div>
          <p className={`${cardTitle} mb-3`}>Lines</p>
          <ListInput value={value.vision} onChange={(v) => set('vision', v)} placeholder="I don't follow systems." />
          <p className="text-xs text-gray-500 mt-2">Shown one below the other; every 2nd line is blue and underlined.</p>
        </div>
        <Field label="Button text">
          <input value={value.visionButton} onChange={(e) => set('visionButton', e.target.value)} className={inputCls} />
        </Field>
        <div>
          <p className={`${cardTitle} mb-3`}>Moving words at the bottom</p>
          <ListInput value={value.visionMarquee} onChange={(v) => set('visionMarquee', v)} placeholder="Think Different" />
        </div>
      </Card>
      )}
    </form>
  )
}
