'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Building2, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('Om adressen finns i vårt register har vi skickat en återställningslänk. Kolla din inkorg (och skräpposten).')
      } else {
        setStatus('error')
        setMessage(data.error || 'Något gick fel.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Ett nätverksfel uppstod.')
    }
  }

  return (
    <main className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-2">Glömt lösenordet?</h1>
        <p className="text-slate-500 font-medium text-center mb-8">Fyll i din e-postadress nedan så skickar vi en länk för att återställa det.</p>

        {status === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-700 font-medium mb-8 leading-relaxed">{message}</p>
            <Link href="/login" className="block w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
              Tillbaka till inloggningen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-postadress</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advokat@byran.se"
                  className="w-full border-2 border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 transition font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'loading' ? 'Skickar länk...' : 'Skicka återställningslänk'} <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center mt-6">
              <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition">
                &larr; Tillbaka till inloggningen
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}