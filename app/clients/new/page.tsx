'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'

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
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/clients" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till klientregistret
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Lägg till ny klient</h1>
          <p className="text-slate-600 mb-8">Fyll i kontaktuppgifter för den nya klienten.</p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Klientens namn / Företagsnamn</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-postadress</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Organisationsnummer / Personnummer</label>
              <input 
                type="text" 
                value={orgNr}
                onChange={(e) => setOrgNr(e.target.value)}
                placeholder="Valfritt"
                className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
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