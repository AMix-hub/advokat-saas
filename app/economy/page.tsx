export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-200">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Ekonomi & Kassaflöde</h1>
          <p className="text-slate-500 font-medium">Överblick över byråns fakturering och innestående värden.</p>
        </div>

        {/* Ekonomiska summeringar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-b-4 border-slate-300 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ej Fakturerat</p>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-900">{totalUnbilled.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-slate-400 mt-2">{unbilled.length} ärenden ligger och väntar</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-b-4 border-amber-400 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Skickade Fakturor</p>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-amber-600">{totalSent.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-amber-500 mt-2">{sent.length} ärenden väntar på betalning</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-b-4 border-emerald-500 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Inbetalt & Klart</p>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-emerald-700">{totalPaid.toLocaleString('sv-SE')} kr</p>
            <p className="text-xs font-bold text-emerald-600 mt-2">{paid.length} avslutade fakturor</p>
          </div>
        </div>

        {/* Lista över Skickade & Obetalda */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Kundreskontra (Fakturor som väntar på betalning)
          </h2>
          
          {sent.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">Inga obetalda fakturor!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sent.map(c => {
                const val = c.expenses.reduce((a:any, b:any) => a + b.amount, 0) + (c.timeEntries.reduce((a:any, b:any) => a + b.hours, 0) * c.hourlyRate)
                return (
                  <Link key={c.id} href={`/cases/${c.id}`} className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100 hover:border-amber-300 transition group">
                    <div>
                      <h3 className="font-bold text-amber-900 group-hover:text-amber-700 transition">{c.title}</h3>
                      <p className="text-sm text-amber-700 mt-0.5">Klient: {c.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-amber-700">{val.toLocaleString('sv-SE')} kr</p>
                      <p className="text-xs font-bold text-amber-600 uppercase bg-amber-200/50 px-2 py-1 rounded inline-block mt-1">Väntar Betalning</p>
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