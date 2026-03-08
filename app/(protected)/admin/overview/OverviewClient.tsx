'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Building2, User, BarChart3, FileText,
  RefreshCw, AlertTriangle, Shield, ShieldOff,
  CheckCircle2, Clock, Zap, KeyRound,
} from 'lucide-react'

interface StakeholderUser {
  id: string
  name: string | null
  email: string
  firmName: string | null
  isAdmin: boolean
  licenseType: string
  modules: string[]
  createdAt: string
  _count: { cases: number; createdClients: number }
}

interface Stats {
  totalUsers: number
  totalCases: number
  totalClients: number
  activeCodeCount: number
  soloUsers: number
  byraUsers: number
  trialUsers: number
}

type LicenseFilter = 'ALL' | 'SOLO' | 'BYRA' | 'TRIAL'

const LICENSE_COLORS: Record<string, string> = {
  SOLO:  'bg-blue-500/15 border-blue-500/25 text-blue-300',
  BYRA:  'bg-violet-500/15 border-violet-500/25 text-violet-300',
  TRIAL: 'bg-amber-500/15 border-amber-500/25 text-amber-300',
}

const LICENSE_LABELS: Record<string, string> = {
  SOLO:  'Solo',
  BYRA:  'Byrå',
  TRIAL: 'Trial',
}

export default function OverviewClient() {
  const [users, setUsers] = useState<StakeholderUser[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<LicenseFilter>('ALL')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/overview')
      if (res.status === 403) { setAccessDenied(true); return }
      const data = await res.json()
      setStats(data.stats)
      setUsers(data.users || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const updateLicense = async (userId: string, licenseType: string) => {
    setSaving(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseType }),
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data.user } : u))
        if (stats) {
          setStats({
            ...stats,
            soloUsers: users.filter(u => (u.id === userId ? licenseType : u.licenseType) === 'SOLO').length,
            byraUsers: users.filter(u => (u.id === userId ? licenseType : u.licenseType) === 'BYRA').length,
            trialUsers: users.filter(u => (u.id === userId ? licenseType : u.licenseType) === 'TRIAL').length,
          })
        }
      }
    } finally {
      setSaving(null)
    }
  }

  const filteredUsers = filter === 'ALL' ? users : users.filter(u => u.licenseType === filter)

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
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/[0.08] text-white rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Webmaster-översikt</h1>
              <p className="text-slate-500 text-sm">Alla kunder och intressenter på plattformen</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] rounded-lg transition"
            title="Uppdatera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-900 rounded-2xl border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
                <p className="text-xs text-slate-500 font-semibold">Kunder totalt</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalCases}</p>
                <p className="text-xs text-slate-500 font-semibold">Ärenden totalt</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalClients}</p>
                <p className="text-xs text-slate-500 font-semibold">Klienter totalt</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.activeCodeCount}</p>
                <p className="text-xs text-slate-500 font-semibold">Aktiva koder</p>
              </div>
            </div>
          </div>
        )}

        {/* License breakdown */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'SOLO',  label: 'Solo',  count: stats.soloUsers,  icon: User,      color: 'text-blue-400',   bg: 'bg-blue-500/10' },
              { key: 'BYRA',  label: 'Byrå',  count: stats.byraUsers,  icon: Building2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { key: 'TRIAL', label: 'Trial', count: stats.trialUsers, icon: Clock,     color: 'text-amber-400',  bg: 'bg-amber-500/10' },
            ].map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(filter === item.key as LicenseFilter ? 'ALL' : item.key as LicenseFilter)}
                  className={`bg-slate-900 rounded-2xl border p-4 flex items-center gap-3 transition ${
                    filter === item.key
                      ? 'border-white/20 ring-1 ring-white/10'
                      : 'border-white/[0.08] hover:border-white/15'
                  }`}
                >
                  <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-extrabold text-white">{item.count}</p>
                    <p className="text-xs text-slate-500 font-semibold">{item.label}-kunder</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Users table */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              {filter === 'ALL' ? 'Alla intressenter' : `${LICENSE_LABELS[filter]}-kunder`}
              <span className="ml-1 text-xs font-normal text-slate-500">({filteredUsers.length})</span>
            </h2>
            {filter !== 'ALL' && (
              <button
                onClick={() => setFilter('ALL')}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Visa alla
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Laddar intressenter...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Inga användare hittades.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filteredUsers.map(user => (
                <div key={user.id} className="px-6 py-4 hover:bg-white/[0.02] transition">
                  <div className="flex items-start justify-between gap-4">
                    {/* User info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white text-sm truncate">{user.name ?? '(inget namn)'}</p>
                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              <Shield className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        {user.firmName && (
                          <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" /> {user.firmName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats + license */}
                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
                      {/* Case/client counts */}
                      <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {user._count.cases} ärenden
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {user._count.createdClients} klienter
                        </span>
                      </div>

                      {/* Modules */}
                      {user.modules.length > 0 && (
                        <div className="hidden md:flex items-center gap-1">
                          {user.modules.map(m => (
                            <span key={m} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* License type selector */}
                      <select
                        value={user.licenseType}
                        onChange={e => updateLicense(user.id, e.target.value)}
                        disabled={saving === user.id}
                        className={`text-xs font-bold px-2 py-1.5 rounded-lg border transition outline-none cursor-pointer disabled:opacity-50 ${LICENSE_COLORS[user.licenseType] ?? 'bg-white/[0.04] border-white/[0.08] text-slate-400'}`}
                      >
                        <option value="SOLO">Solo</option>
                        <option value="BYRA">Byrå</option>
                        <option value="TRIAL">Trial</option>
                      </select>

                      {/* Created date */}
                      <span className="hidden lg:block text-[11px] text-slate-600 min-w-[90px] text-right">
                        {new Date(user.createdAt).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/admin/licenser',     icon: KeyRound,      label: 'Hantera licenskoder',    desc: 'Skapa och deaktivera inbjudningskoder' },
            { href: '/admin/import',       icon: Zap,           label: 'Importera register',      desc: 'Migrera klientdata via CSV-fil' },
            { href: '/admin/integrations', icon: CheckCircle2,  label: 'Integrationer',           desc: 'Visma & Fortnox koppling' },
          ].map(item => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="bg-slate-900 rounded-2xl border border-white/[0.08] p-5 flex items-start gap-3 hover:border-white/15 hover:bg-slate-800/50 transition group"
              >
                <div className="w-9 h-9 bg-white/[0.06] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition">
                  <Icon className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </a>
            )
          })}
        </div>

      </div>
    </main>
  )
}
