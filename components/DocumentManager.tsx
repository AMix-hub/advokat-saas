'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DocumentItem {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
}

export default function DocumentManager({ caseId, documents }: { caseId: string, documents: DocumentItem[] }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Vi måste använda FormData för att skicka filer
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`/api/cases/${caseId}/documents`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        // Fil uppladdad! Ladda om datan osynligt
        router.refresh()
      } else {
        alert("Något gick fel vid uppladdningen.")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
      // Återställ input-fältet så man kan ladda upp samma fil igen om man vill
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Dokument & Filer</h2>
        
        {/* En dold input för filuppladdning som vi "klickar på" med en snyggare label */}
        <label className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition">
          {isUploading ? 'Laddar upp...' : '+ Ladda upp PDF'}
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.png" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {documents.length === 0 ? (
        <p className="text-slate-500 italic text-sm">Inga dokument har laddats upp ännu.</p>
      ) : (
        <ul className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
          {documents.map((doc) => (
            <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.5L18.5 9H13V4.5zM6 20V4h6v6h6v10H6z"/></svg>
                <span className="font-medium text-slate-700">{doc.name}</span>
              </div>
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded"
              >
                Öppna
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}