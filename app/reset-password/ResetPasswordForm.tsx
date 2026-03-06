'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!token) {
    return (
      <div className="text-center">
        <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ogiltig länk</h2>
        <p className="text-slate-600 mb-8">Ingen återställningstoken hittades i URL:en.</p>
        <Link href="/forgot-password" className="text-blue-600 font-bold hover:underline">Begär en ny länk här</Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Lösenorden matchar inte.')
      return
    }
    
    if (password.length < 6) {
      setStatus('error')
      setMessage('Lösenordet måste vara minst 6 tecken långt.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('Ditt lösenord har uppdaterats framgångsrikt!')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Länken är ogiltig eller har gått ut.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Ett nätverksfel uppstod.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Lösenord uppdaterat!</h2>
        <p className="text-slate-600 font-medium mb-8">Du skickas nu vidare till inloggningen...</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 text-center mb-2">Välj nytt lösenord</h1>
      <p className="text-slate-500 font-medium text-center mb-8">Skriv in ditt nya önskade lösenord nedan.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nytt lösenord</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              className="w-full border-2 border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 transition font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Bekräfta nytt lösenord</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Skriv lösenordet igen"
              className="w-full border-2 border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 transition font-medium"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {status === 'loading' ? 'Sparar...' : 'Spara nytt lösenord'} <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </>
  )
}