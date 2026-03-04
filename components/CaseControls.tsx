'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CaseControls({ caseItem }: { caseItem: any }) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const updateStatus = async (newStatus: string) => {
    await fetch(`/api/cases/${caseItem.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'UPDATE_STATUS', status: newStatus })
    })
    router.refresh()
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setIsSubmitting(true)
    await fetch(`/api/cases/${caseItem.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'ADD_LOG', note })
    })
    setNote('')
    setIsSubmitting(false)
    router.refresh()
  }

  const deleteCase = async () => {
    if (!confirm('Är du helt säker? Detta raderar ärendet permanent.')) return
    await fetch(`/api/cases/${caseItem.id}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      
      {/* Åtgärdsknappar */}
      <div className="flex flex-col gap-3">
        <Link 
          href={`/cases/${caseItem.id}/invoice`}
          className="w-full bg-blue-600 text-white text-center rounded-xl py-3 font-bold hover:bg-blue-700 transition shadow-sm"
        >
          📄 Skapa Fakturaunderlag
        </Link>
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full bg-white border border-slate-300 text-slate-700 rounded-xl py-3 font-bold hover:bg-slate-50 transition shadow-sm"
        >
          ✏️ Redigera ärende
        </button>
      </div>

      {/* Box för Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Ärendestatus</h3>
        <select
          value={caseItem.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="OPEN">Öppet (Pågående)</option>
          <option value="PENDING">Väntar på klient/motpart</option>
          <option value="CLOSED">Stängt (Avslutat)</option>
          <option value="ARCHIVED">Arkiverat</option>
        </select>
      </div>

      {/* Box för Logganteckning */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Lägg till i historik</h3>
        <form onSubmit={addNote}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="T.ex. Skickat utkast via e-post..."
            className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
            rows={4}
          />
          <button type="submit" disabled={isSubmitting || !note.trim()} className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 transition disabled:bg-slate-300">
            {isSubmitting ? 'Sparar...' : 'Spara anteckning'}
          </button>
        </form>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-100 p-6 mt-12">
        <h3 className="text-sm font-bold text-red-800 mb-3 uppercase tracking-wider">Farlig Zon</h3>
        <button onClick={deleteCase} className="w-full bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-700 transition shadow-sm">
          Radera ärendet
        </button>
      </div>

      {/* REDIGERA-MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Redigera Ärende</h2>
            <form action={async (formData) => {
              await fetch(`/api/cases/${caseItem.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                  action: 'UPDATE_DETAILS',
                  title: formData.get('title'),
                  description: formData.get('desc'),
                  hourlyRate: formData.get('rate')
                }),
              })
              setShowEditModal(false)
              router.refresh()
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Titel</label>
                <input name="title" defaultValue={caseItem.title} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Beskrivning</label>
                <textarea name="desc" defaultValue={caseItem.description} className="w-full border p-2 rounded" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Timtaxa (SEK)</label>
                <input type="number" name="rate" defaultValue={caseItem.hourlyRate} className="w-full border p-2 rounded" required />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-600">Avbryt</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Spara ändringar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}