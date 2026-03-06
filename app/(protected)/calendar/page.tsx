export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import CalendarView from '@/components/CalendarView'

export default async function CalendarPage() {
  const [deadlines, tasks] = await Promise.all([
    prisma.deadline.findMany({
      include: { case: { select: { id: true, title: true } } },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.task.findMany({
      where: { dueDate: { not: null } },
      include: { case: { select: { id: true, title: true } } },
      orderBy: { dueDate: 'asc' },
    }),
  ])

  const now = new Date()

  const events = [
    ...deadlines.map(d => ({
      id: `dl-${d.id}`,
      title: d.title,
      caseId: d.case.id,
      caseTitle: d.case.title,
      date: d.dueDate.toISOString().slice(0, 10),
      kind: 'DEADLINE' as const,
      isCompleted: d.isCompleted,
      isOverdue: !d.isCompleted && d.dueDate < now,
      deadlineType: d.type,
    })),
    ...tasks
      .filter(t => t.dueDate !== null)
      .map(t => ({
        id: `tk-${t.id}`,
        title: t.title,
        caseId: t.case.id,
        caseTitle: t.case.title,
        date: t.dueDate!.toISOString().slice(0, 10),
        kind: 'TASK' as const,
        isCompleted: t.isCompleted,
        isOverdue: !t.isCompleted && t.dueDate! < now,
        deadlineType: undefined,
      })),
  ]

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1.5 transition bg-blue-50 px-3 py-2 rounded-lg text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shadow-sm">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Kalender</h1>
            <p className="text-slate-500 text-sm font-medium">
              Deadlines och uppgifter över alla ärenden
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <CalendarView events={events} />
        </div>

      </div>
    </main>
  )
}
