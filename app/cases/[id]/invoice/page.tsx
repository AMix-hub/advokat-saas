import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      client: true, 
      timeEntries: { orderBy: { createdAt: 'asc' } } 
    }
  })

  if (!caseItem) return notFound()

  const user = await prisma.user.findFirst()

  const totalHours = caseItem.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)
  const subTotal = totalHours * caseItem.hourlyRate
  const vat = subTotal * 0.25
  const total = subTotal + vat

  const today = new Date().toLocaleDateString('sv-SE')
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 print:hidden px-4">
          <Link href={`/cases/${caseItem.id}`} className="text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition bg-white px-4 py-2 rounded-lg shadow-sm">
            &larr; Tillbaka till ärendet
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white p-12 md:p-20 shadow-xl print:shadow-none print:p-0 min-h-[1056px] text-slate-900 flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">FAKTURAUNDERLAG</h1>
                <p className="text-slate-500 font-medium">Ärende: {caseItem.title}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-800">{user?.firmName || 'Advokatbyrån AB'}</h2>
                <p className="text-slate-500 mt-1">{user?.name || 'Handläggare'}</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex justify-between mb-16">
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">FAKTURERAS TILL:</p>
                <p className="font-bold text-lg">{caseItem.client.name}</p>
                <p className="text-slate-600">{caseItem.client.email}</p>
                {caseItem.client.orgNr && <p className="text-slate-600">Org.nr: {caseItem.client.orgNr}</p>}
              </div>
              <div className="text-right">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <span className="font-bold text-slate-500">Underlagsdatum:</span>
                  <span className="font-medium">{today}</span>
                  <span className="font-bold text-slate-500">Förfallodatum (30 dgr):</span>
                  <span className="font-medium">{dueDate}</span>
                  <span className="font-bold text-slate-500">Timtaxa:</span>
                  <span className="font-medium">{caseItem.hourlyRate.toLocaleString('sv-SE')} kr/h</span>
                </div>
              </div>
            </div>

            <table className="w-full mb-16">
              <thead>
                <tr className="border-b-2 border-slate-800 text-left">
                  <th className="py-3 font-bold text-slate-800">Datum</th>
                  <th className="py-3 font-bold text-slate-800">Åtgärd / Beskrivning</th>
                  <th className="py-3 font-bold text-slate-800 text-right">Timmar</th>
                  <th className="py-3 font-bold text-slate-800 text-right">Belopp (exkl. moms)</th>
                </tr>
              </thead>
              <tbody>
                {caseItem.timeEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic border-b border-slate-100">
                      Inga tidsloggar registrerade på detta ärende ännu.
                    </td>
                  </tr>
                ) : (
                  caseItem.timeEntries.map(entry => (
                    <tr key={entry.id} className="border-b border-slate-100">
                      <td className="py-4 text-slate-600">{new Date(entry.createdAt).toLocaleDateString('sv-SE')}</td>
                      <td className="py-4 font-medium">{entry.description}</td>
                      <td className="py-4 text-right text-slate-600">{entry.hours} h</td>
                      <td className="py-4 text-right font-medium">{(entry.hours * caseItem.hourlyRate).toLocaleString('sv-SE')} kr</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Totalt antal timmar:</span>
                  <span className="font-bold">{totalHours.toFixed(1)} h</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Delsumma (exkl. moms):</span>
                  <span>{subTotal.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600 border-b border-slate-200">
                  <span>Moms (25%):</span>
                  <span>{vat.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between py-4 text-xl font-black text-slate-900">
                  <span>ATT BETALA:</span>
                  <span>{total.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidfot med betalningsuppgifter */}
          <div className="mt-16 pt-8 border-t-2 border-slate-800 text-sm text-slate-600 flex justify-between">
            <div>
              <p className="font-bold text-slate-800 mb-1">Betalningsuppgifter</p>
              {user?.bankgiro ? (
                <p>Vänligen betala in beloppet till Bankgiro/Plusgiro: <span className="font-bold text-slate-900">{user.bankgiro}</span></p>
              ) : (
                <p className="italic">Inga betalningsuppgifter angivna i inställningarna.</p>
              )}
            </div>
            <div className="text-right">
              <p>Märk betalningen med: <span className="font-bold text-slate-900">{caseItem.title}</span></p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}