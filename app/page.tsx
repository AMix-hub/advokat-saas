import Link from 'next/link'
import { Building2, ShieldCheck, ArrowRight, LayoutDashboard, Clock, Scale, Users, FileText, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">Case<span className="text-blue-600">Core</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/pitch" className="hidden sm:block font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition">
            Priser
          </Link>
          <Link href="/login" className="font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition">
            Logga in
          </Link>
          <Link href="/register" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-md">
            Kom igång
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-8 border border-blue-200">
          <ShieldCheck className="w-4 h-4" /> Byggt för svenska advokatbyråer
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
          Modern ärendehantering.<br />
          <span className="text-blue-600">Utan kompromisser.</span>
        </h1>
        
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          CaseCore samlar KYC, klientregister, tidrapportering och säker dokumenthantering på ett ställe. 
          Spara timmar på administration och fokusera på juridiken.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 text-lg">
            <LayoutDashboard className="w-5 h-5" /> Till min Dashboard
          </Link>
          <Link href="/pitch" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-slate-300 transition flex items-center justify-center gap-2 text-lg">
            Se priser & demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">KYC & Compliance</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Inbyggda flöden för kundkännedom och PEP-kontroller. Hantera GDPR-raderingar med ett klick.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tidrapportering</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Logga tid direkt på ärenden med live-tidtagning. Fånga varje fakturerbar minut automatiskt.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fakturering</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Generera PDF-fakturor med timmar och utlägg snyggt uppställda. Full överblick över kassaflödet.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Klientportal</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Ge klienterna en säker, krypterad länk där de kan följa ärendets status i realtid.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Jävsprövning</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Sök igenom hela klient- och ärenderegistret efter intressekonflikter med ett enda klick.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">White Label</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Ladda upp byråns logotyp och varumärk hela plattformen. Era klienter ser bara er byrå.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-400">CaseCore Legal Tech</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} CaseCore. Byggt för modern juridik.</p>
        </div>
      </footer>
    </main>
  )
}