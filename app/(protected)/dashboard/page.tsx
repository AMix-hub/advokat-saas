export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import UpcomingDeadlines from '@/components/UpcomingDeadlines'
import FloatingActionButton from '@/components/FloatingActionButton'
import NotificationBadge from '@/components/NotificationBadge'
import { Download, Plus, Calendar, Clock, FileText, Briefcase, CheckCircle2, CircleDashed, AlertCircle } from 'lucide-react'
import { statusLabel } from '@/lib/status'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  const dbUser = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null

  const cases = dbUser ? await prisma.case.findMany({
    where: { assignedToId: dbUser.id },
    include: {
      client: true,
      timeEntries: true,
      tasks: {
        where: { isCompleted: false }
      },
      deadlines: true,
      invoices: true
    },
    orderBy: { updatedAt: 'desc' }
  }) : []

  const upcomingTasks = dbUser ? await prisma.task.findMany({
    where: {
      isCompleted: false,
      dueDate: { not: null },
      case: { assignedToId: dbUser.id },
    },
    include: { case: true },
    orderBy: { dueDate: 'asc' },
    take: 6
  }) : []

  const overdeadlines = dbUser ? await prisma.deadline.findMany({
    where: {
      dueDate: { lt: new Date() },
      isCompleted: false,
      case: { assignedToId: dbUser.id },
    },
    include: { case: true }
  }) : []

  const unpaidInvoices = dbUser ? await prisma.invoice.findMany({
    where: {
      status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
      case: { assignedToId: dbUser.id },
    }
  }) : []

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
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page heading */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Översikt</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Välkommen tillbaka — här är en sammanfattning av ditt arbete.</p>
        </div>

        {/* Notifications */}
        {(overdeadlines.length > 0 || unpaidInvoices.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {overdeadlines.length > 0 && (
              <NotificationBadge
                type="overdue"
                title="Förfallna deadlines"
                description={`Du har ${overdeadlines.length} deadline${overdeadlines.length !== 1 ? 's' : ''} som är förfallna`}
                count={overdeadlines.length}
              />
            )}
            {unpaidInvoices.length > 0 && (
              <NotificationBadge
                type="pending"
                title="Obetalda fakturor"
                description={`${unpaidInvoices.length} faktura${unpaidInvoices.length !== 1 ? 'r' : ''} väntar på betalning`}
                count={unpaidInvoices.length}
              />
            )}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="gradient-primary bg-slate-900 p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex items-start justify-between hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mb-1">Aktiva ärenden</p>
              <p className="text-2xl sm:text-3xl font-black text-white">{activeCasesCount}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl"><Briefcase className="w-5 h-5 text-blue-400" /></div>
          </div>
          <div className="gradient-success bg-slate-900 p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex items-start justify-between hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mb-1">Loggade timmar</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{totalHours.toFixed(1)} h</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl"><Clock className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <div className="gradient-warning bg-slate-900 p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex items-start justify-between hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mb-1">Fakturerbart värde</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{totalRevenue.toLocaleString('sv-SE')} kr</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl"><FileText className="w-5 h-5 text-amber-400" /></div>
          </div>
          <div className="gradient-danger bg-slate-900 p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex items-start justify-between hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mb-1">Innestående uppgifter</p>
              <p className="text-2xl sm:text-3xl font-black text-red-400">{pendingTasksCount} st</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl"><CheckCircle2 className="w-5 h-5 text-red-400" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* VÄNSTER SIDA: Ärendelistan */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-white/[0.08] p-5 sm:p-8 h-fit">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" /> Dina ärenden
              </h2>
              
              <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                <Link
                  href="/reports"
                  className="w-full sm:w-auto justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-2.5 rounded-lg font-bold hover:bg-indigo-500/30 transition flex items-center gap-2 text-sm"
                >
                  📊 Rapporter
                </Link>
                <a 
                  href="/api/export" 
                  className="w-full sm:w-auto justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-lg font-bold hover:bg-emerald-500/20 transition flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </a>
                <Link 
                  href="/cases/new" 
                  className="w-full sm:w-auto justify-center bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Nytt ärende
                </Link>
              </div>
            </div>

            {cases.length === 0 ? (
              <div className="text-center py-12 bg-white/[0.04] rounded-xl border border-dashed border-white/[0.08]">
                <CircleDashed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Inga ärenden upplagda ännu.</p>
                <p className="text-slate-400 text-sm mt-1">Klicka på "Nytt ärende" för att börja arbeta.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {cases.map(caseItem => (
                  <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:border-blue-500/30 hover:shadow-md transition bg-white/[0.04] hover:bg-white/[0.08] group gap-3 sm:gap-0">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-blue-400 transition">
                          {caseItem.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-1">
                          Klient: {caseItem.client.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {caseItem.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)} h
                        </span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap ${
                          caseItem.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          caseItem.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          caseItem.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-white/10 text-slate-300 border-white/20'
                        }`}>
                          {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                          {statusLabel(caseItem.status)}
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
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-5 sm:p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-100 mb-5 sm:mb-6 flex items-center gap-2 pb-4 border-b border-white/[0.06]">
                <Calendar className="w-5 h-5 text-slate-400" /> Kommande deadlines
              </h2>

              <UpcomingDeadlines />
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </main>
  )
}