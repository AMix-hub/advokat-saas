'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, CreditCard } from 'lucide-react'

export default function CaseControls({ caseItem }: { caseItem: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [invoiceStatus, setInvoiceStatus] = useState(caseItem.invoiceStatus || 'UNBILLED')
  const [isSavingStatus, setIsSavingStatus] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Är du helt säker på att du vill radera detta ärende? All loggad tid, uppgifter och historik försvinner.')) return
    setIsDeleting(true)
    const res = await fetch(`/api/cases/${caseItem.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setIsDeleting(false)
    }
  }

  const handleInvoiceStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setInvoiceStatus(newStatus)
    setIsSavingStatus(true)
    
    await fetch(`/api/cases/${caseItem.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ invoiceStatus: newStatus })
    })
    
    setIsSavingStatus(false)
    router.refresh()
  }

  return (
    <div className="space-y-6 print:hidden">
      
      {/* FAKTURASTASUS (SÄLJFUNKTION) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" /> Faktureringsstatus
        </h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Håll koll på byråns kassaflöde genom att markera när ärendet är fakturerat.
        </p>
        
        <select 
          value={invoiceStatus}
          onChange={handleInvoiceStatusChange}
          disabled={isSavingStatus}
          className={`w-full p-3 rounded-xl font-bold border-2 focus:outline-none transition appearance-none cursor-pointer ${
            invoiceStatus === 'UNBILLED' ? 'border-slate-300 bg-slate-50 text-slate-700' :
            invoiceStatus === 'SENT' ? 'border-amber-400 bg-amber-50 text-amber-800' :
            'border-emerald-400 bg-emerald-50 text-emerald-800'
          }`}
        >
          <option value="UNBILLED">⏳ Ej fakturerat</option>
          <option value="SENT">✉️ Faktura skickad (Väntar betalning)</option>
          <option value="PAID">✅ Betald & Klar</option>
        </select>
        {isSavingStatus && <p className="text-xs text-slate-400 mt-2 italic text-center">Uppdaterar...</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Farlig zon</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Behöver du ta bort ärendet helt? Observera att detta inte går att ångra.
        </p>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" /> {isDeleting ? 'Raderar...' : 'Radera ärende'}
        </button>
      </div>
    </div>
  )
}