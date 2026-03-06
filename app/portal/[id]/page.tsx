import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CheckCircle2, CircleDashed, Calendar, Briefcase, Mail, User, Info } from 'lucide-react'

function getClientStatus(status: string) {
  switch (status) {
    case 'OPEN': return { text: 'Pågående', color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-800 border-blue-200' }
    case 'PENDING': return { text: 'Avvaktar åtgärd', color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-800 border-amber-200' }
    case 'CLOSED': return { text: 'Avslutat', color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    case 'ARCHIVED': return { text: 'Arkiverat', color: 'bg-slate-500', bg: 'bg-slate-50 text-slate-800 border-slate-200' }
    default: return { text: 'Okänd', color: 'bg-slate-500', bg: 'bg-slate-50' }
  }
}

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      client: true,
      tasks: { orderBy: { dueDate: 'asc' } } // Sortera på datum
    }
  })

  if (!caseItem) return notFound()

  const admin = await prisma.user.findFirst()

  const totalTasks = caseItem.tasks.length
  const completedTasks = caseItem.tasks.filter(t => t.isCompleted).length
  const progressPercentage = totalTasks === 0 ? (caseItem.status === 'CLOSED' ? 100 : 10) : Math.round((completedTasks / totalTasks) * 100)
  
  const statusInfo = getClientStatus(caseItem.status)
  
  // Plocka fram max 3 kommande (ej avklarade) uppgifter att visa säkert för klienten
  const upcomingTasks = caseItem.tasks.filter(t => !t.isCompleted).slice(0, 3)

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-3xl w-full">
        
        {/* Header med Byråns namn */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {admin?.firmName || 'Advokatbyrån AB'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">Säker klientportal</p>
        </div>

        {/* Huvudkortet */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="p-6 sm:p-10 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ärendeöversikt</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{caseItem.title}</h2>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm border shadow-sm w-fit ${statusInfo.bg}`}>
                {statusInfo.text}
              </span>
            </div>

            {/* Ärendedetaljer - Säker information */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
              <div>
                <p className="text-slate-400 font-medium mb-1 flex items-center gap-1.5"><Info className="w-4 h-4" /> Ref.nummer</p>
                <p className="font-bold text-slate-800">{caseItem.id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Startdatum</p>
                <p className="font-bold text-slate-800">{new Date(caseItem.createdAt).toLocaleDateString('sv-SE')}</p>
              </div>
            </div>

            {/* Förloppsmätare */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-600">Arbetsprocess</span>
                <span className="text-xl font-black text-slate-900">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${statusInfo.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Nästa steg (Automatiskt från uppgifter) */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Aktuella händelser / Nästa steg</h3>
              {upcomingTasks.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl flex items-center gap-3 text-slate-500 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p>För närvarande finns inga kommande händelser inplanerade. Vi uppdaterar löpande.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {upcomingTasks.map(task => (
                    <li key={task.id} className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <CircleDashed className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Planerat: {new Date(task.dueDate).toLocaleDateString('sv-SE')}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Kontaktuppgifter - Mobilanpassad stack */}
          <div className="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4" /> Din Handläggare
              </p>
              <p className="text-xl font-bold mb-1">{admin?.name || 'Advokat / Handläggare'}</p>
              <p className="text-slate-300 text-sm">{admin?.email}</p>
            </div>
            <a 
              href={`mailto:${admin?.email}`}
              className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" /> Kontakta oss
            </a>
          </div>

        </div>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Drivs av CaseCore Legal Tech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}