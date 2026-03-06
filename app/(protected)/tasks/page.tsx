export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckSquare, Calendar, Briefcase, ArrowRight } from 'lucide-react'

export default async function GlobalTasksPage() {
  const allTasks = await prisma.task.findMany({
    where: { isCompleted: false },
    include: { case: { include: { client: true } } },
    orderBy: { dueDate: 'asc' }
  })

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Mina Uppgifter</h1>
            <p className="text-slate-500 font-medium">Byråns samlade deadlines och att-göra över alla ärenden.</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
          {allTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 text-emerald-400 opacity-50" />
              <p className="text-lg font-bold">Allt är avklarat!</p>
              <p className="text-sm">Du har inga väntande uppgifter på några ärenden.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {allTasks.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
                
                return (
                  <div key={task.id} className="p-6 hover:bg-white/[0.05] transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-bold text-lg ${isOverdue ? 'text-red-600' : 'text-white'}`}>{task.title}</h3>
                        {isOverdue && <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase">Försenad</span>}
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> {task.case.title} <span className="opacity-50">|</span> Klient: {task.case.client.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                      {task.dueDate ? (
                        <div className={`text-sm font-bold flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(task.dueDate).toLocaleDateString('sv-SE')}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400 italic">Inget datum</div>
                      )}
                      
                      <Link href={`/cases/${task.caseId}`} className="bg-white/[0.08] text-slate-300 hover:bg-white/[0.15] px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-1">
                        Till ärendet <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}