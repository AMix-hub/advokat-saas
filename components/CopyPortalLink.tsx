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
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/[0.08]'
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