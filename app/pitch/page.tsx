import Link from 'next/link'
import {
  Zap,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Scale,
  FileText,
  Users,
  BarChart3,
  Lock,
  TrendingUp,
  Building2,
  Star,
  MessageSquare,
  Database,
  Wallet,
  BookOpen,
  Plus,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type CellValue = boolean | string

interface ComparisonRow {
  label: string
  solo: CellValue
  byra: CellValue
  enterprise: CellValue
}

// ─── Data ────────────────────────────────────────────────────────────────────

const comparisonRows: ComparisonRow[] = [
  { label: 'Användare',                      solo: '1',              byra: 'Upp till 10',    enterprise: 'Obegränsat'    },
  { label: 'Ärenden & klienter',             solo: 'Obegränsat',    byra: 'Obegränsat',     enterprise: 'Obegränsat'    },
  { label: 'Live-tidtagning',                solo: true,             byra: true,             enterprise: true             },
  { label: 'Faktureringsunderlag (PDF)',      solo: true,             byra: true,             enterprise: true             },
  { label: 'Klientportaler',                 solo: true,             byra: true,             enterprise: true             },
  { label: 'Egna dokumentmallar',            solo: true,             byra: true,             enterprise: true             },
  { label: 'Ärendelogg & historik',          solo: true,             byra: true,             enterprise: true             },
  { label: 'White label (byråns logotyp)',   solo: false,            byra: true,             enterprise: true             },
  { label: 'Jävsprövning',                   solo: false,            byra: true,             enterprise: true             },
  { label: 'Teamhantering & roller',         solo: false,            byra: true,             enterprise: true             },
  { label: 'Avancerade rapporter',           solo: false,            byra: true,             enterprise: true             },
  { label: 'Bulk-export (CSV/PDF)',          solo: false,            byra: true,             enterprise: true             },
  { label: 'API-åtkomst & webhooks',         solo: false,            byra: false,            enterprise: true             },
  { label: 'SLA-garanti (99,9% uptime)',     solo: false,            byra: false,            enterprise: true             },
  { label: 'Support',                        solo: 'E-post',         byra: 'Prioriterad',    enterprise: 'Dedikerad 24/7' },
  { label: 'Onboarding',                     solo: 'Självservice',  byra: '1-tim session',  enterprise: 'Full setup'     },
]

const addOnModules = [
  {
    icon: BookOpen,
    title: 'CaseCore Docs',
    price: '299 kr/mån',
    desc: 'Automatiserad juridisk dokumentgenerering. Skapa kravbrev, fullmakter, uppdragsavtal och inlagor från smarta mallar med variabelfyllning.',
    features: [
      '6 inbyggda juridiska mallar',
      'Variabeldriven dokumentgenerering',
      'Live-förhandsgranskning',
      'Utskrift & PDF-export',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'CaseCore KYC',
    price: '399 kr/mån',
    desc: 'Avancerad KYC/AML-modul med PEP-kontroller, sanktionslistscreening, riskbedömningar och GDPR-kompatibel export.',
    features: [
      'Riskbedömning per klient (Låg/Medel/Hög)',
      'PEP & sanktionslistscreening',
      'Fullständig KYC-checklista',
      'GDPR-export till CSV',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Klientkommunikation',
    price: '199 kr/mån',
    desc: 'Skicka och ta emot meddelanden direkt till klienter kopplade till ärenden – allt loggat och sökbart i systemet.',
    features: [
      'Utgående meddelanden per klient',
      'Inkorg för klientsvar',
      'Koppling till ärende & tidsstämpel',
      'Fullt sökbart meddelandearkiv',
    ],
  },
]

const faqItems = [
  {
    q: 'Binder ni oss till ett långt avtal?',
    a: 'Nej. Alla planer löper månadsvis och kan sägas upp med 1 månads varsel. Väljer ni årsavtal sparar ni 2 månaders kostnad och kan fortfarande avsluta om era behov förändras – vi återbetalar återstående månader.',
  },
  {
    q: 'Varför månadsavgift och inte per klient?',
    a: 'En fast månadsavgift ger er total förutsägbarhet. Per-klient-prissättning skapar friktion: ni undviker att lägga in klienter i systemet för att hålla nere kostnaden, vilket motverkar hela syftet. Med CaseCore är er kostnad densamma oavsett om ni tar in 10 eller 100 nya klienter den månaden – fokusera på jobbet, inte på räknandet.',
  },
  {
    q: 'Kan vi exportera all data om vi avslutar?',
    a: 'Ja, alltid och omedelbart. Full export av alla ärenden, klienter, tidsloggar och fakturor i CSV/JSON-format med ett klick. Er data är er data – inget hålls som gisslan.',
  },
  {
    q: 'Är plattformen GDPR-compliant?',
    a: 'Absolut. All data lagras på svenska servrar, end-to-end-krypterad i vila och under transport. Inbyggda GDPR-raderingsflöden gör det enkelt att uppfylla rätten att bli glömd. Vi genomför regelbundna säkerhetsgranskningar och penetrationstester.',
  },
  {
    q: 'Hur lång tid tar det att komma igång?',
    a: 'Solo-planen kan ni aktivera och börja använda produktivt på under 30 minuter. Byrå-planen inkluderar en 1-timmes onboarding-session där vi hjälper er importera befintlig data, konfigurera dokumentmallar och utbilda teamet. Enterprise-kunder får fullständig setup och datamigration av vår personal.',
  },
  {
    q: 'Ingår det en gratis provperiod?',
    a: 'Ja! Både Solo och Byrå har 14 dagars gratis provperiod – inget kreditkort behövs. Ni provar hela plattformen med fullständiga funktioner, inte en begränsad demoversion.',
  },
]

const testimonials = [
  {
    quote: 'Sedan vi bytte till CaseCore har vi minskat vår administrativa tid med 6 timmar per jurist och vecka. KYC, fakturering och tidtagning i ett enda flöde är oslagbart.',
    name: 'Anna Johansson',
    title: 'Partner',
    firm: 'Advokatbyrån Legal AB',
    initials: 'AJ',
  },
  {
    quote: 'Vi jagade faktureringsbara timmar i gamla Excel-ark. Med live-tidtagning direkt på ärendet fångar vi allt nu. Intäkterna ökade med 18 % första kvartalet.',
    name: 'Erik Lindqvist',
    title: 'Delägare',
    firm: 'Lindqvist & Partners',
    initials: 'EL',
  },
  {
    quote: 'Som soloadvokat betalar jag bara för det jag faktiskt behöver. Klientportalen imponerar dessutom på mina klienter – det känns professionellt utan att kosta en förmögenhet.',
    name: 'Sara Bergström',
    title: 'Advokat',
    firm: 'Bergström Juridik',
    initials: 'SB',
  },
]

// ─── Helper component ────────────────────────────────────────────────────────

function TableCell({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value
      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      : <X className="w-4 h-4 text-slate-600 mx-auto" />
  }
  return <span className="text-sm font-semibold text-slate-300">{value}</span>
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PitchLandingPage() {
  return (
    <main className="min-h-screen font-sans" style={{ background: '#020617' }}>

      {/* ── Sticky Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08]" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-12 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 16px rgba(59,130,246,0.5)' }}>
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight text-white">Case<span className="text-cyan-400">Core</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">Logga in</Link>
            <Link href="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition shadow-lg flex items-center gap-2">
              Prova gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #020617, #0f172a)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-cyan-400 font-bold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            14 dagars gratis provperiod · Inget kreditkort krävs
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Transparent prissättning.<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #22d3ee)' }}>
              Inga dolda avgifter.
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            En fast månadskostnad per byrå. Inga tillkommande avgifter per klient, per ärende eller per dokument.
            Skala upp verksamheten utan att straffa er ekonomiskt.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-xl flex items-center justify-center gap-2">
              Starta din provperiod <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="mailto:demo@casecore.se" className="border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition flex items-center justify-center gap-2">
              Boka demo
            </a>
          </div>
          <p className="text-sm text-slate-600 mt-6">Spara 2 månader med årsavtal · Avsluta när som helst</p>
        </div>
      </section>

      {/* ── ROI Stats ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/[0.08]" style={{ background: '#0f172a' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <p className="text-4xl font-black text-white mb-2">+15 %</p>
            <p className="text-slate-400 font-medium text-sm">Ökad fakturering i snitt tack vare exakt tidtagning och minskat svinn.</p>
          </div>
          <div className="p-6 border-y md:border-y-0 md:border-x border-white/[0.08]">
            <Clock className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <p className="text-4xl font-black text-white mb-2">6 h / vecka</p>
            <p className="text-slate-400 font-medium text-sm">Sparad administrativ tid per jurist — tid som i stället kan faktureras.</p>
          </div>
          <div className="p-6">
            <Lock className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <p className="text-4xl font-black text-white mb-2">100 %</p>
            <p className="text-slate-400 font-medium text-sm">Regelefterlevnad med inbyggd AML-kontroll och GDPR-radering.</p>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ──────────────────────────────────────────────────── */}
      <section id="priser" className="py-24 px-6" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Välj den plan som passar er byrå</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Alla planer inkluderar 14 dagars gratis provperiod. En fast månadsavgift — inga avgifter per klient, per ärende eller per dokument.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Spara 2 månader med årsavtal
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* Solo */}
            <div className="rounded-3xl p-8 border border-white/[0.08] shadow-sm flex flex-col" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-1">Solo</h3>
                <p className="text-slate-400 text-sm">För den enskilde juristen</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black text-white">799</span>
                  <span className="text-slate-400 mb-2"> kr / mån</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">eller 666 kr/mån vid årsavtal</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                {['1 användare', 'Obegränsade ärenden & klienter', 'Live-tidtagning', 'Faktureringsunderlag (PDF)', 'Klientportaler', 'Egna dokumentmallar', 'E-postsupport'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full block text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl transition">
                Prova gratis 14 dagar
              </Link>
            </div>

            {/* Byrå — highlighted */}
            <div className="rounded-3xl p-8 border border-slate-800 shadow-2xl relative flex flex-col md:-translate-y-4 md:scale-[1.02]" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
                Mest Populär
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-1">Byrå</h3>
                <p className="text-slate-400 text-sm">För växande advokatbyråer</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black text-white">2 299</span>
                  <span className="text-slate-400 mb-2"> kr / mån</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">eller 1 916 kr/mån vid årsavtal</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                {['Upp till 10 användare', 'Obegränsade ärenden & klienter', 'Allt i Solo, plus:', 'Teamhantering & rollstyrning', 'White label (byråns logotyp)', 'Jävsprövning', 'Avancerade rapporter & statistik', 'Bulk-export (CSV/PDF)', 'Prioriterad e-postsupport', '1-tim onboarding-session'].map((f, i) => (
                  <li key={f} className={`flex items-center gap-3 ${i === 2 ? 'text-cyan-400 font-bold mt-2' : 'text-slate-300'}`}>
                    {i !== 2 && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:demo@casecore.se" className="w-full block text-center font-bold py-3.5 rounded-xl transition shadow-lg text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
                Boka gratis demo
              </a>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl p-8 border border-white/[0.08] shadow-sm flex flex-col" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-1">Enterprise</h3>
                <p className="text-slate-400 text-sm">För den större organisationen</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black text-white">Offert</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Prissätts efter er verksamhet</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                {['Obegränsade användare', 'Allt i Byrå, plus:', 'API-åtkomst & webhooks', 'Anpassade integrationer', 'SLA-garanti (99,9% uptime)', 'Dedikerad kontaktperson', 'Full setup & datamigration', '24/7 telefon- & e-postsupport'].map((f, i) => (
                  <li key={f} className={`flex items-center gap-3 ${i === 1 ? 'text-cyan-400 font-bold mt-2' : 'text-slate-300'}`}>
                    {i !== 1 && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:demo@casecore.se" className="w-full block text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl transition">
                Kontakta oss
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Add-on Modules ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-y border-white/[0.08]" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-bold text-xs uppercase tracking-widest mb-6">
              <Plus className="w-3.5 h-3.5" /> Köptillägg
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Utöka med specialmoduler</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Aktivera kraftfulla tillägg vid behov — lägg till din befintliga plan som extra månadsavgift. Kan avaktiveras när som helst.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {addOnModules.map(({ icon: Icon, title, price, desc, features }) => (
              <div
                key={title}
                className="relative p-7 rounded-2xl flex flex-col border border-purple-500/20 bg-purple-500/[0.05] hover:border-purple-400/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.15)' }}>
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-sm font-black text-purple-300 bg-purple-500/15 border border-purple-500/25 px-3 py-1 rounded-full">
                    {price}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:demo@casecore.se"
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                >
                  Lägg till <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-sm mt-10">
            Alla tillägg aktiveras omedelbart och faktureras månadsvis tillsammans med din plan.
          </p>
        </div>
      </section>

      {/* ── Feature Comparison Table ───────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.08]" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Fullständig jämförelse</h2>
          <p className="text-center text-slate-400 mb-12">Alla funktioner på ett ställe — inga överraskningar.</p>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]" style={{ background: '#0f172a' }}>
                  <th className="text-left p-5 text-sm font-bold text-slate-400 w-1/2">Funktion</th>
                  <th className="p-5 text-sm font-bold text-slate-300 text-center">Solo</th>
                  <th className="p-5 text-sm font-bold text-cyan-400 text-center">Byrå</th>
                  <th className="p-5 text-sm font-bold text-slate-300 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className="border-b border-white/[0.05]" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="p-4 text-sm font-semibold text-slate-300">{row.label}</td>
                    <td className="p-4 text-center"><TableCell value={row.solo} /></td>
                    <td className="p-4 text-center" style={{ background: 'rgba(59,130,246,0.07)' }}><TableCell value={row.byra} /></td>
                    <td className="p-4 text-center"><TableCell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">
            * CaseCore Docs, CaseCore KYC och Klientkommunikation är köptillägg — se avsnittet ovan.
          </p>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-y border-white/[0.08]" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Vad juridikerna säger</h2>
            <p className="text-slate-400">Riktiga advokatbyråer. Riktiga resultat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <MessageSquare className="w-6 h-6 text-blue-400 mb-4" />
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)' }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.title}, {t.firm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-y border-white/[0.08]" style={{ background: '#0f172a' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Vanliga frågor</h2>
          <p className="text-center text-slate-400 mb-12">Allt ni undrar om priser, avtal och teknik.</p>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <summary className="flex items-center justify-between gap-4 p-6 font-bold text-white cursor-pointer list-none select-none hover:bg-white/5 transition">
                  <span>{item.q}</span>
                  <span className="relative flex-shrink-0 w-6 h-6 rounded-full bg-white/10 group-open:bg-blue-500/20 transition-colors">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-3 h-0.5 bg-slate-400 group-open:bg-blue-400 transition-colors" />
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center group-open:rotate-90 transition-transform">
                      <span className="block w-0.5 h-3 bg-slate-400 group-open:bg-blue-400 transition-colors" />
                    </span>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm border-t border-white/[0.08] pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included Summary ─────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.08]" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-12">Ingår i alla planer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: 'GDPR-compliant', sub: 'Inbyggd radering & kryptering' },
              { icon: Database,    label: 'Svensk datalagring', sub: 'Servers i Sverige' },
              { icon: Lock,        label: 'End-to-end krypterat', sub: 'I vila och under transport' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="p-6 rounded-2xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Icon className="w-7 h-7 text-blue-400 mx-auto mb-3" />
                <p className="font-bold text-white text-sm mb-1">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6" style={{ background: 'linear-gradient(160deg, #020617 0%, #1e1b4b 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', boxShadow: '0 0 32px rgba(59,130,246,0.5)' }}>
            <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Redo att modernisera byrån?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Vi sätter upp ert system på under 24 timmar — fullt anpassat med era mallar och er logotyp. 14 dagar gratis, ingen bindningstid.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-xl flex items-center justify-center gap-2">
              Starta gratis provperiod <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="mailto:demo@casecore.se" className="border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition flex items-center justify-center gap-2">
              Boka en genomgång
            </a>
          </div>
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#22d3ee)' }}>
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black text-white">Case<span className="text-cyan-400">Core</span></span>
            </div>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} CaseCore Legal Tech · Byggt för modern juridik</p>
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition">Logga in →</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}