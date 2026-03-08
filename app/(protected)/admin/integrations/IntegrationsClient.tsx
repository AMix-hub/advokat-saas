'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plug, AlertTriangle, CheckCircle2, RefreshCw,
  Eye, EyeOff, Save, ExternalLink,
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
  fields: { key: string; label: string; placeholder: string; isSecret?: boolean }[]
}> = {
  visma: {
    label: 'Visma',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    description: 'Synkronisera fakturor och klientdata med Visma eEkonomi eller Visma Administration.',
    docsUrl: 'https://developer.visma.com/',
    fields: [
      { key: 'clientId', label: 'Klient-ID',  placeholder: 'Visma OAuth-klient-ID' },
      { key: 'apiKey',   label: 'API-nyckel', placeholder: '••••••••••••••••', isSecret: true },
    ],
  },
  fortnox: {
    label: 'Fortnox',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Exportera fakturor, klienter och tidrapporter direkt till Fortnox.',
    docsUrl: 'https://developer.fortnox.se/',
    fields: [
      { key: 'clientId', label: 'Klient-ID',     placeholder: 'Fortnox klient-ID' },
      { key: 'apiKey',   label: 'Åtkomstnyckel', placeholder: '••••••••••••••••', isSecret: true },
    ],
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
    <div className={`bg-slate-900 rounded-2xl border ${meta.border} overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${meta.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${meta.bg} rounded-xl flex items-center justify-center`}>
            <Plug className={`w-4 h-4 ${meta.color}`} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{meta.label}</h3>
            <p className="text-xs text-slate-500">{meta.description}</p>
          </div>
        </div>
        {/* Enable toggle */}
        <button
          onClick={() => setIsEnabled(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
          title={isEnabled ? 'Inaktivera' : 'Aktivera'}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          {integration?.isEnabled ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aktiverad
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
              Ej konfigurerad
            </span>
          )}
          {integration?.updatedAt && (
            <span className="text-[11px] text-slate-600">
              Uppdaterad {new Date(integration.updatedAt).toLocaleDateString('sv-SE')}
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {/* Client ID */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Klient-ID</label>
            <input
              type="text"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder={meta.fields.find(f => f.key === 'clientId')?.placeholder ?? ''}
              className="w-full bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-600"
            />
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">API-nyckel</label>
              {integration?.apiKey && (
                <span className="text-[11px] text-slate-500 font-mono">
                  Nuvarande: <span className="text-slate-400">{integration.apiKey}</span>
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={integration?.apiKey ? 'Ange ny nyckel för att ersätta befintlig' : 'Klistra in API-nyckel'}
                  className="w-full bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 pr-9 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Docs link + Save */}
        <div className="flex items-center justify-between pt-1">
          <a
            href={meta.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> API-dokumentation
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              saved
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10'
            } disabled:opacity-50`}
          >
            {saving
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sparar...</>
              : saved
              ? <><CheckCircle2 className="w-3.5 h-3.5" /> Sparat!</>
              : <><Save className="w-3.5 h-3.5" /> Spara</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsClient() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  const fetchIntegrations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/integrations')
      if (res.status === 403) { setAccessDenied(true); return }
      const data = await res.json()
      setIntegrations(data.integrations || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchIntegrations() }, [fetchIntegrations])

  const handleSave = async (
    service: string,
    data: { apiKey?: string; clientId?: string; isEnabled: boolean },
  ) => {
    const res = await fetch('/api/admin/integrations', {
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

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Åtkomst nekad</h1>
        <p className="text-slate-400 text-center">Du har inte behörighet att se den här sidan.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/[0.08] text-white rounded-xl flex items-center justify-center">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Integrationer</h1>
            <p className="text-slate-500 text-sm">Koppla CaseCore mot Visma och Fortnox</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-400">
          <p className="font-bold mb-1">Status: Under utveckling</p>
          <p className="text-xs opacity-80">
            Integrationerna mot Visma och Fortnox är förberedda i systemet. Konfigurera dina API-nycklar nedan.
            Automatisk synkronisering av fakturor och klientdata aktiveras i kommande versioner.
          </p>
        </div>

        {/* Integration cards */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-56 bg-slate-900 rounded-2xl border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(SERVICE_META).map(service => (
              <IntegrationCard
                key={service}
                service={service}
                integration={integrations.find(i => i.service === service)}
                onSave={handleSave}
              />
            ))}
          </div>
        )}

        {/* Future roadmap */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-sm font-bold text-white mb-3">Planerade integrationer</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'Stripe (betalningar)',
              'BankID (e-signering)',
              'Outlook/Gmail (e-post)',
              'Bokio',
              'Kivra (digital post)',
              'Skatteverket API',
            ].map(name => (
              <div
                key={name}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-slate-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                {name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
