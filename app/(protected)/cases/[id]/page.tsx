export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CaseControls from '@/components/CaseControls'
import DocumentManager from '@/components/DocumentManager'
import TimeTracker from '@/components/TimeTracker'
import ExpenseTracker from '@/components/ExpenseTracker'
import TaskList from '@/components/TaskList'
import DeadlineManager from '@/components/DeadlineManager'
import InvoiceManager from '@/components/InvoiceManager'
import InternalComments from '@/components/InternalComments'
import CopyPortalLink from '@/components/CopyPortalLink'
import Timeline from '@/components/Timeline'
import { Briefcase, Edit, FileStack, FileText, ArrowLeft, Activity, AlertCircle } from 'lucide-react'
import { statusLabel } from '@/lib/status'

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'CLOSED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'ARCHIVED': return 'bg-white/10 text-slate-300 border-white/20'
    default: return 'bg-white/[0.05] text-slate-300 border-white/10'
  }
}

export default async function CaseDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      client: true, 
      documents: { orderBy: { createdAt: 'desc' } },
      timeEntries: { orderBy: { createdAt: 'desc' } },
      expenses: { orderBy: { createdAt: 'desc' } },
      logs: { orderBy: { createdAt: 'desc' } },
      tasks: { orderBy: { createdAt: 'desc' } },
      deadlines: { orderBy: { dueDate: 'asc' } },
      invoices: { orderBy: { invoiceDate: 'desc' } }
    }
  })

  if (!caseItem) return notFound()

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Tillbaka-knapp */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1.5 transition bg-blue-500/10 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Tillbaka till översikten</span><span className="xs:hidden">Tillbaka</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            
            {/* Ärendehuvudet */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-5 sm:p-8 mb-6 sm:mb-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                <div className="w-full md:w-auto">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">{caseItem.title}</h1>
                  <p className="text-slate-400 text-base sm:text-lg flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    Klient: <span className="font-semibold text-slate-100">{caseItem.client.name}</span>
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">Timtaxa: {caseItem.hourlyRate} kr/h</p>
                </div>
                
                <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 w-fit ${getStatusBadge(caseItem.status)}`}>
                    {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                    {statusLabel(caseItem.status)}
                  </span>
                  
                  {/* Action-knappar (Staplas på mobil, rad på dator) */}
                  <div className="flex flex-col sm:flex-row flex-wrap justify-start md:justify-end gap-2 mt-2 w-full">
                    <div className="w-full sm:w-auto"><CopyPortalLink caseId={caseItem.id} /></div>
                    
                    <Link href={`/cases/${caseItem.id}/edit`} className="w-full sm:w-auto justify-center bg-slate-800 text-slate-300 border border-white/10 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-white/[0.08] transition flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Redigera
                    </Link>
                    <Link href={`/cases/${caseItem.id}/templates`} className="w-full sm:w-auto justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-500/30 transition flex items-center gap-2">
                      <FileStack className="w-4 h-4" /> Dokumentmallar
                    </Link>
                    <Link href={`/cases/${caseItem.id}/invoice`} className="w-full sm:w-auto justify-center bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Faktura
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.04] p-4 sm:p-5 rounded-xl border border-white/[0.06] text-slate-300 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                {caseItem.description}
              </div>
            </div>

            <TaskList caseId={caseItem.id} tasks={caseItem.tasks} />
            <DeadlineManager caseId={caseItem.id} />
            <InvoiceManager caseId={caseItem.id} timeEntries={caseItem.timeEntries} expenses={caseItem.expenses} hourlyRate={caseItem.hourlyRate} />
            <InternalComments caseId={caseItem.id} />
            <TimeTracker caseId={caseItem.id} timeEntries={caseItem.timeEntries} />
            <ExpenseTracker caseId={caseItem.id} expenses={caseItem.expenses} />
            <DocumentManager caseId={caseItem.id} documents={caseItem.documents} />

            <Timeline 
              events={caseItem.logs.map((log: any) => ({
                id: log.id,
                action: log.action,
                timestamp: log.createdAt,
                type: log.action.toLowerCase().includes('uppdat') ? 'update' : 'create'
              }))}
              title="Aktivitetslogg"
            />
          </div>

          <div className="order-first lg:order-last mb-6 lg:mb-0">
            <CaseControls caseItem={caseItem} />
          </div>
        </div>
      </div>
    </main>
  )
}