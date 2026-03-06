import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ClientCompliance from '@/components/ClientCompliance' // NY IMPORT
import { statusLabel } from '@/lib/status'

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'PENDING': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'CLOSED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    case 'ARCHIVED': return 'bg-white/10 text-slate-300 border-white/20'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const client = await prisma.client.findUnique({
    where: { id: resolvedParams.id },
    include: {
      cases: {
        include: { timeEntries: true, expenses: true }, // Uppdaterad för att hämta utlägg
        orderBy: { updatedAt: 'desc' }
      }
    }
  })

  if (!client) return notFound()

  let totalClientHours = 0
  let totalClientRevenue = 0

  client.cases.forEach(c => {
    const expensesTotal = c.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    totalClientRevenue += expensesTotal // Lägg till utlägg
    c.timeEntries.forEach(t => {
      totalClientHours += t.hours
      totalClientRevenue += (t.hours * c.hourlyRate)
    })
  })

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <Link href="/clients" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2 transition bg-blue-500/10 px-4 py-2 rounded-lg">
            &larr; Tillbaka till klientregistret
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
            <div className="flex items-center gap-5 mb-6">
              <div className={`w-16 h-16 font-black text-2xl rounded-2xl flex items-center justify-center border ${client.isAnonymized ? 'bg-white/[0.08] text-slate-400 border-white/[0.08]' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                {client.isAnonymized ? '?' : client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">{client.name}</h1>
                <p className="text-slate-500 font-medium">Klientprofil</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/[0.04] p-5 rounded-xl border border-white/[0.06]">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">E-postadress</p>
                <p className="font-semibold text-slate-100">{client.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Org.nr / Personnr</p>
                <p className="font-semibold text-slate-100">{client.orgNr || 'Ej angivet'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-8 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
            <p className="text-sm font-bold text-slate-400 mb-1 z-10">Fakturerbart värde</p>
            <p className="text-4xl font-black text-white mb-4 z-10">{totalClientRevenue.toLocaleString('sv-SE')} kr</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-800 z-10">
              <span className="text-sm text-slate-400">Totalt nedlagd tid:</span>
              <span className="font-bold text-blue-400">{totalClientHours.toFixed(1)} h</span>
            </div>
          </div>
        </div>

        {/* COMPLIANCE-MODULEN */}
        <div className="mb-8">
          <ClientCompliance client={client} />
        </div>

        {/* Ärendehistorik */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-100">Ärendehistorik ({client.cases.length})</h2>
          </div>
          {/* ... (Befintlig ärendelista) ... */}
          {client.cases.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium bg-white/[0.04] rounded-xl border border-white/[0.06]">
              Denna klient har inga ärenden ännu.
            </div>
          ) : (
            <div className="grid gap-3">
              {client.cases.map(caseItem => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] hover:border-blue-500/30 hover:shadow-md transition bg-white/[0.04] group">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Timtaxa: {caseItem.hourlyRate} kr/h</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusBadge(caseItem.status)}`}>
                        {statusLabel(caseItem.status)}
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