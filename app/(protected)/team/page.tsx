export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TeamClientForm from './TeamClientForm' // Vi skapar denna strax!

export default async function TeamPage() {
  // Hämta alla användare och byråns uppgifter
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    include: { cases: true }
  })

  // Vi lånar byråuppgifterna från den första administratören
  const admin = users[0]

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2 transition bg-blue-500/10 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vänster: Lista på kollegor */}
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
            <h1 className="text-2xl font-extrabold text-white mb-6">Ditt Team</h1>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 font-bold rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{user.name} {user.isAdmin && <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded ml-2">Admin</span>}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                    {user.cases.length} ärenden
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Höger: Lägg till ny kollega */}
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-8 text-white">
            <h2 className="text-xl font-bold mb-2">Bjud in kollega</h2>
            <p className="text-slate-400 text-sm mb-6">Skapa inloggningsuppgifter för en ny jurist på byrån.</p>
            
            <TeamClientForm firmName={admin?.firmName || ''} bankgiro={admin?.bankgiro || ''} />
          </div>

        </div>
      </div>
    </main>
  )
}