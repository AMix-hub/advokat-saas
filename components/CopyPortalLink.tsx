'use client'
import { useState } from 'react'

export default function CopyPortalLink({ caseId }: { caseId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // Genererar den fullständiga länken baserat på vilken domän du är på (t.ex. localhost eller din Vercel-domän)
    const url = `${window.location.origin}/portal/${caseId}`
    
    navigator.clipboard.writeText(url)
    setCopied(true)
    
    // Återställ knappen efter 2 sekunder
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm flex items-center gap-2 border ${
        copied 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
      }`}
    >
      {copied ? '✅ Länken kopierad!' : '🔗 Kopiera Klientlänk'}
    </button>
  )
}