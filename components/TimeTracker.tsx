'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TimeEntry {
  id: string;
  description: string;
  hours: number;
  createdAt: Date;
}

export default function TimeTracker({ caseId, timeEntries }: { caseId: string, timeEntries: TimeEntry[] }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !hours) return
    setIsSubmitting(true)

    await fetch(`/api/cases/${caseId}/time`, {
      method: 'POST',
      body: JSON.stringify({ description, hours }),
    })

    setDescription('')
    setHours('')
    setIsSubmitting(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Tidrapportering</h2>
        <div className="text-right">
          <span className="block text-sm text-slate-500 uppercase font-bold tracking-wider">Totalt nedlagt</span>
          <span className="text-2xl font-black text-blue-600">{totalHours.toFixed(1)} h</span>
        </div>
      </div>

      <form onSubmit={handleTimeSubmit} className="flex gap-3 mb-6">
        <input 
          type="text" 
          placeholder="Vad har gjorts?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
        <input 
          type="number" 
          step="0.1" 
          min="0.1" 
          placeholder="Timmar" 
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-24 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-5 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Logga tid'}
        </button>
      </form>

      {timeEntries.length > 0 && (
        <div className="max-h-60 overflow-y-auto pr-2">
          <ul className="space-y-3">
            {timeEntries.map(entry => (
              <li key={entry.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">{entry.description}</p>
                  <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleDateString('sv-SE')}</p>
                </div>
                <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded shadow-sm border border-slate-200">
                  {entry.hours} h
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}