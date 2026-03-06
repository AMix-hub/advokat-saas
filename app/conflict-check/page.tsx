export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import { redirect } from 'next/navigation'

export default async function ConflictCheckPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''

  let clients: any[] = []
  let cases: any[] = []
  let hasSearched = false

  if (query.trim().length > 1) {
    hasSearched = true
    
    // Sök djupt i alla klienter
    clients = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { orgNr: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { cases: true }
    })

    // Sök djupt i alla ärenden och anteckningar
    cases = await prisma.case.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { client: true }
    })
  }

  const hasConflicts = clients.length > 0 || cases.length > 0

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Toppmeny */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-3xl">⚖️</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Jävsprövning</h1>
            <p className="text-slate-500">
              Sök på personnamn, företagsnamn eller organisationsnummer för att säkerställa att ingen intressekonflikt föreligger innan byrån åtar sig uppdraget.
            </p>
          </div>

          {/* Sökformulär */}
          <form action="/conflict-check" className="flex flex-col sm:flex-row gap-4 mb-10">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="T.ex. 'Andersson AB' eller '556000-0000'"
              className="flex-1 border-2 border-slate-300 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-lg transition bg-slate-50"
              required
              minLength={2}
            />
            <button 
              type="submit"
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-md"
            >
              Utför sökning
            </button>
          </form>

          {/* Resultatvisning */}
          {hasSearched && (
            <div className="mt-8">
              {!hasConflicts ? (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-emerald-800 mb-2">Inga intressekonflikter hittades!</h2>
                  <p className="text-emerald-700 font-medium">
                    Inga klienter eller ärenden matchar sökningen "{query}". Det är fritt fram att åta sig uppdraget.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                  <div className="text-center border-b border-red-200 pb-6 mb-6">
                    <div className="text-4xl mb-4 animate-pulse">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Varning för potentiellt jäv</h2>
                    <p className="text-red-700 font-medium">
                      Vi hittade information i systemet som matchar "{query}". Vänligen granska nedanstående träffar noggrant.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Klientträffar */}
                    {clients.length > 0 && (
                      <div>
                        <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
                          👤 Träffar i Klientregistret ({clients.length})
                        </h3>
                        <div className="grid gap-3">
                          {clients.map(c => (
                            <Link key={c.id} href={`/clients/${c.id}`} className="block bg-white p-4 rounded-xl border border-red-100 hover:border-red-300 shadow-sm transition">
                              <p className="font-bold text-slate-900 text-lg">{c.name}</p>
                              <p className="text-slate-600 text-sm mt-1">{c.email} • Org.nr: {c.orgNr || 'Ej angivet'}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ärendeträffar */}
                    {cases.length > 0 && (
                      <div>
                        <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
                          📁 Träffar i Ärenden & Anteckningar ({cases.length})
                        </h3>
                        <div className="grid gap-3">
                          {cases.map(c => (
                            <Link key={c.id} href={`/cases/${c.id}`} className="block bg-white p-4 rounded-xl border border-red-100 hover:border-red-300 shadow-sm transition">
                              <p className="font-bold text-slate-900 text-lg">{c.title}</p>
                              <p className="text-slate-600 text-sm mt-1">
                                Tillhör klient: <span className="font-bold">{c.client.name}</span>
                              </p>
                              {c.description && c.description.toLowerCase().includes(query.toLowerCase()) && (
                                <div className="mt-3 p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100 italic">
                                  "... {c.description.substring(Math.max(0, c.description.toLowerCase().indexOf(query.toLowerCase()) - 30), c.description.toLowerCase().indexOf(query.toLowerCase()) + query.length + 30)} ..."
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}