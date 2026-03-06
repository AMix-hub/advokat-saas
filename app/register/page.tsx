'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  User, Mail, Lock, KeyRound, ArrowRight,
  CheckCircle2, Zap, Scale, Clock, Shield, FileText, Users,
} from 'lucide-react'

// ─── What's included bullets shown on the right panel ────────────────────────

const trialFeatures = [
  { icon: Scale,     color: 'text-blue-400',    text: 'KYC & penningtvättskontroll' },
  { icon: Clock,     color: 'text-cyan-400',     text: 'Live-tidtagning per ärende' },
  { icon: FileText,  color: 'text-emerald-400',  text: 'Faktureringsunderlag (PDF)' },
  { icon: Users,     color: 'text-violet-400',   text: 'Säker klientportal' },
  { icon: Shield,    color: 'text-amber-400',    text: 'GDPR-radering med ett klick' },
]

// ─── Form ────────────────────────────────────────────────────────────────────

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code') || ''

  const [formData, setFormData] = useState({
    name: '',
    firmName: '',
    email: '',
    password: '',
    inviteCode: codeFromUrl
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
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Något gick fel.')
      }
    } catch {
      setStatus('error')
      setMessage('Ett nätverksfel uppstod.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Success screen
  if (status === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 font-sans" style={{ background: '#020617' }}>
        <div className="max-w-md w-full p-8 rounded-3xl border border-white/[0.08] text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}>
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Välkommen till CaseCore!</h2>
          <p className="text-slate-400 font-medium">{message}</p>
        </div>
      </main>
    )
  }

  const inputBase = "w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 font-medium focus:outline-none transition-all"
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

      {/* ── Left: Form ───────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-blue-500/50"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 16px rgba(59,130,246,0.45)' }}
            >
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">Case<span className="text-cyan-400">Core</span></span>
          </Link>

          {/* Trial badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            14 dagars gratis provperiod · Inget kreditkort
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Starta gratis provperiod</h1>
          <p className="text-slate-500 font-medium mb-8">Skapa byråns konto och prova hela plattformen i 14 dagar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 flex-shrink-0" /> {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5">Ditt namn</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="För- och efternamn"
                  className={inputBase} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5">Advokatbyråns namn</label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="text" name="firmName" value={formData.firmName} onChange={handleChange}
                  placeholder="Advokatbyrån AB"
                  className={inputBase} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5">E-postadress</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="advokat@byran.se"
                  className={inputBase} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5">Välj lösenord</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="Minst 6 tecken"
                  className={inputBase} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required minLength={6} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1.5">
                Åtkomstkod <span className="font-normal text-slate-600">(beta)</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  placeholder="Ange din åtkomstkod"
                  className={`${inputBase} uppercase`}
                  style={codeFromUrl
                    ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }
                    : inputStyle}
                  onFocus={codeFromUrl ? undefined : handleFocus}
                  onBlur={codeFromUrl ? undefined : handleBlur}
                  readOnly={!!codeFromUrl}
                  required
                />
              </div>
              {codeFromUrl ? (
                <p className="text-xs text-emerald-500 font-medium mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Åtkomstkod ifylld via din inbjudningslänk
                </p>
              ) : (
                <p className="text-xs text-slate-600 mt-1.5">
                  Ingen kod? <a href="mailto:demo@casecore.se" className="text-blue-400 hover:text-blue-300 font-bold transition">Kontakta oss</a> för tillgång.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-2xl flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}
            >
              {status === 'loading' ? 'Skapar konto...' : 'Starta gratis provperiod'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 font-medium mt-6">
            Redan konto?{' '}
            <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition">
              Logga in →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: What's included ───────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-16 py-12"
        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)' }}>
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">
            14 dagar gratis.<br />Ingen bindning.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Prova hela plattformen med fullständiga funktioner. Inget kreditkort, ingen automatisk förlängning.
          </p>

          {/* Trial includes */}
          <div className="mb-10">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Ingår i provperioden</p>
            <ul className="space-y-3">
              {trialFeatures.map(({ icon: Icon, color, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                  <span className="text-sm font-semibold text-slate-300">{text}</span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-300">Obegränsade ärenden & klienter</span>
              </li>
            </ul>
          </div>

          {/* Pricing reminder */}
          <div className="p-5 rounded-2xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Efter provperioden</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-white">799 kr</span>
              <span className="text-slate-500 text-sm">/ mån (Solo)</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">eller 2 299 kr/mån för upp till 10 användare</p>
            <Link href="/pitch" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1">
              Se fullständig prisjämförelse →
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center font-sans" style={{ background: '#020617' }}>
        <div className="text-slate-500 font-medium">Laddar...</div>
      </main>
    }>
      <RegisterForm />
    </Suspense>
  )
}