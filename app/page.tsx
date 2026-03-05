// DENNA RAD ÄR NY: Säger åt Vercel att aldrig cacha sidan, utan alltid visa live-data!
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'

export default async function Dashboard() {
  // Hämta all data från databasen för att kunna räkna ut statistiken
  const cases = await prisma.case.findMany({
    include: {
      client: true,
      timeEntries: true,
      tasks: {
        where: { isCompleted: false }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // Räkna ut statistik från all hämtad data
  const activeCasesCount = cases.filter(c => c.status === 'OPEN' || c.status === 'PENDING').length
  
  let totalHours = 0
  let totalRevenue = 0
  let pendingTasksCount = 0

  cases.forEach(c => {
    pendingTasksCount += c.tasks.length
    c.timeEntries.forEach(t => {
      totalHours += t.hours
      totalRevenue += (t.hours * c.hourlyRate)
    })
  })

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Toppmeny med nya CaseCore-loggan */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl text-white">🏛️</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Case<span className="text-blue-600">Core</span>
            </h1>
          </div>
          <UserProfile />
        </div>

        {/* Nya Statistik-panelen (Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Kort 1: Aktiva ärenden */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 mb-1">Aktiva ärenden</p>
            <p className="text-3xl font-black text-slate-900">{activeCasesCount}</p>
          </div>

          {/* Kort 2: Arbetade timmar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 mb-1">Loggade timmar</p>
            <p className="text-3xl font-black text-blue-600">{totalHours.toFixed(1)} h</p>
          </div>

          {/* Kort 3: Totalt fakturerbart värde */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 mb-1">Fakturerbart värde</p>
            <p className="text-3xl font-black text-emerald-600">
              {totalRevenue.toLocaleString('sv-SE')} kr
            </p>
          </div>

          {/* Kort 4: Ogjorda uppgifter */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 mb-1">Innestående uppgifter</p>
            <p className="text-3xl font-black text-amber-600">{pendingTasksCount} st</p>
          </div>
        </div>

        {/* Listan över ärenden */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Dina ärenden</h2>
            <Link 
              href="/cases/new" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition"
            >
              + Nytt ärende
            </Link>
          </div>

          {cases.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium">
              Inga ärenden upplagda ännu. Klicka på "Nytt ärende" för att börja!
            </div>
          ) : (
            <div className="grid gap-4">
              {cases.map(caseItem => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition bg-slate-50 hover:bg-white group">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 font-medium">
                        Klient: {caseItem.client.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400">
                        {caseItem.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)} h loggat
                      </span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                        caseItem.status === 'OPEN' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        caseItem.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        caseItem.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        'bg-slate-200 text-slate-700 border-slate-300'
                      }`}>
                        {caseItem.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}