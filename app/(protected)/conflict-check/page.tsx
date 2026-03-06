'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import { Scale, Search, ShieldCheck, AlertOctagon, Printer, History, User, Briefcase } from 'lucide-react'

function statusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Öppen'
    case 'PENDING': return 'Pågående'
    case 'CLOSED': return 'Stängd'
    case 'ARCHIVED': return 'Arkiverad'
    default: return status
  }
}

export default function ConflictCheckPage() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<{ clients: any[], cases: any[] }>({ clients: [], cases: [] })
  const [logs, setLogs] = useState<any[]>([])
  const [firmInfo, setFirmInfo] = useState<{ firmName?: string, logo?: string | null }>({})

  // Hämta historiken och byråns info när sidan laddas
  const fetchLogs = async () => {
    const res = await fetch('/api/conflict-check')
    const data = await res.json()
    if (Array.isArray(data)) setLogs(data)
  }

  useEffect(() => {
    fetchLogs()
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.user) setFirmInfo({ firmName: data.user.firmName, logo: data.user.logo })
    })
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.length < 2) return
    
    setIsSearching(true)
    const res = await fetch('/api/conflict-check', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    
    const data = await res.json()
    if (res.ok) {
      setResults({ clients: data.clients, cases: data.cases })
      setHasSearched(true)
      fetchLogs() // Uppdatera loggen med den nya sökningen
    }
    setIsSearching(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const totalHits = results.clients.length + results.cases.length

  return (
    <main className="min-h-screen bg-slate-50 print:bg-white">
      
      {/* --- STANDARD GRÄNSSNITT (Döljs vid utskrift) --- */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto print:hidden">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Sökmotorn */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Scale className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Jävsprövning</h1>
                  <p className="text-slate-500 font-medium">Sök i hela registret. Sökningen loggförs automatiskt.</p>
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Sök på namn, org.nr eller nyckelord..."
                    className="w-full border-2 border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-indigo-500 font-medium bg-slate-50 text-slate-900 transition"
                    required
                  />
                </div>
                <button type="submit" disabled={isSearching || query.length < 2} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 whitespace-nowrap">
                  {isSearching ? 'Söker...' : 'Genomför prövning'}
                </button>
              </form>
            </div>

            {/* Resultatvisning */}
            {hasSearched && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                {totalHits === 0 ? (
                  <div className="text-center py-8">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Ingen träff hittades</h2>
                    <p className="text-slate-600 mb-8">Ett utmärkt resultat. Inget i databasen tyder på en jävssituation för "{query}".</p>
                    <button onClick={handlePrint} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl font-bold hover:bg-emerald-100 transition shadow-sm inline-flex items-center gap-2">
                      <Printer className="w-5 h-5" /> Skriv ut Jävsintyg (PDF)
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0" />
                      <div>
                        <h2 className="text-lg font-bold text-red-900">Möjligt jäv upptäckt ({totalHits} träffar)</h2>
                        <p className="text-sm text-red-700">Granska listan nedan noggrant innan ni åtar er uppdraget.</p>
                      </div>
                    </div>

                    {results.clients.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" /> Träffar i Klientregistret
                        </h3>
                        <div className="grid gap-3">
                          {results.clients.map(c => (
                            <Link key={c.id} href={`/clients/${c.id}`} className="block p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-400 transition">
                              <p className="font-bold text-slate-900">{c.name}</p>
                              <p className="text-sm text-slate-500">{c.orgNr} | {c.email}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.cases.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> Träffar i Ärenden / Anteckningar
                        </h3>
                        <div className="grid gap-3">
                          {results.cases.map(c => (
                            <Link key={c.id} href={`/cases/${c.id}`} className="block p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-400 transition">
                              <p className="font-bold text-slate-900">{c.title}</p>
                              <p className="text-sm text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                              <span className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded">Ärendestatus: {statusLabel(c.status)}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audit Trail (Loggbok) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit max-h-[800px] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <History className="w-5 h-5 text-indigo-500" /> Sökhistorik (Audit Trail)
            </h2>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Inga sökningar har gjorts ännu.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 truncate pr-2">"{log.searchTerm}"</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${log.matchesFound === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {log.matchesFound} träffar
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>{log.user?.name || 'Handläggare'}</span>
                      <span>{new Date(log.createdAt).toLocaleString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- UTSKRIFTSVY (Syns ENDAST vid ctrl+p / pdf-export) --- */}
      <div className="hidden print:block max-w-3xl mx-auto p-12 text-slate-900 bg-white h-screen">
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 mb-12">
          {firmInfo.logo ? (
            <img src={firmInfo.logo} alt="Byråns logotyp" className="max-h-20 object-contain" />
          ) : (
            <h1 className="text-2xl font-black uppercase tracking-widest">{firmInfo.firmName || 'Advokatbyrån AB'}</h1>
          )}
          <div className="text-right text-sm">
            <p className="font-bold text-slate-500 uppercase">Utskriftsdatum</p>
            <p>{new Date().toLocaleDateString('sv-SE')}</p>
          </div>
        </div>

        <h1 className="text-4xl font-black mb-12 text-center uppercase">Jävsprövningsintyg</h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Härmed intygas att en formell och elektronisk jävsprövning har genomförts i byråns centrala klient- och ärenderegister (inklusive historiska akter och minnesanteckningar).
          </p>
          
          <div className="bg-slate-50 border border-slate-200 p-6 my-8 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Genomförd sökning på</p>
            <p className="text-2xl font-serif italic">"{query}"</p>
          </div>

          <p>
            Systemet returnerade <strong>{totalHits} sökträffar</strong>. Inget i sökresultatet indikerar en intressekonflikt eller jävssituation för den sökta parten.
          </p>
          <p>
            Denna sökning har loggförts med oförstörbar tidsstämpel i byråns granskningslogg (Audit Trail).
          </p>
        </div>

        <div className="mt-32 pt-8 border-t border-slate-300 grid grid-cols-2 gap-12">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-10">Ort och datum</p>
            <div className="border-b border-slate-400"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-10">Signatur Handläggare</p>
            <div className="border-b border-slate-400"></div>
            <p className="text-sm mt-2">{logs[0]?.user?.name || 'Handläggare'}</p>
          </div>
        </div>
      </div>

    </main>
  )
}