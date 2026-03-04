'use client'
import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('admin@advokat.se')
  const [password, setPassword] = useState('advokat123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const authError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    })

    if (res?.error) {
      setError('Fel e-postadress eller lösenord. Försök igen.')
      setIsSubmitting(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-2xl text-white">🏛️</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Case<span className="text-blue-600">Core</span>
          </h1>
        </div>
        <p className="text-slate-500 font-medium">Säker inloggning för jurister</p>
      </div>

      {(error || authError) && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mb-6 text-sm font-semibold text-center animate-pulse">
          {error || 'Ett fel uppstod vid inloggningen.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">E-postadress</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din.epost@firma.se"
            className="w-full border border-slate-300 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Lösenord</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-300 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm transition"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:bg-slate-400 shadow-md"
        >
          {isSubmitting ? 'Verifierar uppgifter...' : 'Logga in'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-10 font-medium">
        &copy; {new Date().getFullYear()} CaseCore Legal Technology
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Suspense fallback={<div className="animate-pulse font-bold text-slate-500">Laddar säker inloggning...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}