import Link from 'next/link'
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Scale,
  Clock,
  FileText,
  Users,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Layers,
  Building2,
  Sparkles,
} from 'lucide-react'

const coreModules = [
  {
    icon: Scale,
    title: 'KYC & Regelefterlevnad',
    desc: 'Inbyggda AML- och PEP-kontroller. GDPR-radering med ett klick.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
  },
  {
    icon: Clock,
    title: 'Tidsregistrering',
    desc: 'Logga fakturerbar tid direkt på ärenden i realtid.',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.1)',
  },
  {
    icon: FileText,
    title: 'Fakturering & Ekonomi',
    desc: 'PDF-fakturor, utläggsspårning och full ekonomiöverblick.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: Users,
    title: 'Klientregister & Portal',
    desc: 'Säker klientportal med krypterade ärendelänkar.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
  },
  {
    icon: BarChart3,
    title: 'Rapporter & Statistik',
    desc: 'Fullständig analys av ärenden, intäkter och lönsamhet.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    icon: ShieldCheck,
    title: 'Jävsprövning',
    desc: 'Sök hela registret – undvik intressekonflikter proaktivt.',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
  },
]

const expansionModules = [
  {
    icon: MessageSquare,
    title: 'Klientkommunikation',
    badge: 'Nytt',
    badgeColor: '#22d3ee',
    desc: 'Skicka och ta emot meddelanden direkt till klienter kopplade till ärenden – allt loggat och sökbart i systemet.',
    features: [
      'Utgående meddelanden per klient',
      'Inkorg för klientsvar',
      'Koppling till ärende & tidsstämpel',
      'Fullt sökbart meddelandearkiv',
    ],
    href: '/login',
    cta: 'Testa nu',
    available: true,
  },
  {
    icon: Layers,
    title: 'CaseCore Docs',
    badge: 'Kommer snart',
    badgeColor: '#a78bfa',
    desc: 'Fristående tjänst för automatiserad juridisk dokumentgenerering. Skapa komplexa avtal och inlagor från smarta mallar med variabelfyllning.',
    features: [
      'Mallbibliotek med 50+ juridiska dokument',
      'Variabeldriven dokumentgenerering',
      'E-signering via BankID',
      'Export till PDF & Word',
    ],
    href: '/register',
    cta: 'Anmäl intresse',
    available: false,
  },
  {
    icon: Building2,
    title: 'CaseCore KYC',
    badge: 'Kommer snart',
    badgeColor: '#a78bfa',
    desc: 'Fristående compliance-modul för byråer som bara behöver KYC/AML-flöden utan full ärendehantering. Perfekt för notarier och revisorer.',
    features: [
      'Fristående KYC-portal',
      'PEP & sanktionslistscreening',
      'Automatiska riskbedömningar',
      'Revisionslogg & GDPR-export',
    ],
    href: '/register',
    cta: 'Anmäl intresse',
    available: false,
  },
]

export default function ModulesPage() {
  return (
    <main className="min-h-screen font-sans" style={{ background: '#020617' }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-white/[0.08]"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-12 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 16px rgba(59,130,246,0.5)' }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Case<span className="text-cyan-400">Core</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pitch" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Priser
            </Link>
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Logga in
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition shadow-lg flex items-center gap-2"
            >
              Prova gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: 'linear-gradient(165deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-cyan-400 font-bold text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            Plattform & moduler
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            En plattform.<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #22d3ee)' }}
            >
              Obegränsad flexibilitet.
            </span>
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            CaseCore är byggt som en modulär plattform. Börja med kärnplattformen och lägg till
            specialiserade tjänster allteftersom er byrå växer – eller välj en fristående modul
            som passar era specifika behov.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto font-bold text-white px-8 py-4 rounded-xl transition shadow-2xl flex items-center justify-center gap-2 text-lg"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}
            >
              Kom igång gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pitch"
              className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition flex items-center justify-center gap-2 text-lg"
            >
              Se priser & planer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Core modules ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3">Ingår i alla planer</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Kärnplattformen</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Allt ni behöver för modern ärendehantering – från klientregistrering till faktura.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreModules.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expansion modules ────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{ background: 'linear-gradient(160deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Utbyggbara tjänster</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ytterligare moduler</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Lägg till specialiserade funktioner när ni behöver dem — eller välj en fristående tjänst
              anpassad för ett specifikt arbetsflöde.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {expansionModules.map(({ icon: Icon, title, badge, badgeColor, desc, features, href, cta, available }) => (
              <div
                key={title}
                className={`relative p-7 rounded-2xl flex flex-col border transition-all duration-300 ${
                  available
                    ? 'border-cyan-500/30 bg-cyan-500/[0.05] hover:border-cyan-400/50'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                }`}
              >
                {/* Badge */}
                <div
                  className="absolute top-5 right-5 text-[10px] font-black px-2.5 py-1 rounded-full border"
                  style={{
                    color: badgeColor,
                    borderColor: `${badgeColor}40`,
                    background: `${badgeColor}15`,
                  }}
                >
                  {badge}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: available ? 'rgba(34,211,238,0.1)' : 'rgba(167,139,250,0.1)' }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: available ? '#22d3ee' : '#a78bfa' }}
                  />
                </div>

                <h3 className="text-lg font-black text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>

                {/* Feature list */}
                <ul className="space-y-2 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: available ? '#22d3ee' : '#a78bfa' }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                    available
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6" style={{ background: '#020617' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-4">Redo att bygga ut er byrå?</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Börja med kärnplattformen och aktivera moduler allt eftersom ni växer.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-bold text-white px-8 py-4 rounded-xl transition shadow-2xl mb-10"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 32px rgba(59,130,246,0.35)' }}
          >
            Kom igång gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)' }}
              >
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black text-white">
                Case<span className="text-cyan-400">Core</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} CaseCore Legal Tech · Byggt för modern juridik</p>
            <div className="flex gap-4">
              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Start</Link>
              <Link href="/pitch" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Priser</Link>
              <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Logga in</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
