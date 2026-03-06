import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import ClientCompliance from '@/components/ClientCompliance' // NY IMPORT

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'CLOSED': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'ARCHIVED': return 'bg-slate-200 text-slate-700 border-slate-300'
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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/clients" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till klientregistret
          </Link>
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-5 mb-6">
              <div className={`w-16 h-16 font-black text-2xl rounded-2xl flex items-center justify-center shadow-sm border ${client.isAnonymized ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                {client.isAnonymized ? '?' : client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{client.name}</h1>
                <p className="text-slate-500 font-medium">Klientprofil</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">E-postadress</p>
                <p className="font-semibold text-slate-800">{client.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Org.nr / Personnr</p>
                <p className="font-semibold text-slate-800">{client.orgNr || 'Ej angivet'}</p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Ärendehistorik ({client.cases.length})</h2>
          </div>
          {/* ... (Befintlig ärendelista) ... */}
          {client.cases.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-100">
              Denna klient har inga ärenden ännu.
            </div>
          ) : (
            <div className="grid gap-3">
              {client.cases.map(caseItem => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-white group">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Timtaxa: {caseItem.hourlyRate} kr/h</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusBadge(caseItem.status)}`}>
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