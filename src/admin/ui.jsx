import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ImagePlus, Loader2, Plus, Trash2, X, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export const inputCls =
  'w-full bg-tech-dark/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_0_3px_rgba(0,246,255,0.12)] transition'

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1.5">{hint}</span>}
    </label>
  )
}

export function Button({ variant = 'primary', loading, children, className = '', ...rest }) {
  const styles = {
    primary: 'bg-neon-blue text-tech-dark hover:bg-white shadow-[0_0_20px_rgba(0,246,255,0.25)]',
    ghost: 'glass text-white hover:border-neon-blue/50 hover:text-neon-blue',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white',
  }
  return (
    <button
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm text-white">
      <span className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-neon-blue' : 'bg-white/10'}`}>
        <motion.span layout className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow ${checked ? 'right-1' : 'left-1'}`} />
      </span>
      {label}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>
}

// SEO-friendly file name: "AI Dost: Voice Chat!" -> "ai-dost-voice-chat"
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')

// Photos (JPG/PNG/...) are converted to WebP in the browser and scaled down to at most 1600px wide,
// so every uploaded image is small and fast. SVGs, GIFs and WebPs are uploaded as they are.
const MAX_WIDTH = 1600
async function toWebp(file) {
  if (!/^image\/(jpeg|png|bmp|avif)$/.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_WIDTH / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
    // Keep the original if the browser can't encode WebP or the result isn't smaller
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file
  }
}

// Uploads a file to the public "media" bucket and returns its URL.
// The stored name describes the image (from nameHint, else the original file name) plus a short
// random suffix so two uploads never collide, e.g. posts/building-ai-dost-cover-x7k2.webp
export async function uploadImage(original, folder = 'uploads', nameHint = '') {
  const file = await toWebp(original)
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const base = slugify(nameHint) || slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const path = `${folder}/${base}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

export function ImageInput({ value, onChange, folder, nameHint }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadImage(file, folder, nameHint))
      toast('Image uploaded')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-tech-dark border border-white/10 flex items-center justify-center">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5 text-gray-600" />}
      </div>
      <div className="flex-1 space-y-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload →" className={inputCls} />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <Button type="button" variant="ghost" loading={busy} onClick={() => fileRef.current?.click()} className="!py-1.5 text-xs">
          <ImagePlus className="w-3.5 h-3.5" /> Upload
        </Button>
      </div>
    </div>
  )
}

// Editable list of strings (features, tech stack, image URLs…)
export function ListInput({ value, onChange, placeholder, render }) {
  const update = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)))
  const remove = (i) => onChange(value.filter((_, j) => j !== i))
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            {render ? render(item, (v) => update(i, v)) : <input value={item} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} className={inputCls} />}
          </div>
          <button type="button" onClick={() => remove(i)} className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="flex items-center gap-1.5 text-xs font-semibold text-neon-blue hover:text-white">
        <Plus className="w-3.5 h-3.5" /> Add
      </button>
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-9 h-9 rounded-full border-2 border-neon-blue/20 border-t-neon-blue animate-spin" />
    </div>
  )
}

export function Empty({ children }) {
  return <div className="text-center text-gray-500 py-16 text-sm">{children}</div>
}

// ---------- Toasts ----------
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((text, type = 'success') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, text, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-white shadow-2xl min-w-[240px]"
            >
              {t.type === 'error' ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-neon-green" />}
              <span className="flex-1">{t.text}</span>
              <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
