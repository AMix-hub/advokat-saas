'use client'

import { useState, useEffect } from 'react'
import AccessDenied from '@/components/AccessDenied'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronDown,
  Users,
  Download,
  Search,
  RefreshCw,
  Info,
  X,
  Save,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface KycRecord {
  id: string
  riskLevel: string
  pepChecked: boolean
  pepResult: boolean
  sanctionsChecked: boolean
  sanctionsResult: boolean
  idVerified: boolean
  sourceOfFunds: string | null
  notes: string | null
  reviewer: string | null
  reviewedAt: string | null
  expiresAt: string | null
  createdAt: string
}

interface ClientKyc {
  id: string
  name: string
  email: string
  orgNr: string | null
  kycCompleted: boolean
  pepStatus: boolean
  kycRecords: KycRecord[]
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

const RISK_COLORS: Record<RiskLevel | string, { bg: string; text: string; border: string; label: string }> = {
  LOW:    { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25', label: 'Låg risk' },
  MEDIUM: { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/25',   label: 'Medel risk' },
  HIGH:   { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/25',     label: 'Hög risk' },
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function kycStatus(client: ClientKyc): 'done' | 'partial' | 'none' {
  if (!client.kycRecords.length) return 'none'
  const r = client.kycRecords[0]
  if (r.pepChecked && r.sanctionsChecked && r.idVerified) return 'done'
  return 'partial'
}

function exportToCsv(clients: ClientKyc[]) {
  const rows = [
    ['Namn', 'E-post', 'Org.nr', 'KYC-status', 'Risknivå', 'PEP', 'Sanktioner', 'ID verifierat', 'Granskare', 'Granskat'],
    ...clients.map(c => {
      const r = c.kycRecords[0]
      return [
        c.name,
        c.email,
        c.orgNr ?? '',
        kycStatus(c) === 'done' ? 'Klar' : kycStatus(c) === 'partial' ? 'Påbörjad' : 'Ej påbörjad',
        r ? (RISK_COLORS[r.riskLevel]?.label ?? r.riskLevel) : '',
        r ? (r.pepChecked ? (r.pepResult ? 'Träff' : 'Ren') : 'Ej kontrollerad') : '',
        r ? (r.sanctionsChecked ? (r.sanctionsResult ? 'Träff' : 'Ren') : 'Ej kontrollerad') : '',
        r ? (r.idVerified ? 'Ja' : 'Nej') : '',
        r?.reviewer ?? '',
        r?.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString('sv-SE') : '',
      ]
    }),
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kyc-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function KycPage() {
  const [clients, setClients] = useState<ClientKyc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<ClientKyc | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  // Form state
  const [form, setForm] = useState({
    riskLevel: 'LOW' as RiskLevel,
    pepChecked: false,
    pepResult: false,
    sanctionsChecked: false,
    sanctionsResult: false,
    idVerified: false,
    sourceOfFunds: '',
    notes: '',
    expiresAt: '',
  })

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/kyc')
      const d = await res.json()
      if (Array.isArray(d)) setClients(d)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data.user && !data.user.modules?.includes('kyc')) setAccessDenied(true) })
      .catch(() => {})
  }, [])

  const openClient = (client: ClientKyc) => {
    const r = client.kycRecords[0]
    setForm({
      riskLevel: (r?.riskLevel as RiskLevel) ?? 'LOW',
      pepChecked: r?.pepChecked ?? false,
      pepResult: r?.pepResult ?? false,
      sanctionsChecked: r?.sanctionsChecked ?? false,
      sanctionsResult: r?.sanctionsResult ?? false,
      idVerified: r?.idVerified ?? false,
      sourceOfFunds: r?.sourceOfFunds ?? '',
      notes: r?.notes ?? '',
      expiresAt: r?.expiresAt ? new Date(r.expiresAt).toISOString().slice(0, 10) : '',
    })
    setSaveSuccess(false)
    setSaveError('')
    setSelectedClient(client)
  }

  const handleSave = async () => {
    if (!selectedClient) return
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClient.id, ...form }),
      })
      if (res.ok) {
        setSaveSuccess(true)
        await fetchClients()
        // Refresh selected client data
        const updated = (await fetch('/api/kyc').then(r => r.json())) as ClientKyc[]
        const refreshed = updated.find(c => c.id === selectedClient.id)
        if (refreshed) setSelectedClient(refreshed)
      } else {
        const d = await res.json()
        setSaveError(d.error ?? 'Kunde inte spara')
      }
    } finally {
      setSaving(false)
    }
  }

  // Filtered + searched client list
  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !(c.orgNr ?? '').toLowerCase().includes(q)) return false
    if (filterStatus) {
      const s = kycStatus(c)
      if (filterStatus === 'done' && s !== 'done') return false
      if (filterStatus === 'partial' && s !== 'partial') return false
      if (filterStatus === 'none' && s !== 'none') return false
    }
    if (filterRisk) {
      const r = c.kycRecords[0]
      if (!r || r.riskLevel !== filterRisk) return false
    }
    return true
  })

  // Stats
  const total = clients.length
  const done = clients.filter(c => kycStatus(c) === 'done').length
  const pending = clients.filter(c => kycStatus(c) === 'none').length
  const high = clients.filter(c => c.kycRecords[0]?.riskLevel === 'HIGH').length
  const medium = clients.filter(c => c.kycRecords[0]?.riskLevel === 'MEDIUM').length

  if (accessDenied) return <AccessDenied moduleName="CaseCore KYC" />

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              CaseCore KYC
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Hantera kundkännedom (KYC), PEP-kontroller och riskbedömningar för alla klienter.
            </p>
          </div>
          <button
            onClick={() => exportToCsv(clients)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm transition"
          >
            <Download className="w-4 h-4" />
            Exportera CSV (GDPR)
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl border border-white/[0.08] p-4 flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className="text-xl font-black text-white">{total}</p>
              <p className="text-xs text-slate-500 font-medium">Totalt klienter</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl border border-white/[0.08] p-4 flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
            <div>
              <p className="text-xl font-black text-white">{done}</p>
              <p className="text-xs text-slate-500 font-medium">KYC genomförd</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl border border-white/[0.08] p-4 flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg"><Circle className="w-4 h-4 text-amber-400" /></div>
            <div>
              <p className="text-xl font-black text-white">{pending}</p>
              <p className="text-xs text-slate-500 font-medium">Ej påbörjad</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl border border-white/[0.08] p-4 flex items-start gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-400" /></div>
            <div>
              <p className="text-xl font-black text-white">{high + medium}</p>
              <p className="text-xs text-slate-500 font-medium">Förhöjd risk</p>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${selectedClient ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'}`}>

          {/* Client table */}
          <div className={`${selectedClient ? 'xl:col-span-3' : ''} bg-slate-900 rounded-2xl border border-white/[0.08]`}>

            {/* Filters */}
            <div className="p-4 border-b border-white/[0.06] flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-44">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Sök klient…"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="pl-3 pr-7 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none appearance-none"
                >
                  <option value="">Alla statusar</option>
                  <option value="done">KYC klar</option>
                  <option value="partial">Påbörjad</option>
                  <option value="none">Ej påbörjad</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="pl-3 pr-7 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none appearance-none"
                >
                  <option value="">Alla risknivåer</option>
                  <option value="HIGH">Hög risk</option>
                  <option value="MEDIUM">Medel risk</option>
                  <option value="LOW">Låg risk</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <button onClick={fetchClients} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition" title="Uppdatera">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <ShieldCheck className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Inga klienter matchar filtret.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Klient</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">KYC-status</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risknivå</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Granskat</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => {
                      const status = kycStatus(c)
                      const r = c.kycRecords[0]
                      const risk = r ? RISK_COLORS[r.riskLevel] : null
                      const isSelected = selectedClient?.id === c.id
                      return (
                        <tr
                          key={c.id}
                          onClick={() => openClient(c)}
                          className={`border-b border-white/[0.04] cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-500/10' : 'hover:bg-white/[0.04]'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <p className="text-sm font-bold text-white">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.email}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            {status === 'done' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Klar
                              </span>
                            )}
                            {status === 'partial' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                                <Info className="w-3 h-3" /> Påbörjad
                              </span>
                            )}
                            {status === 'none' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                                <Circle className="w-3 h-3" /> Ej påbörjad
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {risk ? (
                              <span className={`inline-block text-xs font-bold ${risk.bg} ${risk.text} ${risk.border} border px-2.5 py-1 rounded-full`}>
                                {risk.label}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 hidden sm:table-cell">
                            <span className="text-xs text-slate-500">
                              {r?.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString('sv-SE') : '—'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">
                              {isSelected ? 'Öppen' : 'Bedöm'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assessment panel */}
          {selectedClient && (
            <div className="xl:col-span-2 bg-slate-900 rounded-2xl border border-blue-500/20 p-6 h-fit">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedClient.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedClient.email}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">

                {/* Risk level */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Risknivå</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH'] as RiskLevel[]).map(level => {
                      const c = RISK_COLORS[level]
                      const active = form.riskLevel === level
                      return (
                        <button
                          key={level}
                          onClick={() => setForm(f => ({ ...f, riskLevel: level }))}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                            active ? `${c.bg} ${c.text} ${c.border}` : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kontroller</label>
                  <div className="space-y-3">
                    {[
                      { key: 'pepChecked', resultKey: 'pepResult', label: 'PEP-kontroll', sub: 'Politiskt exponerad person' },
                      { key: 'sanctionsChecked', resultKey: 'sanctionsResult', label: 'Sanktionslistscreening', sub: 'EU & internationella listor' },
                      { key: 'idVerified', resultKey: null, label: 'ID-verifiering', sub: 'Legitimation kontrollerad' },
                    ].map(({ key, resultKey, label, sub }) => {
                      const checked = form[key as keyof typeof form] as boolean
                      const hasResult = resultKey !== null
                      const result = hasResult ? (form[resultKey as keyof typeof form] as boolean) : false
                      return (
                        <div key={key} className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setForm(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                  checked ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </button>
                              <div>
                                <p className="text-sm font-bold text-white">{label}</p>
                                <p className="text-xs text-slate-500">{sub}</p>
                              </div>
                            </div>
                            {hasResult && checked && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500">Träff:</span>
                                <button
                                  onClick={() => setForm(f => ({ ...f, [resultKey!]: !f[resultKey! as keyof typeof f] }))}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-full border transition ${
                                    result
                                      ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  }`}
                                >
                                  {result ? 'Ja' : 'Nej'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Source of funds */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medlens ursprung</label>
                  <input
                    type="text"
                    value={form.sourceOfFunds}
                    onChange={e => setForm(f => ({ ...f, sourceOfFunds: e.target.value }))}
                    placeholder="ex. Inkomst från tjänst, försäljning…"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Anteckningar</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Övriga noteringar om klienten eller bedömningen…"
                    rows={3}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-y"
                  />
                </div>

                {/* Expiry date */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">KYC-utgångsdatum (valfritt)</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {saveError && <p className="text-sm text-red-400 font-medium">{saveError}</p>}
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4" />
                    KYC-bedömning sparad!
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-sm transition"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Sparar…' : 'Spara KYC-bedömning'}
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
