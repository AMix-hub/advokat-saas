import Link from 'next/link'
import { Building2, ShieldCheck, Clock, Wallet, CheckCircle2, ArrowRight } from 'lucide-react'

export default function PitchLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Case<span className="text-blue-600">Core</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition hidden sm:block">Logga in</Link>
          <a href="mailto:demo@casecore.se" className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm">Boka Demo</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-8 border border-blue-100">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
          Sveriges snabbaste Legal Tech-plattform
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
          Modern ärendehantering för <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">framtidens jurister.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          Släpp de tunga, omoderna systemen. CaseCore samlar tidregistrering, KYC-compliance, klientportaler och fakturering i ett blixtsnabbt gränssnitt byggt för att spara din tid.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="mailto:demo@casecore.se" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-lg flex items-center justify-center gap-2">
            Boka en personlig visning <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-16">Allt en modern byrå behöver.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sömlös Compliance</h3>
              <p className="text-slate-500 leading-relaxed">Penningtvättskontroller (KYC), PEP-register och GDPR-radering inbyggt direkt på klientkortet. Var alltid redo för Advokatsamfundets granskning.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Clock className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Live-Tidtagning</h3>
              <p className="text-slate-500 leading-relaxed">Lämna excel-arken. Vår inbyggda live-timer tickar medan du jobbar och konverterar automatiskt sekunderna till debiterbara decimaltimmar.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Wallet className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ekonomisk Kontroll</h3>
              <p className="text-slate-500 leading-relaxed">Kassaböcker och kundreskontra på autopilot. Skapa A4-fakturor med ett klick och håll koll på byråns exakta kassaflöde i realtid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Redo att lyfta byrån?</h2>
        <p className="text-lg text-slate-500 mb-10">Boka en kostnadsfri demo så visar vi hur vi kan skräddarsy plattformen med er byrålogga (White Label) och era egna dokumentmallar.</p>
        <a href="mailto:demo@casecore.se" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition shadow-xl inline-block">
          Kontakta oss idag
        </a>
      </section>

    </main>
  )
}