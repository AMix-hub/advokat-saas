import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Hjälpfunktion för att översätta status till klientspråk
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

  // Hämtar ärendet, klienten och uppgifterna (men INGA pengar eller loggar)
  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      client: true,
      tasks: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!caseItem) return notFound()

  // Hämtar byråns kontaktuppgifter från första administratören
  const admin = await prisma.user.findFirst()

  // Räknar ut hur långt ärendet har kommit i procent (baserat på avbockade uppgifter)
  const totalTasks = caseItem.tasks.length
  const completedTasks = caseItem.tasks.filter(t => t.isCompleted).length
  const progressPercentage = totalTasks === 0 ? (caseItem.status === 'CLOSED' ? 100 : 10) : Math.round((completedTasks / totalTasks) * 100)
  
  const statusInfo = getClientStatus(caseItem.status)

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full">
        
        {/* Header med Byråns namn */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🏛️</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {admin?.firmName || 'Advokatbyrån AB'}
          </h1>
          <p className="text-slate-500 font-medium">Säker klientportal</p>
        </div>

        {/* Huvudkortet */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="p-8 md:p-12 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ärendeöversikt</p>
                <h2 className="text-3xl font-extrabold text-slate-900">{caseItem.title}</h2>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm border shadow-sm ${statusInfo.bg}`}>
                {statusInfo.text}
              </span>
            </div>

            {/* Förloppsmätare (Progress Bar) */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-600">Arbetsstatus</span>
                <span className="text-xl font-black text-slate-900">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${statusInfo.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Välkommen, {caseItem.client.name}!</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Detta är din säkra, unika länk till ärendet. Här kan du följa vår övergripande status. Vi uppdaterar kontinuerligt våra system när nya steg i processen tas. Har du frågor är du alltid välkommen att kontakta din handläggare.
              </p>
            </div>
          </div>

          {/* Kontaktuppgifter */}
          <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Din Handläggare</p>
              <p className="text-xl font-bold">{admin?.name || 'Advokat / Handläggare'}</p>
              <p className="text-slate-300">{admin?.email}</p>
            </div>
            <a 
              href={`mailto:${admin?.email}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg w-full md:w-auto text-center"
            >
              ✉️ Kontakta oss
            </a>
          </div>

        </div>

        <p className="text-center text-slate-400 text-xs mt-10 font-medium">
          Drivs av CaseCore Legal Tech &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}