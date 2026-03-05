'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TeamClientForm({ firmName, bankgiro }: { firmName: string, bankgiro: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const res = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, firmName, bankgiro })
    })

    if (res.ok) {
      setName('')
      setEmail('')
      setPassword('')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Kunde inte skapa kontot.')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleAddUser} className="space-y-4">
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Namn</label>
        <input 
          type="text" 
          value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">E-postadress</label>
        <input 
          type="email" 
          value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Tillfälligt Lösenord</label>
        <input 
          type="text" 
          value={password} onChange={(e) => setPassword(e.target.value)} required
          placeholder="T.ex. Sommar2026!"
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>
      
      <button 
        type="submit" disabled={isSubmitting}
        className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Skapar...' : 'Skapa användare'}
      </button>
    </form>
  )
}