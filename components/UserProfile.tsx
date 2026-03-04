'use client'
import { signOut, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserProfile() {
  const [user, setUser] = useState<{ name?: string | null, email?: string | null } | null>(null)

  useEffect(() => {
    getSession().then(session => {
      if (session?.user) {
        setUser(session.user)
      }
    })
  }, [])

  if (!user) return <div className="h-12 w-48 animate-pulse bg-slate-200 rounded-xl"></div>

  return (
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-800">{user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
      
      <div className="h-9 w-9 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center">
        {user.name?.charAt(0) || 'A'}
      </div>
      
      <div className="w-px h-8 bg-slate-200 mx-2"></div>
      
      {/* Ny länk till inställningar */}
      <Link href="/settings" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">
        Inställningar
      </Link>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>
      
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-sm font-bold text-slate-500 hover:text-red-600 transition"
      >
        Logga ut
      </button>
    </div>
  )
}