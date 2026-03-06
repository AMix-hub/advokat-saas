'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  FileText, 
  Clock, 
  DollarSign, 
  CheckSquare, 
  Settings, 
  BarChart3,
  AlertCircle,
  Calendar,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (route: string) => {
    if (route === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(route)
  }

  const navItems = [
    { href: '/dashboard', label: 'Översikt', icon: Home },
    { href: '/clients', label: 'Klientregister', icon: Users },
    { href: '/cases', label: 'Ärenden', icon: FileText },
    { href: '/tasks', label: 'Uppgifter', icon: CheckSquare },
    { href: '/time', label: 'Tidsregistrering', icon: Clock },
    { href: '/economy', label: 'Ekonomi', icon: DollarSign },
    { href: '/templates', label: 'Mallar', icon: FileText },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/settings', label: 'Inställningar', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen sticky top-0 hidden lg:flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">Case<span className="text-blue-600">Core</span></div>
            <div className="text-xs text-slate-500 font-bold">v1.0</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-sm ${
                  active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logga ut
        </button>
      </div>
    </aside>
  )
}
