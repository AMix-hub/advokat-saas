export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import SearchBar from '@/components/SearchBar'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || ''

  // Sök efter ärenden som matchar sökordet i titel eller beskrivning
  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { client: { name: { contains: query, mode: 'insensitive' } } }
      ]
    },
    include: { client: true }
  })

  // Sök efter klienter
  const clients = await prisma.client.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { orgNr: { contains: query, mode: 'insensitive' } }
      ]
    }
  })

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl text-white">🏛️</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Case<span className="text-blue-600">Core</span>
              </h1>
            </Link>
            <SearchBar />
          </div>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
            Sökresultat för "{query}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Ärende-resultat */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Ärenden <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{cases.length}</span>
              </h3>
              {cases.length === 0 ? <p className="text-sm text-slate-500 italic">Inga ärenden hittades.</p> : (
                <ul className="space-y-3">
                  {cases.map(c => (
                    <li key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-300 transition">
                      <Link href={`/cases/${c.id}`} className="block">
                        <span className="text-blue-600 font-bold block">{c.title}</span>
                        <span className="text-slate-500 text-sm">Klient: {c.client.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Klient-resultat */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Klienter <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{clients.length}</span>
              </h3>
              {clients.length === 0 ? <p className="text-sm text-slate-500 italic">Inga klienter hittades.</p> : (
                <ul className="space-y-3">
                  {clients.map(c => (
                    <li key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-300 transition">
                      <Link href={`/clients/${c.id}`} className="block">
                        <span className="text-blue-600 font-bold block">{c.name}</span>
                        <span className="text-slate-500 text-sm">{c.email}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}