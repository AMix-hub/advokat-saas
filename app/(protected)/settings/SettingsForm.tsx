'use client'
import { useState } from 'react'

export default function SettingsForm({ 
  initialName, 
  initialFirmName,
  initialBankgiro
}: { 
  initialName: string, 
  initialFirmName: string,
  initialBankgiro: string
}) {
  const [name, setName] = useState(initialName)
  const [firmName, setFirmName] = useState(initialFirmName)
  const [bankgiro, setBankgiro] = useState(initialBankgiro)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccess(false)

    const res = await fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ name, firmName, bankgiro })
    })

    if (res.ok) {
      setShowSuccess(true)
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
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Advokatbyråns namn</label>
        <input 
          type="text" 
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
          required
        />
      </div>

      {/* NYTT FÄLT: Bankgiro / Plusgiro */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Bankgiro / Plusgiro</label>
        <input 
          type="text" 
          value={bankgiro}
          onChange={(e) => setBankgiro(e.target.value)}
          placeholder="T.ex. 123-4567"
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-2">Detta kommer att visas längst ner på dina fakturaunderlag.</p>
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