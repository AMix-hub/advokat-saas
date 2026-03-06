'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError('Felaktig e-postadress eller lösenord.')
      setIsLoading(false)
    } else {
      // Ändra från '/' till '/dashboard'
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex bg-white font-sans">
      
      {/* VÄNSTER SIDA - Formuläret */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24">
        <div className="max-w-md w-full mx-auto">
          
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Case<span className="text-blue-600">Core</span></span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2">Välkommen tillbaka</h1>
          <p className="text-slate-500 font-medium mb-8">Logga in för att komma åt byråns arbetsyta.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> {error}
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

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-slate-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-slate-900 transition font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                <span className="text-sm font-bold text-slate-600">Kom ihåg mig</span>
              </label>
              
              {/* HÄR ÄR DEN UPPDATERADE LÄNKEN */}
              <Link href="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                Glömt lösenordet?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {isLoading ? 'Loggar in...' : 'Logga in på plattformen'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 font-medium mt-12">
            Skyddas av end-to-end kryptering och europeisk datalagring.
          </p>
        </div>
      </div>

      {/* HÖGER SIDA - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-500 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8">
            <ShieldCheck className="w-16 h-16 text-blue-400 mb-6" />
            <h2 className="text-4xl font-black mb-6 leading-tight">Byggt för säkerhet.<br/>Designat för fart.</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              "Sedan vi bytte till CaseCore har vi minskat vår administrativa tid med flera timmar varje vecka. KYC, fakturering och tidtagning i ett enda flöde är oslagbart."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold border border-slate-700">
                AJ
              </div>
              <div>
                <p className="font-bold">Anna Johansson</p>
                <p className="text-sm text-slate-400">Partner, Advokatbyrån Legal AB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}