'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  KeyRound, Plus, Trash2, ToggleLeft, ToggleRight,
  Copy, CheckCircle2, RefreshCw, Infinity, Clock, AlertTriangle,
  Building2, User,
} from 'lucide-react'

interface ActivationCode {
  id: string
  code: string
  description: string | null
  licenseType: string
  maxUses: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

type TabType = 'ALLA' | 'SOLO' | 'BYRA'

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function LicenserClient() {
  const [codes, setCodes] = useState<ActivationCode[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('ALLA')

  const [newCode, setNewCode] = useState(randomCode())
  const [newDescription, setNewDescription] = useState('')
  const [newLicenseType, setNewLicenseType] = useState<'SOLO' | 'BYRA'>('SOLO')
  const [newMaxUses, setNewMaxUses] = useState('1')
  const [newExpiresAt, setNewExpiresAt] = useState('')
  const [formError, setFormError] = useState('')

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/activation-codes')
      if (res.status === 403) {
        setAccessDenied(true)
        return
      }
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
          licenseType: newLicenseType,
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
        setNewLicenseType('SOLO')
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
    if (!confirm('Är du säker på att du vill ta bort denna licens?')) return
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

  const filteredCodes = codes.filter(c =>
    activeTab === 'ALLA' || c.licenseType === activeTab
  )

  const soloCnt = codes.filter(c => c.licenseType === 'SOLO').length
  const byraCnt = codes.filter(c => c.licenseType === 'BYRA').length

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'ALLA',  label: 'Alla',  count: codes.length },
    { key: 'SOLO',  label: 'Solo',  count: soloCnt },
    { key: 'BYRA',  label: 'Byrå',  count: byraCnt },
  ]

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {accessDenied ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Åtkomst nekad</h1>
            <p className="text-slate-400 text-center">Du har inte behörighet att se den här sidan. Kontakta en administratör.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/[0.08] text-white rounded-xl flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Licenser</h1>
                  <p className="text-slate-500 text-sm">Skapa och hantera licensnycklar för Solo och Byrå</p>
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

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{soloCnt}</p>
                  <p className="text-xs text-slate-500 font-semibold">Solo-licenser</p>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{byraCnt}</p>
                  <p className="text-xs text-slate-500 font-semibold">Byrå-licenser</p>
                </div>
              </div>
            </div>

            {/* Create new license form */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Skapa ny licens
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {formError}
                  </div>
                )}

                {/* License type selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Licenstyp</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setNewLicenseType('SOLO')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition ${
                        newLicenseType === 'SOLO'
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      <User className="w-4 h-4" /> Solo (799 kr/mån)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLicenseType('BYRA')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition ${
                        newLicenseType === 'BYRA'
                          ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" /> Byrå (2 299 kr/mån)
                    </button>
                  </div>
                </div>

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
                    className="bg-white/[0.08] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/[0.12] transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> {creating ? 'Skapar...' : 'Skapa licens'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition ${
                    activeTab === tab.key
                      ? 'bg-white/[0.1] text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                    activeTab === tab.key ? 'bg-white/[0.15] text-slate-300' : 'bg-white/[0.06] text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Codes list */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm">Laddar...</div>
              ) : filteredCodes.length === 0 ? (
                <div className="p-8 text-center">
                  <KeyRound className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-medium">Inga licenser skapade ännu.</p>
                  {codes.length === 0 && (
                    <p className="text-slate-500 text-xs mt-1">
                      Miljövariabeln <code className="bg-white/[0.08] px-1 rounded text-xs">INVITE_CODE</code> fungerar fortfarande som reservkod.
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {filteredCodes.map(code => {
                    const expired = isExpired(code.expiresAt)
                    const exhausted = isExhausted(code)
                    const effective = code.isActive && !expired && !exhausted
                    const isByra = code.licenseType === 'BYRA'

                    return (
                      <div key={code.id} className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${!effective ? 'opacity-60' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* License type badge */}
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isByra
                                ? 'bg-violet-500/20 text-violet-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {isByra ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {isByra ? 'Byrå' : 'Solo'}
                            </span>
                            <span className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</span>
                            <button
                              onClick={() => handleCopy(code.code, code.id)}
                              className="p-1 text-slate-400 hover:text-blue-400 transition"
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
              <p className="font-bold mb-1">Hur fungerar licenserna?</p>
              <ul className="space-y-1 text-xs list-disc list-inside text-blue-400">
                <li><strong>Solo</strong> – för enskilda advokater (799 kr/mån). En användare per licens.</li>
                <li><strong>Byrå</strong> – för advokatbyråer (2 299 kr/mån). Upp till 10 användare per licens.</li>
                <li>Varje kod kan begränsas till ett antal användningar eller sättas som obegränsad.</li>
                <li>Du kan sätta ett utgångsdatum för att automatiskt spärra koden efter ett datum.</li>
                <li>
                  Dela en länk som förifyllar koden automatiskt:{' '}
                  <code className="bg-blue-500/20 px-1 rounded">/register?code=KOD</code>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
