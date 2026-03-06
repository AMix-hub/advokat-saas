'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TaskList({ caseId, tasks }: { caseId: string, tasks: any[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setIsSubmitting(true)
    await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, dueDate, caseId })
    })
    setTitle('')
    setDueDate('')
    setIsSubmitting(false)
    router.refresh()
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      body: JSON.stringify({ id, isCompleted: !currentStatus })
    })
    router.refresh()
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Radera uppgiften?')) return
    await fetch('/api/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
    router.refresh()
  }

  // Sortering: Ogjorda uppgifter hamnar högst upp. Därefter sorterat på närmaste förfallodatum.
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
        return new Date(a.dueDate || a.createdAt).getTime() - new Date(b.dueDate || b.createdAt).getTime()
    }
    return a.isCompleted ? 1 : -1
  })

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Att-göra & Deadlines</h2>
      
      <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Vad behöver göras? (T.ex. Inkomma med svaromål)" 
          className="flex-1 border border-white/10 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white" 
          required 
        />
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="border border-white/10 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white" 
        />
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 whitespace-nowrap"
        >
          {isSubmitting ? 'Sparar...' : 'Lägg till'}
        </button>
      </form>

      <ul className="space-y-3">
        {sortedTasks.length === 0 && <p className="text-slate-500 italic">Inga inplanerade uppgifter ännu.</p>}
        {sortedTasks.map(task => {
          const isOverdue = task.dueDate && !task.isCompleted && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
          
          return (
            <li key={task.id} className={`flex items-center justify-between p-3 rounded-lg border transition ${task.isCompleted ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/[0.04] border-white/[0.08]'}`}>
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={task.isCompleted} 
                  onChange={() => toggleTask(task.id, task.isCompleted)} 
                  className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <p className={`font-semibold ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className={`text-xs mt-1 font-bold ${task.isCompleted ? 'text-slate-400' : (isOverdue ? 'text-red-600' : 'text-blue-600')}`}>
                      {isOverdue ? '⚠️ Försenad: ' : '⏳ Deadline: '} 
                      {new Date(task.dueDate).toLocaleDateString('sv-SE')}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-600 font-bold px-3 py-1 text-xl transition">
                &times;
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}