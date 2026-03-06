'use client'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Users, Settings, Scale } from 'lucide-react'

export default function UserProfile() {
  const [user, setUser] = useState<{ name?: string | null, email?: string | null } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        if (data.user) setUser({ name: data.user.name, email: data.user.email })
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  if (!user) return <div className="h-12 w-48 animate-pulse bg-white/[0.08] rounded-xl"></div>

  return (
    <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-white/[0.08]">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-100">{user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
      
      <div className="h-9 w-9 bg-blue-500/20 text-blue-400 font-black rounded-full flex items-center justify-center">
        {user.name?.charAt(0) || 'A'}
      </div>
      
      <div className="w-px h-8 bg-white/[0.08] mx-2"></div>

      <Link href="/conflict-check" className="text-sm font-bold text-slate-400 hover:text-amber-400 transition flex items-center gap-1" title="Jävsprövning">
        <Scale className="w-4 h-4" /> <span className="hidden md:inline">Jäv</span>
      </Link>

      <div className="w-px h-4 bg-white/[0.08] mx-1"></div>

      <Link href="/team" className="text-sm font-bold text-slate-400 hover:text-blue-400 transition" title="Team"><Users className="w-4 h-4" /></Link>
      <Link href="/settings" className="text-sm font-bold text-slate-400 hover:text-blue-400 transition" title="Inställningar"><Settings className="w-4 h-4" /></Link>

      <div className="w-px h-4 bg-white/[0.08] mx-1"></div>
      
      <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-sm font-bold text-slate-400 hover:text-red-400 transition" title="Logga ut">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}