export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Clock, Briefcase, Calendar } from 'lucide-react'

export default async function TimePage() {
  const timeEntries = await prisma.timeEntry.findMany({
    include: {
      case: {
        include: { client: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const totalHours = timeEntries.reduce((acc, entry) => acc + entry.hours, 0)

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Tidsregistrering</h1>
            <p className="text-slate-500 font-medium">Totalt {totalHours.toFixed(1)} timmar registrerade</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
          {timeEntries.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-indigo-400 opacity-50" />
              <p className="text-lg font-bold">Ingen tid registrerad ännu</p>
              <p className="text-sm">Registrera tid direkt på ett ärende för att se det här.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {timeEntries.map(entry => (
                <div key={entry.id} className="p-5 sm:p-6 hover:bg-white/[0.05] transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{entry.description || 'Utan beskrivning'}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{entry.case.title} — {entry.case.client.name}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-sm text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.createdAt).toLocaleDateString('sv-SE')}
                    </div>
                    <span className="text-lg font-black text-indigo-600 whitespace-nowrap">{entry.hours.toFixed(1)} h</span>
                    <Link
                      href={`/cases/${entry.caseId}`}
                      className="bg-white/[0.08] text-slate-300 hover:bg-white/[0.15] px-3 py-1.5 rounded-lg font-bold text-sm transition whitespace-nowrap"
                    >
                      Visa ärende
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
