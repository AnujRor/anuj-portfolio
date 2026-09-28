import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button, Card, Field, inputCls, useToast } from './ui'

const MIN_LENGTH = 8

function PasswordInput({ value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} required autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} pr-11`} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-blue" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function Settings({ session }) {
  const email = session.user.email
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirmNext, setConfirmNext] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (next.length < MIN_LENGTH) return setError(`New password must be at least ${MIN_LENGTH} characters.`)
    if (next !== confirmNext) return setError('New password and confirm password do not match.')
    if (next === current) return setError('New password must be different from the old one.')

    setSaving(true)
    // Check the old password by signing in with it; only then change it
    const { error: wrong } = await supabase.auth.signInWithPassword({ email, password: current })
    if (wrong) {
      setSaving(false)
      return setError('Old password is wrong.')
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: next })
    setSaving(false)
    if (updateError) return setError(updateError.message)

    setCurrent('')
    setNext('')
    setConfirmNext('')
    toast('Password changed — use the new one next time you sign in')
  }

  return (
    <div className="max-w-lg">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <p className="font-semibold text-white">Change password</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <Field label="Old password">
            <PasswordInput value={current} onChange={setCurrent} autoComplete="current-password" />
          </Field>
          <Field label="New password" hint={`At least ${MIN_LENGTH} characters`}>
            <PasswordInput value={next} onChange={setNext} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput value={confirmNext} onChange={setConfirmNext} autoComplete="new-password" />
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" loading={saving} className="w-full">
            Change password
          </Button>
        </form>
      </Card>
    </div>
  )
}
