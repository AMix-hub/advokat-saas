'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditForm({ caseItem }: { caseItem: any }) {
  const router = useRouter()
  const [title, setTitle] = useState(caseItem.title)
  const [description, setDescription] = useState(caseItem.description || '')
  const [status, setStatus] = useState(caseItem.status)
  const [hourlyRate, setHourlyRate] = useState(caseItem.hourlyRate)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch(`/api/cases/${caseItem.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, description, status, hourlyRate })
    })

    if (res.ok) {
      // Tvingar Vercel att hämta ny data, och skickar tillbaka användaren till ärendet
      router.push(`/cases/${caseItem.id}`)
      router.refresh()
    } else {
      setIsSubmitting(false)
      alert('Något gick fel när ärendet skulle sparas.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Ärendets titel</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Beskrivning / Anteckningar</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
          >
            <option value="OPEN">Öppen (Pågående)</option>
            <option value="PENDING">Avvaktar</option>
            <option value="CLOSED">Stängd (Klar)</option>
            <option value="ARCHIVED">Arkiverad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Timtaxa (kr/h)</label>
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
          {isSubmitting ? 'Sparar...' : 'Spara ändringar'}
        </button>
      </div>
    </form>
  )
}