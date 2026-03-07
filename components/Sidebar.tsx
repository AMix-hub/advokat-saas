'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Home,
  Users,
  FileText,
  Clock,
  DollarSign,
  CheckSquare,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Scale,
  Zap,
  Search,
  CalendarDays,
  FileSignature,
  KeyRound,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  UserCog,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const MIN_SEARCH_LENGTH = 2

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ name?: string | null; email?: string | null; isAdmin?: boolean; modules?: string[] } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(err => { console.error('Failed to fetch user info:', err) })
  }, [])

  const isActive = (route: string) => {
    if (route === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(route)
  }

  const navItems = [
    { href: '/dashboard',      label: 'Översikt',         icon: Home },
    { href: '/clients',        label: 'Klientregister',   icon: Users },
    { href: '/cases',          label: 'Ärenden',          icon: FileText },
    { href: '/calendar',       label: 'Kalender',         icon: CalendarDays },
    { href: '/tasks',          label: 'Uppgifter',        icon: CheckSquare },
    { href: '/time',           label: 'Tidsregistrering', icon: Clock },
    { href: '/economy',        label: 'Ekonomi',          icon: DollarSign },
    { href: '/agreements',     label: 'Avtal',            icon: FileSignature },
    { href: '/reports',        label: 'Rapporter',        icon: BarChart3 },
    { href: '/templates',      label: 'Mallar',           icon: FileText },
    { href: '/conflict-check', label: 'Jävsprövning',     icon: Scale },
    { href: '/team',           label: 'Team',             icon: Users },
    ...(user?.isAdmin ? [
      { href: '/admin/activation-codes', label: 'Åtkomstkoder',       icon: KeyRound },
      { href: '/admin/users',            label: 'Användarhantering',   icon: UserCog },
    ] : []),
    { href: '/settings',       label: 'Inställningar',    icon: Settings },
  ]

  const allAddOnItems = [
    { href: '/docs',          label: 'CaseCore Docs',        icon: BookOpen,     module: 'docs' },
    { href: '/kyc',           label: 'CaseCore KYC',         icon: ShieldCheck,  module: 'kyc' },
    { href: '/kommunikation', label: 'Klientkommunikation',  icon: MessageSquare, module: 'kommunikation' },
  ]

  const addOnItems = user
    ? allAddOnItems.filter(item => user.modules?.includes(item.module))
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= MIN_SEARCH_LENGTH) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.08]">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:shadow-blue-400/60 transition-all duration-300">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white">
              Case<span className="text-cyan-400">Core</span>
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">v1.0</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Sök ärende, klient..."
              className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </form>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">Navigering</p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold group ${
                  active
                    ? 'text-white bg-blue-500/15 border border-blue-500/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-blue-400' : 'group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="mt-4 mb-2 border-t border-white/[0.06] pt-3">
          <p className="text-[9px] font-bold text-purple-600 uppercase tracking-[0.15em] px-3 mb-2">Tillägg</p>
          <div className="space-y-0.5">
            {addOnItems.length > 0 ? addOnItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold group ${
                    active
                      ? 'text-white bg-purple-500/15 border border-purple-500/25'
                      : 'text-slate-500 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-purple-400' : 'group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                  )}
                </Link>
              )
            }) : (
              <p className="px-3 py-2 text-xs text-slate-600 italic">Inga tillägg aktiverade</p>
            )}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-white/[0.08]">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-500/30 flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="h-12 animate-pulse bg-white/5 rounded-lg mb-1" />
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm border border-transparent hover:border-red-500/20 group"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
          Logga ut
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile header strip */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950 border-b border-white/[0.08] flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/40">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-white tracking-tight">Case<span className="text-cyan-400">Core</span></span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/10"
          aria-label="Öppna meny"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col shadow-2xl z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg z-20 transition"
              aria-label="Stäng meny"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 h-screen sticky top-0 hidden lg:flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border-r border-white/[0.06] shadow-2xl">
        {sidebarContent}
      </aside>
    </>
  )
}
