'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, AlertTriangle } from 'lucide-react'

interface Deadline {
  id: string
  title: string
  dueDate: string
  type: string
  isCompleted: boolean
  case: {
    id: string
    title: string
  }
}

export default function UpcomingDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const res = await fetch('/api/deadlines?isCompleted=false')
        if (res.ok) {
          const data = await res.json()
          // Sortera och ta de 5 närmaste
          const sorted = data.sort((a: any, b: any) => 
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          ).slice(0, 5)
          setDeadlines(sorted)
        }
      } catch (error) {
        console.error('Error fetching deadlines:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeadlines()
  }, [])

  if (loading) {
    return <div className="text-slate-500 text-center py-4">Laddar deadlines...</div>
  }

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Inga kommande deadlines</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {deadlines.map((deadline) => {
        const daysUntil = Math.ceil(
          (new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
        const isUrgent = daysUntil <= 7 && daysUntil > 0
        const isOverdue = daysUntil <= 0

        return (
          <Link
            key={deadline.id}
            href={`/cases/${deadline.case.id}`}
            className={`p-3 rounded-lg border-2 transition cursor-pointer hover:shadow-md ${
              isOverdue
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : isUrgent
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{deadline.title}</div>
                <div className="text-xs opacity-75 truncate">{deadline.case.title}</div>
              </div>
              {isUrgent && <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            </div>
            <div className="text-xs font-semibold mt-2">
              {isOverdue ? (
                <span className="text-red-600">⚠️ Förfallen</span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{new Date(deadline.dueDate).toLocaleDateString('sv-SE')}</span>
                  {isUrgent && <span className="ml-1 font-bold text-amber-600">{daysUntil}d</span>}
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
