export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewCaseForm from './NewCaseForm'

export default async function NewCasePage() {
  // Hämta alla klienter så vi kan koppla ärendet till någon
  const clients = await prisma.client.findMany({ 
    orderBy: { name: 'asc' } 
  })
  
  // Hämta hela teamet så vi kan välja ansvarig handläggare
  const users = await prisma.user.findMany({ 
    orderBy: { name: 'asc' } 
  })

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2 transition bg-blue-500/10 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Nytt ärende</h1>
          <p className="text-slate-400 mb-8">
            Skapa en ny akt och koppla den till en befintlig klient i registret.
          </p>
          
          {clients.length === 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl text-amber-300">
              <p className="font-bold mb-2">⚠️ Inga klienter hittades!</p>
              <p className="text-sm mb-4">Du måste lägga till minst en klient i klientregistret innan du kan öppna ett ärende.</p>
              <Link href="/clients/new" className="bg-amber-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-amber-700 transition inline-block">
                Gå till Klientregistret
              </Link>
            </div>
          ) : (
            <NewCaseForm clients={clients} users={users} />
          )}
        </div>

      </div>
    </main>
  )
}