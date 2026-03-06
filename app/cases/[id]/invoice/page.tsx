export const dynamic = 'force-dynamic'

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
      timeEntries: { orderBy: { createdAt: 'asc' } },
      expenses: { orderBy: { createdAt: 'asc' } }
    }
  })

  if (!caseItem) return notFound()

  // Hämtar den första användaren/admin för att få byråuppgifter och LOGOTYP
  const user = await prisma.user.findFirst()

  const totalHours = caseItem.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)
  const subTotalTime = totalHours * caseItem.hourlyRate
  const vat = subTotalTime * 0.25
  const totalExpenses = caseItem.expenses.reduce((acc, curr) => acc + curr.amount, 0)
  
  const total = subTotalTime + vat + totalExpenses

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
              <div className="text-right flex flex-col items-end">
                {/* LOGOTYP VISNING */}
                {user?.logo ? (
                  <img src={user.logo} alt="Byråns logotyp" className="max-h-20 max-w-[200px] object-contain mb-3" />
                ) : (
                  <h2 className="text-2xl font-bold text-slate-800">{user?.firmName || 'Advokatbyrån AB'}</h2>
                )}
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
                  <th className="py-3 font-bold text-slate-800 text-right">Mängd</th>
                  <th className="py-3 font-bold text-slate-800 text-right">Belopp</th>
                </tr>
              </thead>
              <tbody>
                {caseItem.timeEntries.map(entry => (
                  <tr key={entry.id} className="border-b border-slate-100">
                    <td className="py-4 text-slate-600">{new Date(entry.createdAt).toLocaleDateString('sv-SE')}</td>
                    <td className="py-4 font-medium">{entry.description} <span className="text-xs text-slate-400 ml-2">(Arvode)</span></td>
                    <td className="py-4 text-right text-slate-600">{entry.hours} h</td>
                    <td className="py-4 text-right font-medium">{(entry.hours * caseItem.hourlyRate).toLocaleString('sv-SE')} kr</td>
                  </tr>
                ))}
                
                {caseItem.expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-slate-100 bg-slate-50/50">
                    <td className="py-4 text-slate-600">{new Date(expense.createdAt).toLocaleDateString('sv-SE')}</td>
                    <td className="py-4 font-medium">{expense.description} <span className="text-xs text-amber-600 ml-2">(Utlägg)</span></td>
                    <td className="py-4 text-right text-slate-600">-</td>
                    <td className="py-4 text-right font-medium">{expense.amount.toLocaleString('sv-SE')} kr</td>
                  </tr>
                ))}

                {caseItem.timeEntries.length === 0 && caseItem.expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic border-b border-slate-100">
                      Inga poster registrerade på detta ärende ännu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Arvode (exkl. moms):</span>
                  <span>{subTotalTime.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Moms på arvode (25%):</span>
                  <span>{vat.toLocaleString('sv-SE')} kr</span>
                </div>
                {totalExpenses > 0 && (
                  <div className="flex justify-between py-2 text-slate-600 border-t border-slate-100 mt-2 pt-2">
                    <span>Utlägg (Momsfritt):</span>
                    <span>{totalExpenses.toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                <div className="flex justify-between py-4 text-xl font-black text-slate-900 border-t-2 border-slate-800 mt-2">
                  <span>ATT BETALA:</span>
                  <span>{total.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>
            </div>
          </div>

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