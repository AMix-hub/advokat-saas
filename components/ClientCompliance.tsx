'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, AlertOctagon, Trash2 } from 'lucide-react'

export default function ClientCompliance({ client }: { client: any }) {
  const router = useRouter()
  const [kycCompleted, setKycCompleted] = useState(client.kycCompleted)
  const [pepStatus, setPepStatus] = useState(client.pepStatus)
  const [kycNotes, setKycNotes] = useState(client.kycNotes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleKYCSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await fetch(`/api/clients/${client.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'UPDATE_KYC', kycCompleted, pepStatus, kycNotes })
    })
    setIsSubmitting(false)
    router.refresh()
  }

  const handleGDPRAnonymize = async () => {
    if (!confirm('VARNING: Är du säker på att du vill anonymisera klienten enligt GDPR? Namn, org.nr och e-post raderas permanent. Ekonomisk historik behålls.')) return
    
    await fetch(`/api/clients/${client.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'GDPR_ANONYMIZE' })
    })
    router.refresh()
  }

  if (client.isAnonymized) {
    return (
      <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl border border-slate-800 text-center">
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Klienten är anonymiserad</h3>
        <p className="text-sm">Denna klients personuppgifter har raderats i enlighet med dataskyddsförordningen (GDPR).</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Penningtvätt / KYC */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" /> Kundkännedom (KYC)
        </h3>
        <form onSubmit={handleKYCSave} className="space-y-4">
          <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
            <input type="checkbox" checked={kycCompleted} onChange={(e) => setKycCompleted(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
            <span className="font-bold text-slate-700">ID-kontroll genomförd (KYC)</span>
          </label>
          <label className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition">
            <input type="checkbox" checked={pepStatus} onChange={(e) => setPepStatus(e.target.checked)} className="w-5 h-5 text-amber-600 rounded" />
            <span className="font-bold text-amber-900">Politiskt Exponerad Person (PEP)</span>
          </label>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Compliance-anteckningar</label>
            <textarea 
              value={kycNotes} onChange={(e) => setKycNotes(e.target.value)} rows={3}
              placeholder="Dokumentation gällande medlens ursprung etc..."
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" 
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition">
            {isSubmitting ? 'Sparar...' : 'Spara KYC-data'}
          </button>
        </form>
      </div>

      {/* GDPR Rätt att bli glömd */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 flex flex-col justify-center items-center text-center">
        <AlertOctagon className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">GDPR: Rätten att bli glömd</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Om klienten begär att få sina uppgifter raderade klickar du här. Namn och kontaktuppgifter raderas permanent, men statistisk ekonomisk data behålls för bokföringslagen.
        </p>
        <button onClick={handleGDPRAnonymize} className="w-full bg-red-50 text-red-700 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2">
          <Trash2 className="w-5 h-5" /> Anonymisera Klient
        </button>
      </div>
    </div>
  )
}