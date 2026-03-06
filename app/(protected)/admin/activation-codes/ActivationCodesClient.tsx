'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  KeyRound, Plus, Trash2, ToggleLeft, ToggleRight,
  Copy, CheckCircle2, RefreshCw, Infinity, Clock, AlertTriangle,
} from 'lucide-react'

interface ActivationCode {
  id: string
  code: string
  description: string | null
  maxUses: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function ActivationCodesClient() {
  const [codes, setCodes] = useState<ActivationCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [newCode, setNewCode] = useState(randomCode())
  const [newDescription, setNewDescription] = useState('')
  const [newMaxUses, setNewMaxUses] = useState('1')
  const [newExpiresAt, setNewExpiresAt] = useState('')
  const [formError, setFormError] = useState('')

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/activation-codes')
      const data = await res.json()
      setCodes(data.codes || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCodes() }, [fetchCodes])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setCreating(true)
    try {
      const res = await fetch('/api/admin/activation-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          description: newDescription,
          maxUses: newMaxUses === '-1' ? -1 : parseInt(newMaxUses) || 1,
          expiresAt: newExpiresAt || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Något gick fel.')
      } else {
        setCodes(prev => [data.code, ...prev])
        setNewCode(randomCode())
        setNewDescription('')
        setNewMaxUses('1')
        setNewExpiresAt('')
      }
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (code: ActivationCode) => {
    const updated = { ...code, isActive: !code.isActive }
    setCodes(prev => prev.map(c => c.id === code.id ? updated : c))
    await fetch(`/api/admin/activation-codes/${code.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !code.isActive }),
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna kod?')) return
    setCodes(prev => prev.filter(c => c.id !== id))
    await fetch(`/api/admin/activation-codes/${id}`, { method: 'DELETE' })
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isExpired = (expiresAt: string | null) =>
    expiresAt ? new Date(expiresAt) < new Date() : false

  const isExhausted = (code: ActivationCode) =>
    code.maxUses !== -1 && code.usedCount >= code.maxUses

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Åtkomstkoder</h1>
              <p className="text-slate-500 text-sm">Hantera aktiveringskoder för nyregistrering</p>
            </div>
          </div>
          <button
            onClick={fetchCodes}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] rounded-lg transition"
            title="Uppdatera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Create new code form */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" /> Skapa ny åtkomstkod
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Kod</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value.toUpperCase())}
                    placeholder="T.ex. ADVOKAT2025"
                    className="flex-1 border border-white/10 p-2.5 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white uppercase"
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setNewCode(randomCode())}
                    className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.15] text-slate-400 rounded-xl text-xs font-bold transition border border-white/10"
                    title="Slumpa ny kod"
                  >
                    Slumpa
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Beskrivning (valfri)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="T.ex. för Testbyrån AB"
                  className="w-full border border-white/10 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Max antal användningar</label>
                <select
                  value={newMaxUses}
                  onChange={e => setNewMaxUses(e.target.value)}
                  className="w-full border border-white/10 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white"
                >
                  <option value="1">1 gång (engångskod)</option>
                  <option value="3">3 gånger</option>
                  <option value="5">5 gånger</option>
                  <option value="10">10 gånger</option>
                  <option value="50">50 gånger</option>
                  <option value="-1">Obegränsat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Utgångsdatum (valfritt)</label>
                <input
                  type="date"
                  value={newExpiresAt}
                  onChange={e => setNewExpiresAt(e.target.value)}
                  className="w-full border border-white/10 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> {creating ? 'Skapar...' : 'Skapa kod'}
              </button>
            </div>
          </form>
        </div>

        {/* Codes list */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-bold text-white">Aktiva koder ({codes.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Laddar...</div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center">
              <KeyRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">Inga koder skapade ännu.</p>
              <p className="text-slate-400 text-xs mt-1">
                Observera: miljövariabeln <code className="bg-white/[0.08] px-1 rounded text-xs">INVITE_CODE</code> fungerar fortfarande som reservkod.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {codes.map(code => {
                const expired = isExpired(code.expiresAt)
                const exhausted = isExhausted(code)
                const effective = code.isActive && !expired && !exhausted

                return (
                  <div key={code.id} className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${!effective ? 'opacity-60' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</span>
                        <button
                          onClick={() => handleCopy(code.code, code.id)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition"
                          title="Kopiera kod"
                        >
                          {copiedId === code.id
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {effective
                          ? <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Aktiv</span>
                          : !code.isActive
                            ? <span className="text-[10px] font-bold bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">Inaktiverad</span>
                            : expired
                              ? <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Utgången</span>
                              : <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Uppbrukad</span>}
                      </div>
                      {code.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{code.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          {code.maxUses === -1
                            ? <><Infinity className="w-3 h-3" /> Obegränsat</>
                            : <><Clock className="w-3 h-3" /> {code.usedCount}/{code.maxUses} använd{code.usedCount !== 1 ? 'a' : ''}</>}
                        </span>
                        {code.expiresAt && (
                          <span className={`flex items-center gap-1 ${expired ? 'text-red-500' : ''}`}>
                            <AlertTriangle className="w-3 h-3" />
                            Utgår {new Date(code.expiresAt).toLocaleDateString('sv-SE')}
                          </span>
                        )}
                        <span>Skapad {new Date(code.createdAt).toLocaleDateString('sv-SE')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggle(code)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          code.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-white/10 text-slate-400 hover:bg-white/[0.15]'
                        }`}
                        title={code.isActive ? 'Inaktivera' : 'Aktivera'}
                      >
                        {code.isActive
                          ? <><ToggleRight className="w-4 h-4" /> På</>
                          : <><ToggleLeft className="w-4 h-4" /> Av</>}
                      </button>
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Ta bort"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-400">
          <p className="font-bold mb-1">Hur fungerar åtkomstkoderna?</p>
          <ul className="space-y-1 text-xs list-disc list-inside text-blue-400">
            <li>Varje kod kan begränsas till ett antal användningar eller sättas som obegränsad.</li>
            <li>Du kan sätta ett utgångsdatum för att automatiskt spärra koden efter ett datum.</li>
            <li>Inaktivera en kod tillfälligt utan att ta bort den.</li>
            <li>
              Miljövariabeln <code className="bg-blue-500/20 px-1 rounded">INVITE_CODE</code> fungerar
              fortfarande som reservkod om inga databaskoder matchar.
            </li>
            <li>
              Dela en länk som förifyllar koden automatiskt:{' '}
              <code className="bg-blue-500/20 px-1 rounded">/register?code=KOD</code>
            </li>
          </ul>
        </div>

      </div>
    </main>
  )
}
