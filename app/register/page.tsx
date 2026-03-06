'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, User, Mail, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    firmName: '',
    email: '',
    password: '',
    inviteCode: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('Ditt konto är nu skapat! Du skickas till inloggningen...')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Något gick fel.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Ett nätverksfel uppstod.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Välkommen till CaseCore!</h2>
          <p className="text-slate-600 font-medium">{message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-2">Aktivera licens</h1>
        <p className="text-slate-500 font-medium text-center mb-8">Fyll i dina uppgifter och din licenskod för att sätta upp byråns konto.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" /> {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Ditt namn</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="För- och efternamn" className="w-full border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 font-medium" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Advokatbyråns namn</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} placeholder="Advokatbyrån AB" className="w-full border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 font-medium" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">E-postadress (Inloggning)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="advokat@byran.se" className="w-full border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 font-medium" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Välj lösenord</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minst 6 tecken" className="w-full border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 font-medium" required minLength={6} />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Licenskod</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="inviteCode" value={formData.inviteCode} onChange={handleChange} placeholder="T.ex. CASECORE2026" className="w-full border-2 border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 font-bold uppercase" required />
            </div>
          </div>

          <button type="submit" disabled={status === 'loading'} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-4">
            {status === 'loading' ? 'Skapar konto...' : 'Aktivera konto'} <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition">
              Har du redan ett konto? Logga in
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}