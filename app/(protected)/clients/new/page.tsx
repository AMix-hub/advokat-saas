'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewClientPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [orgNr, setOrgNr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const res = await fetch('/api/clients', {
      method: 'POST',
      body: JSON.stringify({ name, email, orgNr })
    })

    if (res.ok) {
      router.push('/clients')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Något gick fel. Försök igen.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/clients" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-2 transition bg-blue-500/10 px-4 py-2 rounded-lg">
            &larr; Tillbaka till klientregistret
          </Link>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Lägg till ny klient</h1>
          <p className="text-slate-400 mb-8">Fyll i kontaktuppgifter för den nya klienten.</p>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Klientens namn / Företagsnamn</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">E-postadress</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Organisationsnummer / Personnummer</label>
              <input 
                type="text" 
                value={orgNr}
                onChange={(e) => setOrgNr(e.target.value)}
                placeholder="Valfritt"
                className="w-full border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500"
              />
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 shadow-sm w-full md:w-auto"
              >
                {isSubmitting ? 'Sparar...' : 'Spara klient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}