'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, UploadCloud, File, Download, Loader2 } from 'lucide-react'

export default function DocumentManager({ caseId, documents }: { caseId: string, documents: any[] }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Förbereder krypterad överföring...')

    try {
      // 1. Be servern om en säker Amazon-nyckel
      const urlRes = await fetch('/api/documents/upload-url', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name, contentType: file.type, caseId })
      })
      
      const { signedUrl, fileUrl, error } = await urlRes.json()
      
      if (error) {
        alert(error)
        setIsUploading(false)
        return
      }

      setUploadStatus('Laddar upp filen till säkert bankvalv...')

      // 2. Ladda upp filen direkt till Amazon S3 (utan att belasta din webbserver)
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })

      setUploadStatus('Sparar i akten...')

      // 3. Spara informationen i Neon-databasen
      await fetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify({ name: file.name, url: fileUrl, caseId })
      })

      setUploadStatus('')
      setIsUploading(false)
      router.refresh()
      
    } catch (err) {
      alert('Något gick fel vid uppladdningen. Kontrollera nätverket.')
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 sm:p-8 mt-6 sm:mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" /> Aktbilagor & Dokument
        </h2>
      </div>
      
      {/* Uppladdningszon */}
      <div className="mb-8">
        <label className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition cursor-pointer ${isUploading ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white/[0.04] border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40'}`}>
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
              <p className="font-bold text-slate-300">{uploadStatus}</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
              <p className="font-bold text-slate-300 mb-1">Klicka för att ladda upp bevisning eller avtal</p>
              <p className="text-xs text-slate-500">PDF, Word eller bildfiler. Krypterad överföring.</p>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      {/* Dokumentlista */}
      <ul className="space-y-3">
        {documents.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm font-medium border border-white/[0.06] rounded-xl bg-white/[0.04]">
            Inga dokument uppladdade ännu.
          </div>
        )}
        {documents.map(doc => (
          <li key={doc.id} className="flex justify-between items-center p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:shadow-sm hover:border-indigo-500/30 transition group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg flex-shrink-0">
                <File className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-100 truncate">{doc.name}</p>
                <p className="text-xs text-slate-500 font-medium">{new Date(doc.createdAt).toLocaleDateString('sv-SE')}</p>
              </div>
            </div>
            
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white/[0.08] text-slate-400 p-2 rounded-lg font-bold hover:bg-indigo-500/20 hover:text-indigo-400 transition flex items-center gap-1 flex-shrink-0 ml-4"
              title="Ladda ner"
            >
              <Download className="w-4 h-4" /> <span className="hidden sm:inline text-sm">Öppna</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}