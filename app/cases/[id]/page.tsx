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
import CopyPortalLink from '@/components/CopyPortalLink'
// Importerar ikonerna
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
      tasks: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!caseItem) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg text-sm">
            <ArrowLeft className="w-4 h-4" /> Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{caseItem.title}</h1>
                  <p className="text-slate-600 text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    Klient: <span className="font-semibold text-slate-800">{caseItem.client.name}</span>
                  </p>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Timtaxa: {caseItem.hourlyRate} kr/h</p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${getStatusBadge(caseItem.status)}`}>
                    {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                    {caseItem.status}
                  </span>
                  
                  <div className="flex flex-wrap justify-end gap-2 mt-2">
                    <CopyPortalLink caseId={caseItem.id} />
                    
                    <Link href={`/cases/${caseItem.id}/edit`} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Redigera
                    </Link>
                    <Link href={`/cases/${caseItem.id}/templates`} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition shadow-sm flex items-center gap-2">
                      <FileStack className="w-4 h-4" /> Dokumentmallar
                    </Link>
                    <Link href={`/cases/${caseItem.id}/invoice`} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Faktura
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {caseItem.description}
              </div>
            </div>

            <TaskList caseId={caseItem.id} tasks={caseItem.tasks} />
            <TimeTracker caseId={caseItem.id} timeEntries={caseItem.timeEntries} />
            <ExpenseTracker caseId={caseItem.id} expenses={caseItem.expenses} />
            <DocumentManager caseId={caseItem.id} documents={caseItem.documents} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Aktivitetslogg
              </h2>
              <ul className="space-y-6">
                {caseItem.logs.map((log: any) => (
                  <li key={log.id} className="relative pl-5 border-l-2 border-slate-200">
                    <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[6px] top-1.5 ring-4 ring-white"></div>
                    <p className="font-medium text-slate-800">{log.action}</p>
                    <span className="text-sm text-slate-500 mt-1 block font-medium">
                      {new Date(log.createdAt).toLocaleString('sv-SE')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <CaseControls caseItem={caseItem} />
          </div>
        </div>
      </div>
    </main>
  )
}