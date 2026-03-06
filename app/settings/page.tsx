'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import { Settings as SettingsIcon, Image as ImageIcon, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [firmName, setFirmName] = useState('')
  const [bankgiro, setBankgiro] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.user) {
        setName(data.user.name || '')
        setFirmName(data.user.firmName || '')
        setBankgiro(data.user.bankgiro || '')
        setLogo(data.user.logo || null)
      }
    })
  }, [])

  // Hanterar bilduppladdning och konverterar till Base64-text så databasen kan spara den
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ name, firmName, bankgiro, logo })
    })

    setIsSubmitting(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md">
              <SettingsIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Inställningar</h1>
              <p className="text-slate-500 font-medium">Byråprofil och White Labeling</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            
            {/* LOGOTYP / WHITE LABEL */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" /> Byråns Logotyp
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                  ) : (
                    <span className="text-slate-400 text-sm font-medium text-center px-2">Ingen logga</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-4">Ladda upp byråns logotyp. Denna kommer automatiskt att ersätta CaseCore-ikonen på Klientportaler och PDF-fakturor.</p>
                  <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition shadow-sm inline-block">
                    Välj bildfil...
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {logo && (
                    <button type="button" onClick={() => setLogo(null)} className="ml-3 text-red-600 text-sm font-bold hover:underline">Ta bort logga</button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ditt Namn</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Byråns Namn</label>
                <input type="text" value={firmName} onChange={(e) => setFirmName(e.target.value)} required className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Betalningsuppgifter (Bankgiro/Plusgiro)</label>
                <input type="text" value={bankgiro} onChange={(e) => setBankgiro(e.target.value)} placeholder="T.ex. BG 123-4567" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                <p className="text-xs text-slate-500 mt-2">Dessa uppgifter syns längst ner på fakturaunderlagen.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center">
                {isSubmitting ? 'Sparar...' : 'Spara inställningar'}
              </button>
              {saved && <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse"><CheckCircle2 className="w-5 h-5" /> Sparat!</span>}
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}