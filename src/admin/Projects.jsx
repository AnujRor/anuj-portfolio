import { useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link, navigate } from '../router'
import { Button, Card, Empty, Field, ImageInput, ListInput, Spinner, Toggle, inputCls, useToast } from './ui'

const EMPTY = {
  title: '',
  tag: '',
  description: '',
  long_description: '',
  images: [''],
  features: [''],
  tech_stack: [''],
  demo_link: '#',
  published: true,
}

function ProjectList() {
  const [projects, setProjects] = useState(null)
  const toast = useToast()

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, title, tag, images, published, sort_order')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) toast(error.message, 'error')
        setProjects(data || [])
      })
  }, [])

  const move = async (index, dir) => {
    const next = [...projects]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setProjects(next)
    const results = await Promise.all(next.map((p, i) => supabase.from('projects').update({ sort_order: i }).eq('id', p.id)))
    const failed = results.find((r) => r.error)
    if (failed) toast(failed.error.message, 'error')
  }

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) return toast(error.message, 'error')
    toast('Project deleted')
    setProjects((x) => x.filter((y) => y.id !== p.id))
  }

  if (!projects) return <Spinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-400">Use the arrows to change the order on your website.</p>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="w-4 h-4" /> New project
        </Button>
      </div>
      <Card className="overflow-hidden">
        {projects.length === 0 ? (
          <Empty>No projects yet.</Empty>
        ) : (
          <div className="divide-y divide-white/5">
            {projects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]">
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="text-gray-500 hover:text-neon-blue disabled:opacity-20" aria-label="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-tech-dark border border-white/10 shrink-0">
                  {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.tag}</p>
                </div>
                <span
                  className={`hidden sm:inline px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                    p.published ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-gray-400 border-white/10'
                  }`}
                >
                  {p.published ? 'Visible' : 'Hidden'}
                </span>
                <Link to={`/admin/projects/${p.id}`} className="p-2 rounded-lg text-gray-400 hover:text-neon-blue hover:bg-white/5" title="Edit">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => remove(p)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function ProjectEditor({ id }) {
  const isNew = id === 'new'
  const [project, setProject] = useState(isNew ? EMPTY : null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (isNew) return
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast(error.message, 'error')
          navigate('/admin/projects')
        } else setProject(data)
      })
  }, [id])

  if (!project) return <Spinner />
  const set = (k, v) => setProject((p) => ({ ...p, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    if (!project.title.trim()) return toast('Title is required', 'error')
    setSaving(true)
    const { id: _id, created_at, updated_at, ...fields } = project
    const clean = (arr) => arr.map((s) => s.trim()).filter(Boolean)
    const row = { ...fields, images: clean(fields.images), features: clean(fields.features), tech_stack: clean(fields.tech_stack) }
    if (isNew) {
      const { count } = await supabase.from('projects').select('id', { count: 'exact', head: true })
      row.sort_order = count || 0
    }
    const { data, error } = isNew
      ? await supabase.from('projects').insert(row).select().single()
      : await supabase.from('projects').update(row).eq('id', id).select().single()
    setSaving(false)
    if (error) return toast(error.message, 'error')
    toast(isNew ? 'Project created' : 'Changes saved')
    if (isNew) navigate(`/admin/projects/${data.id}`)
    else setProject(data)
  }

  return (
    <form onSubmit={save}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-blue">
          <ArrowLeft className="w-4 h-4" /> All projects
        </Link>
        <div className="flex items-center gap-4">
          <Toggle checked={project.published} onChange={(v) => set('published', v)} label={project.published ? 'Visible' : 'Hidden'} />
          <Button type="submit" loading={saving}>
            {isNew ? 'Create project' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Title" className="col-span-2">
              <input value={project.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Tag">
              <input value={project.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Flagship" className={inputCls} />
            </Field>
          </div>
          <Field label="Short description">
            <input value={project.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Full description" hint="Shown next to the screenshots on your site">
            <textarea value={project.long_description} onChange={(e) => set('long_description', e.target.value)} rows={7} className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Live demo link">
            <input value={project.demo_link} onChange={(e) => set('demo_link', e.target.value)} placeholder="https://..." className={inputCls} />
          </Field>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3">Screenshots</p>
            <ListInput value={project.images} onChange={(v) => set('images', v)} render={(item, update) => <ImageInput value={item} onChange={update} folder="projects" nameHint={project.title && `${project.title} screenshot`} />} />
          </Card>
          <Card className="p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3">Key features</p>
            <ListInput value={project.features} onChange={(v) => set('features', v)} placeholder="Feature" />
          </Card>
          <Card className="p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3">Technology stack</p>
            <ListInput value={project.tech_stack} onChange={(v) => set('tech_stack', v)} placeholder="e.g. OpenAI" />
          </Card>
        </div>
      </div>
    </form>
  )
}

export default function Projects({ sub }) {
  return sub ? <ProjectEditor key={sub} id={sub} /> : <ProjectList />
}
