import { useEffect, useState } from 'react'
import { Mail, MailOpen, Reply, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button, Card, Empty, Spinner, useToast } from './ui'

const when = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function Messages() {
  const [messages, setMessages] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [filter, setFilter] = useState('all')
  const toast = useToast()

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast(error.message, 'error')
        setMessages(data || [])
      })
  }, [])

  const setRead = async (m, read) => {
    setMessages((x) => x.map((y) => (y.id === m.id ? { ...y, read } : y)))
    const { error } = await supabase.from('messages').update({ read }).eq('id', m.id)
    if (error) toast(error.message, 'error')
  }

  const open = (m) => {
    setOpenId(openId === m.id ? null : m.id)
    if (!m.read) setRead(m, true)
  }

  const remove = async (m) => {
    if (!confirm(`Delete message from ${m.name}?`)) return
    const { error } = await supabase.from('messages').delete().eq('id', m.id)
    if (error) return toast(error.message, 'error')
    setMessages((x) => x.filter((y) => y.id !== m.id))
    toast('Message deleted')
  }

  if (!messages) return <Spinner />
  const unread = messages.filter((m) => !m.read).length
  const shown = filter === 'unread' ? messages.filter((m) => !m.read) : messages

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[
          ['all', `All (${messages.length})`],
          ['unread', `Unread (${unread})`],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === k ? 'bg-neon-blue text-tech-dark' : 'glass text-gray-300 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {shown.length === 0 ? (
          <Empty>{filter === 'unread' ? 'All caught up 🎉' : 'No messages yet. They will appear here when someone uses your contact form.'}</Empty>
        ) : (
          <div className="divide-y divide-white/5">
            {shown.map((m) => (
              <div key={m.id} className={m.read ? '' : 'bg-neon-blue/[0.03]'}>
                <button onClick={() => open(m)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02]">
                  {m.read ? <MailOpen className="w-5 h-5 text-gray-600 shrink-0" /> : <Mail className="w-5 h-5 text-neon-blue shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${m.read ? 'text-gray-300' : 'text-white font-semibold'}`}>
                      {m.name} <span className="text-gray-500 font-normal text-sm">· {m.email}</span>
                    </p>
                    <p className="text-sm text-gray-500 truncate">{m.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{when(m.created_at)}</span>
                </button>
                {openId === m.id && (
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-light-gray whitespace-pre-wrap leading-relaxed mb-4">{m.message}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-neon-blue text-tech-dark hover:bg-white transition-colors"
                      >
                        <Reply className="w-4 h-4" /> Reply by email
                      </a>
                      <Button type="button" variant="ghost" onClick={() => setRead(m, false)}>
                        Mark unread
                      </Button>
                      <Button type="button" variant="danger" onClick={() => remove(m)}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
