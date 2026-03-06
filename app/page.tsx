export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import SearchBar from '@/components/SearchBar'
// NYTT: Importerar professionella ikoner
import { Building2, Download, Plus, Calendar, Clock, FileText, Briefcase, CheckCircle2, CircleDashed, AlertCircle } from 'lucide-react'

export default async function Dashboard() {
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

  const upcomingTasks = await prisma.task.findMany({
    where: {
      isCompleted: false,
      dueDate: { not: null }
    },
    include: { case: true },
    orderBy: { dueDate: 'asc' },
    take: 6
  })

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

  const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Toppmeny */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                {/* Riktig ikon istället för emoji */}
                <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Case<span className="text-blue-600">Core</span>
              </h1>
            </div>
            
            <div className="hidden lg:flex gap-6 items-center">
              <Link href="/" className="font-bold text-slate-900 border-b-2 border-blue-600 pb-1">Översikt</Link>
              <Link href="/clients" className="font-bold text-slate-500 hover:text-slate-900 transition pb-1">Klientregister</Link>
              
              <div className="w-px h-6 bg-slate-300 mx-2"></div>
              <SearchBar />
            </div>
          </div>
          <UserProfile />
        </div>

        {/* Statistik-kort med ikoner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Aktiva ärenden</p>
              <p className="text-3xl font-black text-slate-900">{activeCasesCount}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg"><Briefcase className="w-5 h-5 text-slate-400" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Loggade timmar</p>
              <p className="text-3xl font-black text-blue-600">{totalHours.toFixed(1)} h</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-500" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Fakturerbart värde</p>
              <p className="text-3xl font-black text-emerald-600">{totalRevenue.toLocaleString('sv-SE')} kr</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg"><FileText className="w-5 h-5 text-emerald-500" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Innestående uppgifter</p>
              <p className="text-3xl font-black text-amber-600">{pendingTasksCount} st</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-amber-500" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* VÄNSTER SIDA: Ärendelistan */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" /> Dina ärenden
              </h2>
              
              <div className="flex gap-3">
                <a 
                  href="/api/export" 
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition shadow-sm flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </a>
                <Link 
                  href="/cases/new" 
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Nytt ärende
                </Link>
              </div>
            </div>

            {cases.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CircleDashed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Inga ärenden upplagda ännu.</p>
                <p className="text-slate-400 text-sm mt-1">Klicka på "Nytt ärende" för att börja arbeta.</p>
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
                        <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-1">
                          Klient: {caseItem.client.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-400 hidden sm:flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {caseItem.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)} h loggat
                        </span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                          caseItem.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          caseItem.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          caseItem.status === 'CLOSED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-slate-100 text-slate-600 border-slate-300'
                        }`}>
                          {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* HÖGER SIDA: Kalender & Deadlines */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-slate-400" /> Kommande Deadlines
              </h2>

              {upcomingTasks.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">Kalendern är tom.</p>
                  <p className="text-slate-400 text-xs mt-1">Inga kommande deadlines!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {upcomingTasks.map(task => {
                    const date = new Date(task.dueDate!)
                    const isOverdue = date.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)

                    return (
                      <Link key={task.id} href={`/cases/${task.caseId}`} className="flex gap-4 items-start group">
                        <div className={`flex flex-col items-center justify-center border rounded-lg min-w-[3.5rem] overflow-hidden shadow-sm transition group-hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                          <span className={`text-[10px] font-bold w-full text-center uppercase py-0.5 ${isOverdue ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {months[date.getMonth()]}
                          </span>
                          <span className={`text-lg font-black py-1 ${isOverdue ? 'text-red-700' : 'text-slate-700'}`}>
                            {date.getDate()}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={`font-bold text-sm truncate transition ${isOverdue ? 'text-red-600' : 'text-slate-800 group-hover:text-blue-600'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {task.case.title}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}