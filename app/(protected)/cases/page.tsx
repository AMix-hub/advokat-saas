export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Briefcase, Plus, Clock, AlertCircle } from 'lucide-react'
import { statusLabel, caseTypeLabel } from '@/lib/status'

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'CLOSED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'ARCHIVED': return 'bg-white/10 text-slate-300 border-white/20'
    default: return 'bg-white/[0.05] text-slate-300 border-white/10'
  }
}

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    include: {
      client: true,
      timeEntries: true,
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Ärenden</h1>
                <p className="text-slate-500 text-sm">Totalt {cases.length} ärenden</p>
              </div>
            </div>
            <Link
              href="/cases/new"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nytt ärende
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-white/[0.08]">
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Ärende</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Klient</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Kategori</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Timmar</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                      Inga ärenden upplagda ännu.
                    </td>
                  </tr>
                ) : (
                  cases.map(caseItem => {
                    const totalHours = caseItem.timeEntries.reduce((acc, t) => acc + t.hours, 0)
                    return (
                      <tr key={caseItem.id} className="border-b border-white/[0.05] hover:bg-white/[0.05] transition group">
                        <td className="py-4 px-4 font-bold text-white">{caseItem.title}</td>
                        <td className="py-4 px-4 text-slate-400">{caseItem.client.name}</td>
                        <td className="py-4 px-4 text-slate-400">{caseTypeLabel(caseItem.caseType)}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {totalHours.toFixed(1)} h
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${getStatusBadge(caseItem.status)}`}>
                            {caseItem.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                            {statusLabel(caseItem.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/cases/${caseItem.id}`}
                            className="text-sm font-bold text-blue-400 hover:text-blue-300 bg-white/[0.08] border border-white/[0.08] px-4 py-2 rounded-lg transition group-hover:border-blue-500/30 inline-block"
                          >
                            Öppna &rarr;
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}
