'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TemplateBuilder() {
  const [templates, setTemplates] = useState<any[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hämta befintliga mallar
  const fetchTemplates = async () => {
    const res = await fetch('/api/custom-templates')
    const data = await res.json()
    if (Array.isArray(data)) setTemplates(data)
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch('/api/custom-templates', {
      method: 'POST',
      body: JSON.stringify({ name, content })
    })

    if (res.ok) {
      setName('')
      setContent('')
      fetchTemplates()
    }
    setIsSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2 transition bg-blue-500/10 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Vänster: Formulär för att bygga mall */}
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
            <h1 className="text-2xl font-extrabold text-white mb-2">Skapa egen mall</h1>
            <p className="text-slate-400 mb-6 text-sm">
              Använd koderna nedan i din text. När mallen används på ett ärende kommer koderna automatiskt bytas ut mot riktig information.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex flex-wrap gap-2 text-xs font-bold font-mono text-blue-300">
              <span className="bg-white/[0.08] px-2 py-1 rounded border border-blue-500/20 text-blue-300">{'{{KLIENT}}'}</span>
              <span className="bg-white/[0.08] px-2 py-1 rounded border border-blue-500/20 text-blue-300">{'{{ORGNR}}'}</span>
              <span className="bg-white/[0.08] px-2 py-1 rounded border border-blue-500/20 text-blue-300">{'{{ÄRENDE}}'}</span>
              <span className="bg-white/[0.08] px-2 py-1 rounded border border-blue-500/20 text-blue-300">{'{{BYRÅ}}'}</span>
              <span className="bg-white/[0.08] px-2 py-1 rounded border border-blue-500/20 text-blue-300">{'{{DATUM}}'}</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Mallens namn</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="T.ex. Samboavtal Standard"
                  className="w-full border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none bg-white/[0.05] text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Avtalstext / Innehåll</label>
                <textarea 
                  value={content} onChange={(e) => setContent(e.target.value)} required rows={12}
                  placeholder="Härmed avtalar {{KLIENT}} och byrån {{BYRÅ}} följande angående {{ÄRENDE}}..."
                  className="w-full border border-white/10 p-3 rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none font-serif bg-white/[0.05] text-white" 
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sparar...' : 'Spara mall till biblioteket'}
              </button>
            </form>
          </div>

          {/* Höger: Lista över skapade mallar */}
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Era sparade mallar</h2>
            {templates.length === 0 ? (
              <p className="text-slate-500 italic text-sm">Inga egna mallar har skapats ännu.</p>
            ) : (
              <div className="space-y-3">
                {templates.map(t => (
                  <div key={t.id} className="p-4 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                    <h3 className="font-bold text-slate-100">{t.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Skapad: {new Date(t.createdAt).toLocaleDateString('sv-SE')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}