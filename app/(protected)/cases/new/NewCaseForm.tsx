'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCaseForm({ clients, users }: { clients: any[], users: any[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [assignedToId, setAssignedToId] = useState(users[0]?.id || '')
  const [hourlyRate, setHourlyRate] = useState(2000)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch('/api/cases', {
      method: 'POST',
      body: JSON.stringify({ title, description, clientId, assignedToId, hourlyRate })
    })

    if (res.ok) {
      const newCase = await res.json()
      // Skicka användaren direkt in i det nyskapade ärendet!
      router.push(`/cases/${newCase.id}`)
      router.refresh()
    } else {
      setIsSubmitting(false)
      alert('Något gick fel när ärendet skulle skapas.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Välj Klient</label>
        <select 
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
          required
        >
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Ärendets titel / Beskrivning</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Tvist angående avtalsbrott"
          className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Initiala anteckningar</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Kort bakgrund till ärendet..."
          className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Ansvarig Handläggare</label>
          <select 
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Timtaxa för detta ärende (kr/h)</label>
          <input 
            type="number" 
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
            required
            min="0"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/[0.06]">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 shadow-sm w-full md:w-auto"
        >
          {isSubmitting ? 'Skapar akten...' : 'Skapa ärende'}
        </button>
      </div>
    </form>
  )
}