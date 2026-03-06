export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import { Search, User, Briefcase, ArrowRight } from 'lucide-react'

function statusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Öppen'
    case 'PENDING': return 'Pågående'
    case 'CLOSED': return 'Stängd'
    case 'ARCHIVED': return 'Arkiverad'
    default: return status
  }
}

export default async function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || ''

  let clients: any[] = []
  let cases: any[] = []

  if (query.length >= 2) {
    clients = await prisma.client.findMany({
      where: { OR: [ { name: { contains: query, mode: 'insensitive' } }, { orgNr: { contains: query, mode: 'insensitive' } } ] }
    })
    cases = await prisma.case.findMany({
      where: { OR: [ { title: { contains: query, mode: 'insensitive' } } ] },
      include: { client: true }
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg text-sm">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Sökresultat</h1>
              <p className="text-slate-500 font-medium">Visar resultat för: <span className="font-bold text-slate-800">"{query}"</span></p>
            </div>
          </div>
        </div>

        {query.length < 2 ? (
           <div className="text-center p-8 bg-slate-100 rounded-xl text-slate-500 font-medium border border-slate-200">Skriv minst 2 tecken i sökrutan för att söka.</div>
        ) : clients.length === 0 && cases.length === 0 ? (
           <div className="text-center p-12 bg-slate-50 rounded-xl text-slate-500 border border-dashed border-slate-300">
             <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
             <span className="font-bold block">Inga träffar hittades.</span>
             <span className="text-sm">Prova att söka på ett annat ord eller org.nummer.</span>
           </div>
        ) : (
          <div className="space-y-8">
            {clients.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Klienter</h2>
                <div className="grid gap-3">
                  {clients.map(c => (
                    <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">{c.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{c.orgNr || c.email}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {cases.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Ärenden</h2>
                <div className="grid gap-3">
                  {cases.map(c => (
                    <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">{c.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">Klient: <span className="font-medium text-slate-700">{c.client.name}</span> • Status: {statusLabel(c.status)}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}