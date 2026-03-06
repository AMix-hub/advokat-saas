export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
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
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vänster: Lista på kollegor */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Ditt Team</h1>
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user.name} {index === 0 && <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded ml-2">Admin</span>}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
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