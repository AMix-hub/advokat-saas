'use client'
import { useEffect, useState } from 'react'
import { Calendar, AlertCircle, CheckCircle, Trash2, Edit2 } from 'lucide-react'

interface Deadline {
  id: string
  title: string
  description?: string
  dueDate: string
  type: string
  isCompleted: boolean
  case: {
    title: string
    id: string
  }
}

export default function DeadlineManager({ caseId }: { caseId?: string }) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [newDeadline, setNewDeadline] = useState({ title: '', dueDate: '', type: 'REMINDER' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchDeadlines()
  }, [caseId])

  const fetchDeadlines = async () => {
    try {
      const url = caseId ? `/api/deadlines?caseId=${caseId}` : '/api/deadlines'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setDeadlines(data)
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseId) return

    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeadline,
          caseId
        })
      })

      if (res.ok) {
        setNewDeadline({ title: '', dueDate: '', type: 'REMINDER' })
        setShowForm(false)
        fetchDeadlines()
      }
    } catch (error) {
      console.error('Error creating deadline:', error)
    }
  }

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !isCompleted })
      })

      if (res.ok) {
        fetchDeadlines()
      }
    } catch (error) {
      console.error('Error updating deadline:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker?')) return

    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchDeadlines()
      }
    } catch (error) {
      console.error('Error deleting deadline:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LAW_DEADLINE':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'COURT_DATE':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'REMINDER':
        return 'bg-amber-50 border-amber-200 text-amber-700'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'LAW_DEADLINE':
        return '⚖️ Juridisk deadline'
      case 'COURT_DATE':
        return '📅 Domstolsförhandling'
      case 'REMINDER':
        return '🔔 Påminnelse'
      default:
        return '📌 Övrigt'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !deadlines.find(d => d.id && new Date(d.dueDate) < new Date() && d.isCompleted)
  }

  if (loading) {
    return <div className="text-slate-500">Laddar deadlines...</div>
  }

  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  const upcomingDeadlines = sortedDeadlines.filter(d => !d.isCompleted)
  const completedDeadlines = sortedDeadlines.filter(d => d.isCompleted)

  return (
    <div className="space-y-6">
      {/* Kommande Deadlines */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Kommande Deadlines
          </h3>
          {caseId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
            >
              + Ny deadline
            </button>
          )}
        </div>

        {showForm && caseId && (
          <form onSubmit={handleCreate} className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titel"
                value={newDeadline.title}
                onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <input
                type="date"
                value={newDeadline.dueDate}
                onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <select
                value={newDeadline.type}
                onChange={(e) => setNewDeadline({ ...newDeadline, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="REMINDER">Påminnelse</option>
                <option value="COURT_DATE">Domstolsförhandling</option>
                <option value="LAW_DEADLINE">Juridisk deadline</option>
                <option value="OTHER">Övrigt</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Skapa
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-400 transition"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </form>
        )}

        {upcomingDeadlines.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Inga kommande deadlines</p>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => {
              const daysUntil = Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              const isUrgent = daysUntil <= 7 && daysUntil > 0

              return (
                <div
                  key={deadline.id}
                  className={`p-4 rounded-lg border-2 ${getTypeColor(deadline.type)} flex justify-between items-start`}
                >
                  <div className="flex-1">
                    <div className="font-bold mb-1">{deadline.title}</div>
                    <div className="text-xs mb-2 opacity-80">
                      {getTypeLabel(deadline.type)}
                    </div>
                    <div className="text-sm font-semibold">
                      📅 {new Date(deadline.dueDate).toLocaleDateString('sv-SE')}
                      {isUrgent && <span className="ml-2 text-red-600">⚠️ {daysUntil} dagar kvar</span>}
                    </div>
                    {deadline.description && (
                      <p className="text-xs mt-2 opacity-75">{deadline.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleComplete(deadline.id, deadline.isCompleted)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Markera som klar"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(deadline.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Ta bort"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Slutförda Deadlines */}
      {completedDeadlines.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Slutförda
          </h3>
          <div className="space-y-2">
            {completedDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-3 bg-green-50 border border-green-200 rounded-lg opacity-70">
                <div className="font-semibold text-green-800 line-through">{deadline.title}</div>
                <div className="text-xs text-green-700">
                  ✓ {new Date(deadline.dueDate).toLocaleDateString('sv-SE')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
