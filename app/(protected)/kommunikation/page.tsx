'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import AccessDenied from '@/components/AccessDenied'
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  Users,
  ArrowLeft,
  Inbox,
  CheckCircle2,
  Circle,
  ChevronDown,
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
}

interface MessageItem {
  id: string
  subject: string
  body: string
  direction: 'OUTBOUND' | 'INBOUND'
  isRead: boolean
  createdAt: string
  client: { id: string; name: string; email: string }
  case?: { id: string; title: string } | null
  sender?: { name: string | null; email: string } | null
}

type View = 'inbox' | 'compose' | 'thread'

export default function KommunikationPage() {
  const [view, setView] = useState<View>('inbox')
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [caseId, setCaseId] = useState('')
  const [cases, setCases] = useState<{ id: string; title: string }[]>([])
  const [filterClientId, setFilterClientId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterClientId) params.set('clientId', filterClientId)
      if (searchQuery) params.set('q', searchQuery)
      const res = await fetch(`/api/kommunikation?${params}`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    const res = await fetch('/api/clients')
    const data = await res.json()
    if (Array.isArray(data)) setClients(data)
  }

  const fetchCases = async (clientId: string) => {
    if (!clientId) { setCases([]); return }
    const res = await fetch(`/api/cases?clientId=${clientId}`)
    const data = await res.json()
    if (Array.isArray(data)) setCases(data)
  }

  useEffect(() => {
    fetchMessages()
    fetchClients()
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data.user && !data.user.modules?.includes('kommunikation')) setAccessDenied(true) })
      .catch(err => { console.error('Failed to check module access:', err) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterClientId, searchQuery])

  useEffect(() => {
    fetchCases(selectedClientId)
  }, [selectedClientId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || !subject.trim() || !body.trim()) {
      setError('Fyll i klient, ämne och meddelande.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/kommunikation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          subject: subject.trim(),
          body: body.trim(),
          caseId: caseId || undefined,
        }),
      })
      if (res.ok) {
        setSuccessMsg('Meddelande skickat!')
        setSubject('')
        setBody('')
        setSelectedClientId('')
        setCaseId('')
        setTimeout(() => setSuccessMsg(''), 3000)
        setView('inbox')
        fetchMessages()
      } else {
        const d = await res.json()
        setError(d.error ?? 'Kunde inte skicka meddelande.')
      }
    } finally {
      setSending(false)
    }
  }

  const markRead = async (id: string) => {
    await fetch(`/api/kommunikation?id=${id}`, { method: 'PATCH' })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  const groupedByClient: Record<string, MessageItem[]> = {}
  messages.forEach(m => {
    const key = m.client.id
    if (!groupedByClient[key]) groupedByClient[key] = []
    groupedByClient[key].push(m)
  })

  if (accessDenied) return <AccessDenied moduleName="Klientkommunikation" />

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-cyan-400" />
              Klientkommunikation
              {unreadCount > 0 && (
                <span className="text-xs font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                  {unreadCount} olästa
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Skicka och hantera meddelanden till dina klienter.
            </p>
          </div>
          <button
            onClick={() => { setView('compose'); setError('') }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Nytt meddelande
          </button>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-5 py-3 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* ── COMPOSE VIEW ─────────────────────────────────────────────────── */}
        {view === 'compose' && (
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.08]">
              <button
                onClick={() => setView('inbox')}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-white">Nytt meddelande</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-5">
              {/* Client select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Klient *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    value={selectedClientId}
                    onChange={e => { setSelectedClientId(e.target.value); setCaseId('') }}
                    className="w-full pl-10 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                    required
                  >
                    <option value="">Välj klient…</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Case select (optional) */}
              {cases.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Kopplat ärende (valfritt)
                  </label>
                  <div className="relative">
                    <select
                      value={caseId}
                      onChange={e => setCaseId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none pr-8"
                    >
                      <option value="">Inget ärende valt</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ämne *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="t.ex. Uppdatering om ditt ärende"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Meddelande *
                </label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Skriv ditt meddelande här…"
                  rows={7}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-y min-h-[140px]"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 font-medium">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Skickar…' : 'Skicka meddelande'}
                </button>
                <button
                  type="button"
                  onClick={() => setView('inbox')}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── INBOX VIEW ───────────────────────────────────────────────────── */}
        {view === 'inbox' && (
          <>
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Sök ämne eller innehåll…"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={filterClientId}
                  onChange={e => setFilterClientId(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 appearance-none"
                >
                  <option value="">Alla klienter</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-24 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.08]">
                <Inbox className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg mb-1">Inga meddelanden ännu</p>
                <p className="text-slate-600 text-sm mb-6">
                  Skicka ditt första meddelande till en klient för att komma igång.
                </p>
                <button
                  onClick={() => setView('compose')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Nytt meddelande
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      m.isRead
                        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]'
                        : 'bg-cyan-500/[0.06] border-cyan-500/20 hover:bg-cyan-500/[0.1]'
                    }`}
                    onClick={() => { if (!m.isRead) markRead(m.id) }}
                  >
                    {/* Read/unread indicator */}
                    <div className="mt-0.5 flex-shrink-0">
                      {m.isRead
                        ? <CheckCircle2 className="w-4 h-4 text-slate-600" />
                        : <Circle className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className={`text-sm font-bold truncate ${m.isRead ? 'text-slate-300' : 'text-white'}`}>
                            {m.subject}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {m.direction === 'OUTBOUND' ? '→ ' : '← '}
                            <span className="text-slate-400">{m.client.name}</span>
                            {m.case && (
                              <span className="text-slate-600"> · {m.case.title}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              m.direction === 'OUTBOUND'
                                ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                                : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            }`}
                          >
                            {m.direction === 'OUTBOUND' ? 'Utgående' : 'Inkommande'}
                          </span>
                          <span className="text-xs text-slate-600 whitespace-nowrap">
                            {new Date(m.createdAt).toLocaleDateString('sv-SE', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {m.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </main>
  )
}
