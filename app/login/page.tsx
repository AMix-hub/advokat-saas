'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ArrowRight, AlertCircle, Zap, CheckCircle2, Shield, Clock, Scale } from 'lucide-react'

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
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(59,130,246,0.5)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
  }

  return (
    <main className="min-h-screen flex font-sans" style={{ background: '#020617' }}>

      {/* ── Left: Form ─────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 group w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-blue-500/50"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 16px rgba(59,130,246,0.45)' }}
            >
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">Case<span className="text-cyan-400">Core</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Välkommen tillbaka</h1>
          <p className="text-slate-500 font-medium mb-8">Logga in för att komma åt byråns arbetsyta.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">E-postadress</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advokat@byran.se"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 font-medium focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 font-medium focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-blue-500 bg-transparent border-slate-600" />
                <span className="text-sm font-bold text-slate-500">Kom ihåg mig</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition">
                Glömt lösenordet?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-2xl flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}
            >
              {isLoading ? 'Loggar in...' : 'Logga in'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 font-medium mt-8">
            Inget konto?{' '}
            <Link href="/register" className="font-bold text-blue-400 hover:text-blue-300 transition">
              Prova gratis i 14 dagar →
            </Link>
          </p>

          <p className="text-center text-xs text-slate-700 font-medium mt-6">
            Skyddas av end-to-end-kryptering och europeisk datalagring.
          </p>
        </div>
      </div>

      {/* ── Right: Branding ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-16 py-12"
        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)' }}>
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />

        <div className="relative z-10 max-w-sm">
          {/* Platform features */}
          <div className="mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 32px rgba(59,130,246,0.5)' }}>
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight">
              Allt du behöver.<br />Ingenting extra.
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              CaseCore samlar KYC, tidsregistrering, klientportaler och fakturering på ett enda ställe.
            </p>
          </div>

          <ul className="space-y-4 mb-12">
            {[
              { icon: CheckCircle2, color: 'text-emerald-400', text: 'KYC & penningtvättskontroll' },
              { icon: Clock,        color: 'text-blue-400',    text: 'Live-tidtagning per ärende' },
              { icon: Scale,        color: 'text-cyan-400',    text: 'Jävsprövning med ett klick' },
              { icon: Shield,       color: 'text-violet-400',  text: 'GDPR-radering inbyggt' },
            ].map(({ icon: Icon, color, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <span className="text-sm font-semibold text-slate-300">{text}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial */}
          <div className="p-5 rounded-2xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
              &ldquo;CaseCore har minskat vår administrativa tid med 6 timmar per jurist och vecka. KYC, fakturering och tidtagning i ett enda flöde är oslagbart.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)' }}>
                AJ
              </div>
              <div>
                <p className="text-sm font-bold text-white">Anna Johansson</p>
                <p className="text-xs text-slate-500">Partner, Advokatbyrån Legal AB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}