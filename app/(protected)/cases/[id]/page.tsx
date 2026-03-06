export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CaseControls from '@/components/CaseControls'
import DocumentManager from '@/components/DocumentManager'
import TimeTracker from '@/components/TimeTracker'
import ExpenseTracker from '@/components/ExpenseTracker'
import UserProfile from '@/components/UserProfile'
import TaskList from '@/components/TaskList'
import DeadlineManager from '@/components/DeadlineManager'
import InvoiceManager from '@/components/InvoiceManager'
import InternalComments from '@/components/InternalComments'
import CopyPortalLink from '@/components/CopyPortalLink'
import Timeline from '@/components/Timeline'
import { Briefcase, Edit, FileStack, FileText, ArrowLeft, Activity, AlertCircle } from 'lucide-react'

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'CLOSED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'ARCHIVED': return 'bg-slate-100 text-slate-600 border-slate-300'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Tillbaka-knapp och profil */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1.5 transition bg-blue-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Tillbaka till översikten</span><span className="xs:hidden">Tillbaka</span>
          </Link>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            
            {/* Ärendehuvudet */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                <div className="w-full md:w-auto">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">{caseItem.title}</h1>
                  <p className="text-slate-600 text-base sm:text-lg flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    Klient: <span className="font-semibold text-slate-800">{caseItem.client.name}</span>
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">Timtaxa: {caseItem.hourlyRate} kr/h</p>
                </div>
                
                <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 w-fit ${getStatusBadge(caseItem.status)}`}>
                    {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                    {caseItem.status}
                  </span>
                  
                  {/* Action-knappar (Staplas på mobil, rad på dator) */}
                  <div className="flex flex-col sm:flex-row flex-wrap justify-start md:justify-end gap-2 mt-2 w-full">
                    <div className="w-full sm:w-auto"><CopyPortalLink caseId={caseItem.id} /></div>
                    
                    <Link href={`/cases/${caseItem.id}/edit`} className="w-full sm:w-auto justify-center bg-white text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Redigera
                    </Link>
                    <Link href={`/cases/${caseItem.id}/templates`} className="w-full sm:w-auto justify-center bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-100 transition shadow-sm flex items-center gap-2">
                      <FileStack className="w-4 h-4" /> Dokumentmallar
                    </Link>
                    <Link href={`/cases/${caseItem.id}/invoice`} className="w-full sm:w-auto justify-center bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Faktura
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 text-slate-700 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                {caseItem.description}
              </div>
            </div>

            <TaskList caseId={caseItem.id} tasks={caseItem.tasks} />
            <DeadlineManager caseId={caseItem.id} />
            <InvoiceManager caseId={caseItem.id} />
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