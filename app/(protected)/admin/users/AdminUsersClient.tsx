'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Shield,
  ShieldOff,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

interface AdminUser {
  id: string
  name: string | null
  email: string
  isAdmin: boolean
  modules: string[]
}

const ALL_MODULES = [
  { key: 'docs',          label: 'CaseCore Docs',       icon: BookOpen },
  { key: 'kyc',           label: 'CaseCore KYC',        icon: ShieldCheck },
  { key: 'kommunikation', label: 'Klientkommunikation', icon: MessageSquare },
]

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.status === 403) { setAccessDenied(true); return }
      const data = await res.json()
      setUsers(data.users || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const updateUser = async (userId: string, patch: Partial<Pick<AdminUser, 'isAdmin' | 'modules'>>) => {
    setSaving(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data.user } : u))
      }
    } finally {
      setSaving(null)
    }
  }

  const toggleModule = (user: AdminUser, moduleKey: string) => {
    const modules = user.modules.includes(moduleKey)
      ? user.modules.filter(m => m !== moduleKey)
      : [...user.modules, moduleKey]
    updateUser(user.id, { modules })
  }

  const toggleAdmin = (user: AdminUser) => {
    updateUser(user.id, { isAdmin: !user.isAdmin })
  }

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
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Användarhantering</h1>
                  <p className="text-slate-500 text-sm">Hantera roller och tilläggsåtkomst per användare</p>
                </div>
              </div>
              <button
                onClick={fetchUsers}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] rounded-lg transition"
                title="Uppdatera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Users list */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Laddar användare...</div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-slate-500">Inga användare hittades.</div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {users.map(user => (
                    <div key={user.id} className="p-4 sm:p-6">
                      {/* User info row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white">
                            {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{user.name ?? '(inget namn)'}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        {/* Admin toggle */}
                        <button
                          onClick={() => toggleAdmin(user)}
                          disabled={saving === user.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            user.isAdmin
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-white/[0.05] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
                          }`}
                          title={user.isAdmin ? 'Ta bort admin' : 'Gör till admin'}
                        >
                          {user.isAdmin ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                          {user.isAdmin ? 'Admin' : 'Användare'}
                        </button>
                      </div>

                      {/* Modules */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Tillgängliga tillägg</p>
                        <div className="flex flex-wrap gap-2">
                          {ALL_MODULES.map(mod => {
                            const Icon = mod.icon
                            const active = user.modules.includes(mod.key)
                            return (
                              <button
                                key={mod.key}
                                onClick={() => toggleModule(user, mod.key)}
                                disabled={saving === user.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                                  active
                                    ? 'bg-purple-500/15 border-purple-500/25 text-purple-300'
                                    : 'bg-white/[0.04] border-white/[0.08] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {mod.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-400">
              <p className="font-bold mb-1">Hur fungerar tilläggsåtkomst?</p>
              <ul className="space-y-1 text-xs list-disc list-inside text-blue-400">
                <li>Aktivera ett tillägg för en användare genom att klicka på knappen bredvid tilläggnamnet.</li>
                <li>Klicka på <strong>Admin</strong>-knappen för att ge en användare administratörsrättigheter.</li>
                <li>Administratörer har tillgång till Åtkomstkoder och Användarhantering.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
