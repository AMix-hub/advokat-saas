'use client'
import { useState } from 'react'
import { Link as LinkIcon, CheckCircle2 } from 'lucide-react'

export default function CopyPortalLink({ caseId }: { caseId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = `${window.location.origin}/portal/${caseId}`
    
    navigator.clipboard.writeText(url)
    setCopied(true)
    
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
      {copied ? (
        <><CheckCircle2 className="w-4 h-4" /> Länken kopierad!</>
      ) : (
        <><LinkIcon className="w-4 h-4" /> Kopiera Klientlänk</>
      )}
    </button>
  )
}