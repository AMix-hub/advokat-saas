'use client'

import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Image as ImageIcon, CheckCircle2,
  Plug, Eye, EyeOff, Save, RefreshCw, ExternalLink,
} from 'lucide-react'

interface Integration {
  id: string
  service: string
  isEnabled: boolean
  apiKey: string | null
  clientId: string | null
  updatedAt: string
}

const SERVICE_META: Record<string, {
  label: string
  color: string
  bg: string
  border: string
  description: string
  docsUrl: string
}> = {
  visma: {
    label: 'Visma',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    description: 'Synkronisera fakturor och klientdata med Visma eEkonomi.',
    docsUrl: 'https://developer.visma.com/',
  },
  fortnox: {
    label: 'Fortnox',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Exportera fakturor, klienter och tidrapporter till Fortnox.',
    docsUrl: 'https://developer.fortnox.se/',
  },
}

function IntegrationCard({
  service,
  integration,
  onSave,
}: {
  service: string
  integration?: Integration
  onSave: (service: string, data: { apiKey?: string; clientId?: string; isEnabled: boolean }) => Promise<void>
}) {
  const meta = SERVICE_META[service]
  const [isEnabled, setIsEnabled] = useState(integration?.isEnabled ?? false)
  const [clientId, setClientId] = useState(integration?.clientId ?? '')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(service, {
        isEnabled,
        clientId: clientId || undefined,
        apiKey: apiKey || undefined,
      })
      setSaved(true)
      setApiKey('')
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`bg-white/[0.03] rounded-2xl border ${meta.border} overflow-hidden`}>
      <div className={`px-5 py-3.5 border-b ${meta.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${meta.bg} rounded-xl flex items-center justify-center`}>
            <Plug className={`w-3.5 h-3.5 ${meta.color}`} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{meta.label}</h4>
            <p className="text-xs text-slate-500">{meta.description}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEnabled(v => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
          title={isEnabled ? 'Inaktivera' : 'Aktivera'}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Klient-ID</label>
          <input
            type="text"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            placeholder={`Ditt ${meta.label} klient-ID`}
            className="w-full bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-600"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">API-nyckel</label>
            {integration?.apiKey && (
              <span className="text-[11px] text-slate-500 font-mono">
                Nuvarande: <span className="text-slate-400">{integration.apiKey}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={integration?.apiKey ? 'Ange ny nyckel för att ersätta' : 'Klistra in din API-nyckel'}
              className="w-full bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-3 py-2 pr-9 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <a
            href={meta.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <ExternalLink className="w-3 h-3" /> API-dokumentation
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
              saved
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10'
            } disabled:opacity-50`}
          >
            {saving
              ? <><RefreshCw className="w-3 h-3 animate-spin" /> Sparar...</>
              : saved
              ? <><CheckCircle2 className="w-3 h-3" /> Sparat!</>
              : <><Save className="w-3 h-3" /> Spara</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [firmName, setFirmName] = useState('')
  const [bankgiro, setBankgiro] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const [integrations, setIntegrations] = useState<Integration[]>([])

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.user) {
        setName(data.user.name || '')
        setFirmName(data.user.firmName || '')
        setBankgiro(data.user.bankgiro || '')
        setLogo(data.user.logo || null)
      }
    })
    fetch('/api/integrations').then(res => res.json()).then(data => {
      setIntegrations(data.integrations || [])
    })
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ name, firmName, bankgiro, logo })
    })

    setIsSubmitting(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleIntegrationSave = async (
    service: string,
    data: { apiKey?: string; clientId?: string; isEnabled: boolean },
  ) => {
    const res = await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, ...data }),
    })
    if (res.ok) {
      const json = await res.json()
      setIntegrations(prev => {
        const exists = prev.find(i => i.service === service)
        if (exists) return prev.map(i => i.service === service ? { ...i, ...json.integration } : i)
        return [...prev, json.integration]
      })
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-white/[0.06] pb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md">
              <SettingsIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Inställningar</h1>
              <p className="text-slate-400 font-medium">Byråprofil och White Labeling</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">

            {/* LOGOTYP / WHITE LABEL */}
            <div className="bg-white/[0.04] p-6 rounded-2xl border border-white/[0.08]">
              <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" /> Byråns Logotyp
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-white/[0.05] rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                  ) : (
                    <span className="text-slate-400 text-sm font-medium text-center px-2">Ingen logga</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-4">Ladda upp byråns logotyp. Denna kommer automatiskt att ersätta CaseCore-ikonen på Klientportaler och PDF-fakturor.</p>
                  <label className="cursor-pointer bg-white/[0.08] border border-white/10 text-slate-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/[0.12] transition inline-block">
                    Välj bildfil...
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {logo && (
                    <button type="button" onClick={() => setLogo(null)} className="ml-3 text-red-600 text-sm font-bold hover:underline">Ta bort logga</button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Ditt Namn</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Byråns Namn</label>
                <input type="text" value={firmName} onChange={(e) => setFirmName(e.target.value)} required className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-400 mb-2">Betalningsuppgifter (Bankgiro/Plusgiro)</label>
                <input type="text" value={bankgiro} onChange={(e) => setBankgiro(e.target.value)} placeholder="T.ex. BG 123-4567" className="w-full border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white" />
                <p className="text-xs text-slate-500 mt-2">Dessa uppgifter syns längst ner på fakturaunderlagen.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center">
                {isSubmitting ? 'Sparar...' : 'Spara inställningar'}
              </button>
              {saved && <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse"><CheckCircle2 className="w-5 h-5" /> Sparat!</span>}
            </div>

          </form>
        </div>

        {/* INTEGRATIONER */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="w-10 h-10 bg-white/[0.06] rounded-xl flex items-center justify-center">
              <Plug className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Integrationer</h2>
              <p className="text-slate-500 text-sm">Koppla din byrå mot Visma och Fortnox med dina egna uppgifter</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-sm text-amber-400 mb-5">
            <p className="font-bold mb-0.5">Status: Under utveckling</p>
            <p className="text-xs opacity-80">
              Ange din byrås egna API-uppgifter för Visma eller Fortnox. Automatisk synkronisering aktiveras i kommande versioner.
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(SERVICE_META).map(service => (
              <IntegrationCard
                key={service}
                service={service}
                integration={integrations.find(i => i.service === service)}
                onSave={handleIntegrationSave}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
