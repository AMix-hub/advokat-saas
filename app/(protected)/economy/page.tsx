export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Wallet, TrendingUp, CheckCircle, Clock } from 'lucide-react'

export default async function EconomyPage() {
  const cases = await prisma.case.findMany({
    include: { client: true, timeEntries: true, expenses: true },
    orderBy: { updatedAt: 'desc' }
  })

  // Gruppera ärenden och räkna värden
  const unbilled: any[] = []
  const sent: any[] = []
  const paid: any[] = []
  let totalUnbilled = 0, totalSent = 0, totalPaid = 0

  cases.forEach(c => {
    const val = c.expenses.reduce((a, b) => a + b.amount, 0) + (c.timeEntries.reduce((a, b) => a + b.hours, 0) * c.hourlyRate)
    
    if (c.invoiceStatus === 'UNBILLED') { unbilled.push(c); totalUnbilled += val }
    else if (c.invoiceStatus === 'SENT') { sent.push(c); totalSent += val }
    else if (c.invoiceStatus === 'PAID') { paid.push(c); totalPaid += val }
  })

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Ekonomi & Kassaflöde</h1>
              <p className="text-slate-500 font-medium">Överblick över byråns fakturering och innestående värden.</p>
            </div>
          </div>
        </div>

        {/* Ekonomiska summeringar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 rounded-2xl p-6 border-b-4 border-white/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ej Fakturerat</p>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalUnbilled.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-slate-400 mt-2">{unbilled.length} ärenden ligger och väntar</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border-b-4 border-amber-500/50">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Skickade Fakturor</p>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-amber-600">{totalSent.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-amber-500 mt-2">{sent.length} ärenden väntar på betalning</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border-b-4 border-emerald-500/50">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Inbetalt & Klart</p>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-emerald-700">{totalPaid.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-emerald-600 mt-2">{paid.length} avslutade fakturor</p>
          </div>
        </div>

        {/* Lista över Skickade & Obetalda */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Kundreskontra (Fakturor som väntar på betalning)
          </h2>
          
          {sent.length === 0 ? (
            <div className="text-center py-10 bg-white/[0.04] rounded-xl border border-dashed border-white/[0.08]">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">Inga obetalda fakturor!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sent.map(c => {
                const val = c.expenses.reduce((a:any, b:any) => a + b.amount, 0) + (c.timeEntries.reduce((a:any, b:any) => a + b.hours, 0) * c.hourlyRate)
                return (
                  <Link key={c.id} href={`/cases/${c.id}`} className="flex justify-between items-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition group">
                    <div>
                      <h3 className="font-bold text-amber-200 group-hover:text-amber-300 transition">{c.title}</h3>
                      <p className="text-sm text-amber-700 mt-0.5">Klient: {c.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-amber-700">{val.toLocaleString('sv-SE')} kr</p>
                      <p className="text-xs font-bold text-amber-600 uppercase bg-amber-500/20 px-2 py-1 rounded inline-block mt-1">Väntar Betalning</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}