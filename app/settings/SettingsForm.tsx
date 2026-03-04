'use client'
import { useState } from 'react'

export default function SettingsForm({ 
  initialName, 
  initialFirmName 
}: { 
  initialName: string, 
  initialFirmName: string 
}) {
  const [name, setName] = useState(initialName)
  const [firmName, setFirmName] = useState(initialFirmName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)

    const res = await fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ name, firmName })
    })

    if (res.ok) {
      setShowSuccess(true)
      // Tvingar fönstret att ladda om så att toppmenyn hämtar det nya namnet direkt
      window.location.reload()
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Ditt namn (Handläggare)</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-50 text-slate-900 shadow-inner"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Advokatbyråns namn</label>
        <input 
          type="text" 
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-50 text-slate-900 shadow-inner"
          required
        />
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 shadow-sm"
        >
          {isSubmitting ? 'Sparar...' : 'Spara inställningar'}
        </button>
        
        {showSuccess && (
          <span className="text-emerald-600 font-bold animate-pulse">
            ✅ Inställningarna har sparats!
          </span>
        )}
      </div>
    </form>
  )
}