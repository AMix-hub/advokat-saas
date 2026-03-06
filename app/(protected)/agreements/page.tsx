'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileSignature,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Archive,
  Briefcase,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Agreement = {
  id: string
  title: string
  type: string
  status: string
  content: string
  startDate: string
  endDate?: string | null
  version: number
  createdBy: { name: string; email: string }
  case?: { id: string; title: string } | null
  createdAt: string
}

type CaseOption = { id: string; title: string }

// ─── Label maps ──────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  CLIENT_AGREEMENT: 'Klientöverenskommelse',
  HOURLY_RATE:      'Timarvode',
  CONTINGENCY:      'Villkorat arvode',
  OTHER:            'Övrigt',
}

const TYPE_STYLE: Record<string, string> = {
  CLIENT_AGREEMENT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HOURLY_RATE:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CONTINGENCY:      'bg-violet-500/10 text-violet-400 border-violet-500/20',
  OTHER:            'bg-white/10 text-slate-300 border-white/[0.08]',
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ARCHIVED:    'bg-white/10 text-slate-400 border-white/[0.08]',
  SUPERSEDED:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE:     'Aktiv',
  ARCHIVED:   'Arkiverad',
  SUPERSEDED: 'Ersatt',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [cases, setCases] = useState<CaseOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    type: 'CLIENT_AGREEMENT',
    content: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    caseId: '',
  })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [agRes, caseRes] = await Promise.all([
        fetch('/api/agreements'),
        fetch('/api/cases'),
      ])
      if (agRes.ok) setAgreements(await agRes.json())
      if (caseRes.ok) {
        const d = await caseRes.json()
        setCases(Array.isArray(d) ? d : d.cases ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim() || !form.startDate) {
      setError('Titel, innehåll och startdatum är obligatoriska.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          endDate: form.endDate || null,
          caseId: form.caseId || null,
        }),
      })
      if (res.ok) {
        setForm({ title: '', type: 'CLIENT_AGREEMENT', content: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', caseId: '' })
        setShowForm(false)
        fetchAll()
      } else {
        const d = await res.json()
        setError(d.error || 'Kunde inte spara avtalet.')
      }
    } catch {
      setError('Nätverksfel – försök igen.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleArchive = async (id: string) => {
    await fetch(`/api/agreements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ARCHIVED' }),
    })
    fetchAll()
  }

  const active   = agreements.filter(a => a.status === 'ACTIVE')
  const archived = agreements.filter(a => a.status !== 'ACTIVE')

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Back ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1.5 transition bg-blue-500/10 px-3 py-2 rounded-lg text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </Link>
        </div>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Avtal</h1>
              <p className="text-slate-500 text-sm font-medium">
                Klientavtal, arvodesöverenskommelser och villkor
              </p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(v => !v); setError('') }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm text-sm"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Avbryt' : 'Nytt avtal'}
          </button>
        </div>

        {/* ── New agreement form ────────────────────────────────────────── */}
        {showForm && (
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-slate-100 mb-6">Skapa nytt avtal</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Titel *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="T.ex. Klientöverenskommelse — Klient AB"
                    className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm bg-white/[0.05] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Avtalstyp</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm bg-white/[0.05] text-white"
                  >
                    {Object.entries(TYPE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Startdatum *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm bg-white/[0.05] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Slutdatum</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm bg-white/[0.05] text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Koppla till ärende (valfritt)</label>
                  <select
                    name="caseId"
                    value={form.caseId}
                    onChange={handleChange}
                    className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm bg-white/[0.05] text-white"
                  >
                    <option value="">— Inget ärende —</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1.5">Avtalsinnehåll *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Skriv avtalstext här. T.ex. uppdragsbeskrivning, arvodesnivå, betalningsvillkor…"
                  className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-sm resize-y font-mono bg-white/[0.05] text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-sm text-sm disabled:opacity-60"
                >
                  {submitting ? 'Sparar...' : 'Spara avtal'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/[0.05] transition text-sm"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Active agreements ─────────────────────────────────────────── */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Aktiva avtal
            <span className="ml-auto text-sm font-bold text-slate-400">{active.length} st</span>
          </h2>

          {loading ? (
            <div className="text-slate-400 text-sm py-4">Hämtar avtal…</div>
          ) : active.length === 0 ? (
            <div className="text-center py-10 bg-white/[0.04] rounded-xl border border-dashed border-white/[0.08]">
              <FileSignature className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium text-sm">Inga aktiva avtal ännu.</p>
              <p className="text-slate-400 text-xs mt-1">Klicka på "Nytt avtal" för att komma igång.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {active.map(ag => (
                <AgreementRow
                  key={ag.id}
                  ag={ag}
                  expanded={expandedId === ag.id}
                  onToggle={() => setExpandedId(id => id === ag.id ? null : ag.id)}
                  onArchive={() => handleArchive(ag.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Archived ─────────────────────────────────────────────────── */}
        {archived.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
              <Archive className="w-5 h-5 text-slate-400" />
              Arkiverade / Ersatta
              <span className="ml-auto text-sm font-bold text-slate-400">{archived.length} st</span>
            </h2>
            <div className="divide-y divide-white/[0.06] opacity-70">
              {archived.map(ag => (
                <AgreementRow
                  key={ag.id}
                  ag={ag}
                  expanded={expandedId === ag.id}
                  onToggle={() => setExpandedId(id => id === ag.id ? null : ag.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ─── Row component ────────────────────────────────────────────────────────────

function AgreementRow({
  ag,
  expanded,
  onToggle,
  onArchive,
}: {
  ag: Agreement
  expanded: boolean
  onToggle: () => void
  onArchive?: () => void
}) {
  return (
    <div className="py-4">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 cursor-pointer hover:bg-white/[0.04] -mx-2 px-2 py-1 rounded-xl transition"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-white text-sm">{ag.title}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${TYPE_STYLE[ag.type] ?? TYPE_STYLE.OTHER}`}>
              {TYPE_LABEL[ag.type] ?? ag.type}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[ag.status] ?? ''}`}>
              {STATUS_LABEL[ag.status] ?? ag.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{ag.createdBy.name}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(ag.startDate).toLocaleDateString('sv-SE')}{ag.endDate && ` → ${new Date(ag.endDate).toLocaleDateString('sv-SE')}`}</span>
            {ag.case && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <Link href={`/cases/${ag.case.id}`} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                  {ag.case.title}
                </Link>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onArchive && ag.status === 'ACTIVE' && (
            <button
              onClick={e => { e.stopPropagation(); onArchive() }}
              className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-white/[0.08] rounded-lg transition"
              title="Arkivera"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 mx-2 p-4 bg-white/[0.04] rounded-xl border border-white/[0.06]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avtalsinnehåll</p>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {ag.content}
          </pre>
          <p className="text-[11px] text-slate-400 mt-3">Version {ag.version} · Skapad {new Date(ag.createdAt).toLocaleDateString('sv-SE')}</p>
        </div>
      )}
    </div>
  )
}
