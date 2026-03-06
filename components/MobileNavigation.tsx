'use client'
import { useState } from 'react'
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
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
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
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white border-t border-slate-200 lg:hidden overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-sm ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all font-bold text-sm"
            >
              <LogOut className="w-5 h-5" />
              Logga ut
            </button>
          </div>
        </div>
      )}
    </>
  )
}
