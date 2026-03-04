import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      client: true, 
      timeEntries: { orderBy: { createdAt: 'asc' } }
    }
  })

  // Hämtar administratörens/byråns info från databasen för brevhuvudet
  const adminUser = await prisma.user.findFirst()

  if (!caseItem) return notFound()

  const totalHours = caseItem.timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const totalAmountExclVat = totalHours * caseItem.hourlyRate
  const vatAmount = totalAmountExclVat * 0.25 // 25% Moms
  const totalAmountInclVat = totalAmountExclVat + vatAmount

  return (
    <div className="min-h-screen bg-slate-100 p-8 print:p-0 print:bg-white flex flex-col items-center">
      
      {/* Knappar som döljs vid utskrift */}
      <div className="max-w-3xl w-full mb-6 flex justify-between print:hidden">
        <Link href={`/cases/${caseItem.id}`} className="text-blue-600 font-bold hover:underline">
          &larr; Tillbaka till ärendet
        </Link>
        <button 
          onClick={typeof window !== 'undefined' ? () => window.print() : undefined}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow-sm"
        >
          🖨️ Skriv ut / Spara som PDF
        </button>
      </div>

      {/* Själva A4-Fakturan */}
      <div className="max-w-3xl w-full bg-white p-12 shadow-xl print:shadow-none border border-slate-200 print:border-none min-h-[1056px]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-16 border-b-2 border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">FAKTURAUNDERLAG</h1>
            <p className="text-slate-500 font-medium">Datum: {new Date().toLocaleDateString('sv-SE')}</p>
            <p className="text-slate-500 font-medium">Ärende-ID: {caseItem.id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-800">{adminUser?.firmName || 'Advokatbyrån AB'}</h2>
            <p className="text-slate-600">{adminUser?.name}</p>
            <p className="text-slate-600">{adminUser?.email}</p>
          </div>
        </div>

        {/* Klientinfo */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Faktureras till:</h3>
          <p className="text-xl font-bold text-slate-800">{caseItem.client.name}</p>
          {caseItem.client.orgNr && <p className="text-slate-600">Org.nr: {caseItem.client.orgNr}</p>}
          <p className="text-slate-600">{caseItem.client.email}</p>
        </div>

        {/* Ärendeinfo */}
        <div className="mb-12 bg-slate-50 p-6 border border-slate-100 rounded-lg print:border-slate-300">
          <p className="font-bold text-slate-800">Ärende: {caseItem.title}</p>
          <p className="text-slate-600 text-sm mt-1">Överenskommen timtaxa: {caseItem.hourlyRate.toLocaleString('sv-SE')} kr/h (exkl. moms)</p>
        </div>

        {/* Tidsloggar - Tabell */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="py-3 font-bold text-slate-700">Datum</th>
              <th className="py-3 font-bold text-slate-700">Åtgärd</th>
              <th className="py-3 font-bold text-slate-700 text-right">Timmar</th>
              <th className="py-3 font-bold text-slate-700 text-right">Belopp (SEK)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {caseItem.timeEntries.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-slate-500 italic">Ingen tid rapporterad ännu.</td></tr>
            ) : (
              caseItem.timeEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="py-4 text-slate-600">{new Date(entry.createdAt).toLocaleDateString('sv-SE')}</td>
                  <td className="py-4 font-medium text-slate-800">{entry.description}</td>
                  <td className="py-4 text-right text-slate-600">{entry.hours} h</td>
                  <td className="py-4 text-right text-slate-800">{(entry.hours * caseItem.hourlyRate).toLocaleString('sv-SE')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Summering */}
        <div className="flex justify-end">
          <div className="w-1/2 bg-slate-50 p-6 border border-slate-200 rounded-lg print:border-slate-300">
            <div className="flex justify-between mb-3 text-slate-600">
              <span>Totalt arbetade timmar:</span>
              <span>{totalHours} h</span>
            </div>
            <div className="flex justify-between mb-3 text-slate-600">
              <span>Belopp exkl. moms:</span>
              <span>{totalAmountExclVat.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between mb-4 text-slate-600">
              <span>Moms (25%):</span>
              <span>{vatAmount.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-300 pt-4">
              <span className="text-lg font-bold text-slate-800">Totalt att fakturera:</span>
              <span className="text-2xl font-black text-blue-600">{totalAmountInclVat.toLocaleString('sv-SE')} kr</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}