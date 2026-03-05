'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CaseControls({ caseItem }: { caseItem: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Är du helt säker på att du vill radera detta ärende? All loggad tid, uppgifter och historik kommer att försvinna permanent.')) return
    
    setIsDeleting(true)
    const res = await fetch(`/api/cases/${caseItem.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setIsDeleting(false)
      alert('Något gick fel. Kunde inte radera ärendet.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 print:hidden">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Farlig zon</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Behöver du ta bort ärendet helt? Observera att detta inte går att ångra.
      </p>
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition disabled:opacity-50 shadow-sm"
      >
        {isDeleting ? 'Raderar...' : '🗑️ Radera ärende'}
      </button>
    </div>
  )
}