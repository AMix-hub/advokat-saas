import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Scale,
  FileText,
  Users,
  CheckCircle2,
  TrendingUp,
  Lock,
  BarChart3,
  Database,
  Layers,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'CaseCore | Ärendehantering för moderna advokatbyråer',
  description:
    'CaseCore är nästa generations ärendehantering för juristbyråer. Fånga varje fakturerbar minut, automatisera KYC och låt systemet sköta faktureringen. Prova gratis i 14 dagar.',
  alternates: { canonical: '/' },
}

const features = [
  {
    icon: Scale,
    color: 'blue',
    bg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'KYC & Regelefterlevnad',
    desc: 'Inbyggda flöden för kundkännedom (AML) och PEP-kontroller direkt på klientkortet. GDPR-radering med ett klick.',
  },
  {
    icon: Clock,
    color: 'cyan',
    bg: '#ecfeff',
    iconColor: '#0891b2',
    title: 'Live-tidtagning',
    desc: 'Logga tid direkt på ärenden i realtid. Fånga varje fakturerbar minut — ingen tid läcker längre.',
  },
  {
    icon: FileText,
    color: 'emerald',
    bg: '#ecfdf5',
    iconColor: '#059669',
    title: 'Fakturering & Ekonomi',
    desc: 'Generera PDF-fakturor med timmar och utlägg i ett klick. Full överblick över byråns kassaflöde.',
  },
  {
    icon: Users,
    color: 'violet',
    bg: '#f5f3ff',
    iconColor: '#7c3aed',
    title: 'Klientportal',
    desc: 'Ge klienterna en säker, krypterad länk att följa ärendet. Imponera — utan extra arbete.',
  },
  {
    icon: ShieldCheck,
    color: 'amber',
    bg: '#fffbeb',
    iconColor: '#d97706',
    title: 'Jävsprövning',
    desc: 'Sök hela klient- och ärenderegistret på sekunder. Undvik intressekonflikter proaktivt.',
  },
  {
    icon: BarChart3,
    color: 'indigo',
    bg: '#eef2ff',
    iconColor: '#4338ca',
    title: 'Rapporter & Statistik',
    desc: 'Fullständig analys av era ärenden, intäkter och lönsamhet. Fatta beslut baserade på data.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans" style={{ background: '#020617' }}>

      {/* ── Sticky Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08]" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-12 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 16px rgba(59,130,246,0.5)' }}>
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight text-white">Case<span className="text-cyan-400">Core</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pitch" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Priser
            </Link>
            <Link href="/modules" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Moduler
            </Link>
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Logga in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition shadow-lg flex items-center gap-2">
              Prova gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 text-center" style={{ background: 'linear-gradient(165deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-cyan-400 font-bold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            Byggt för svenska advokatbyråer · GDPR-compliant
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Sluta läcka<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #22d3ee)' }}>
              debiterbar tid.
            </span>
          </h1>

          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            CaseCore är nästa generations ärendehantering för juristbyråer. Fånga varje fakturerbar minut,
            automatisera KYC och låt systemet sköta faktureringen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register" className="w-full sm:w-auto font-bold text-white px-8 py-4 rounded-xl transition shadow-2xl flex items-center justify-center gap-2 text-lg" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>
              Prova gratis 14 dagar <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pitch" className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition flex items-center justify-center gap-2 text-lg">
              Se priser & funktioner
            </Link>
          </div>

          <p className="text-sm text-slate-600 font-medium">
            Inget kreditkort · Avsluta när som helst · Klar på under 30 min
          </p>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.08]" style={{ background: '#0f172a' }}>
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-black text-white mb-1">+15 %</p>
            <p className="text-slate-500 text-sm font-medium">Ökad fakturering i snitt</p>
          </div>
          <div className="border-y sm:border-y-0 sm:border-x border-white/[0.08] py-8 sm:py-0">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <p className="text-3xl font-black text-white mb-1">6 h / vecka</p>
            <p className="text-slate-500 text-sm font-medium">Sparad admintid per jurist</p>
          </div>
          <div>
            <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-3xl font-black text-white mb-1">100 %</p>
            <p className="text-slate-500 text-sm font-medium">GDPR & AML-regelefterlevnad</p>
          </div>
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Ett system. Allt ni behöver.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Från klientregistrering till faktura — allt i ett säkert, GDPR-anpassat system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, bg, iconColor, title, desc }) => (
              <div key={title} className="p-7 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300 bg-white">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: bg }}>
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integration strip ──────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.08] py-10 px-6" style={{ background: '#0f172a' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Integrerar med era befintliga system</p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {[
              { name: 'Fortnox',     color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
              { name: 'Visma',       color: 'text-blue-400    border-blue-500/30    bg-blue-500/10'    },
              { name: 'Excel / CSV', color: 'text-violet-400  border-violet-500/30  bg-violet-500/10'  },
              { name: 'API & eget',  color: 'text-amber-400   border-amber-500/30   bg-amber-500/10'   },
            ].map(({ name, color }) => (
              <span key={name} className={`text-sm font-bold px-4 py-2 rounded-full border ${color}`}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modules teaser ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(34,211,238,0.05) 100%)' }}>
            <div className="p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold text-xs mb-5">
                  <Layers className="w-3.5 h-3.5" />
                  Modulär arkitektur
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                  Bygg ut när ni är redo.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">
                  CaseCore är designat för att växa med er byrå. Kärnsystemet täcker all ärendehantering —
                  lägg sedan till Klientkommunikation, automatiserad dokumentgenerering eller en fristående
                  KYC-modul för att möta era specifika behov.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Klientkommunikation', available: true },
                    { label: 'CaseCore Docs', available: true },
                    { label: 'CaseCore KYC', available: true },
                  ].map(({ label, available }) => (
                    <span
                      key={label}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                        available
                          ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                          : 'text-slate-500 border-white/10 bg-white/5'
                      }`}
                    >
                      {available ? '✓ ' : '⋯ '}{label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/modules"
                  className="inline-flex items-center gap-2 font-bold text-white px-7 py-4 rounded-xl transition shadow-2xl whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 24px rgba(59,130,246,0.35)' }}
                >
                  Utforska moduler <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing preview ────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)' }}>
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">En fast månadskostnad</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Inget per klient, inget per ärende. Välj den plan som passar er byrå.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Solo',       price: '799',    unit: 'kr / mån', desc: '1 användare · Alla grundfunktioner',  style: 'border border-white/10 bg-white/5'    },
            { name: 'Byrå',       price: '2 299',  unit: 'kr / mån', desc: 'Upp till 10 användare · White label', style: 'border border-blue-500/40 bg-blue-500/10', badge: 'Populär' },
            { name: 'Enterprise', price: 'Offert', unit: '',          desc: 'Obegränsat · SLA · Dedikerad support', style: 'border border-white/10 bg-white/5'    },
          ].map(({ name, price, unit, desc, style, badge }) => (
            <div key={name} className={`p-7 rounded-2xl text-center ${style} relative`}>
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black text-white bg-blue-600 px-4 py-1 rounded-full shadow-lg">
                  {badge}
                </div>
              )}
              <h3 className="text-base font-black text-white mb-2">{name}</h3>
              <div className="mb-3">
                <span className="text-3xl font-black text-white">{price}</span>
                {unit && <span className="text-slate-400 text-sm ml-1">{unit}</span>}
              </div>
              <p className="text-xs text-slate-500 font-medium">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/pitch" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition text-sm">
            Visa fullständig jämförelse & FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Trust signals ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Inbyggt i plattformen</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: 'GDPR-compliant',     sub: 'Inbyggd radering' },
              { icon: Database,    label: 'Svensk datalagring', sub: 'Servers i Sverige' },
              { icon: Lock,        label: 'E2E-krypterat',      sub: 'I vila & transit'  },
              { icon: Scale,       label: 'KYC & AML',          sub: 'Penningtvättslag'  },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="p-5 rounded-2xl bg-white border border-slate-200">
                <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-slate-900 text-sm">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6" style={{ background: '#020617' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-4">Redo att modernisera byrån?</h2>
          <p className="text-slate-500 mb-8 text-sm">14 dagars gratis provperiod. Inga bindningar. Klar på under 30 minuter.</p>
          <Link href="/register" className="inline-flex items-center gap-2 font-bold text-white px-8 py-4 rounded-xl transition shadow-2xl mb-10" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 32px rgba(59,130,246,0.35)' }}>
            Kom igång gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)' }}>
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black text-white">Case<span className="text-cyan-400">Core</span></span>
            </div>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} CaseCore Legal Tech · Byggt för modern juridik</p>
            <div className="flex gap-4">
              <Link href="/pitch" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Priser</Link>
              <Link href="/modules" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Moduler</Link>
              <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Logga in</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}