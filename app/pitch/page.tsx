import Link from 'next/link'
import { Building2, ShieldCheck, Clock, Wallet, ArrowRight, Lock, TrendingUp, Scale, CheckCircle2 } from 'lucide-react'

export default function PitchLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200 font-sans">
      
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-12 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Case<span className="text-blue-600">Core</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-bold text-slate-600 hover:text-slate-900 transition hidden sm:block">Logga in</Link>
          <a href="mailto:demo@casecore.se" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2">
            Boka Demo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm mb-8 border border-emerald-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Byggt för svensk lagstiftning & GDPR
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
          Sluta skänka bort <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">debiterbar tid.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          CaseCore är nästa generations ärendehantering. Fånga varje minut med live-tidtagning, automatisera KYC och låt systemet sköta faktureringen. Frigör tid till det du faktiskt tar betalt för: juridiken.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="mailto:demo@casecore.se" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-xl flex items-center justify-center gap-2">
            Visa plattformen <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ROI / Value Section */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-4xl font-black mb-2">+15%</h3>
            <p className="text-slate-400 font-medium">Ökad fakturering i snitt genom exakt tidtagning och minskat svinn.</p>
          </div>
          <div className="p-6 border-y md:border-y-0 md:border-x border-slate-800">
            <Clock className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-4xl font-black mb-2">6 h</h3>
            <p className="text-slate-400 font-medium">Sparad administrativ tid per jurist och vecka.</p>
          </div>
          <div className="p-6">
            <Lock className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-4xl font-black mb-2">100%</h3>
            <p className="text-slate-400 font-medium">Trygghet med inbyggd penningtvättskontroll och GDPR-radering.</p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900 mb-16">Ett system. Inga kompromisser.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Regelefterlevnad (KYC)</h3>
              <p className="text-slate-600 leading-relaxed">Inbyggda flöden för kundkännedom och PEP-kontroller direkt på klientkortet. Hantera GDPR-raderingar med ett enda klick.</p>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Scale className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Säker Klientportal</h3>
              <p className="text-slate-600 leading-relaxed">Imponera på klienterna med en säker, krypterad länk där de kan följa ärendets status i realtid – helt i er egen byrås varumärke.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Wallet className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fakturering & Kassaflöde</h3>
              <p className="text-slate-600 leading-relaxed">Generera PDF-underlag på sekunder med utlägg och timmar snyggt uppställda. Få total överblick över byråns innestående värden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Priser som skalar med er</h2>
            <p className="text-lg text-slate-500">Välj den licens som passar er byrås storlek. Inga dolda avgifter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solo */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Solo</h3>
              <p className="text-slate-500 text-sm mb-6">För den enskilda juristen.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">899</span>
                <span className="text-slate-500"> kr / mån</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 1 Användare</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Obegränsade ärenden</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Live-tidtagning</li>
              </ul>
              <a href="mailto:demo@casecore.se" className="w-full block text-center bg-slate-100 text-slate-800 font-bold py-3 rounded-xl hover:bg-slate-200 transition">Välj Solo</a>
            </div>

            {/* Byrå (Highlight) */}
            <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Mest Populär
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Byrå</h3>
              <p className="text-slate-400 text-sm mb-6">För växande advokatbyråer.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">2 499</span>
                <span className="text-slate-400"> kr / mån</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" /> Upp till 5 Användare</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" /> KYC & Compliance-verktyg</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" /> White Label (Egen logga)</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" /> Klientportaler</li>
              </ul>
              <a href="mailto:demo@casecore.se" className="w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition shadow-lg">Boka Demo</a>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">För den större organisationen.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">Offert</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Obegränsade Användare</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Eget API & Integrationer</li>
                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Dedikerad Support</li>
              </ul>
              <a href="mailto:demo@casecore.se" className="w-full block text-center bg-slate-100 text-slate-800 font-bold py-3 rounded-xl hover:bg-slate-200 transition">Kontakta oss</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Redo att modernisera byrån?</h2>
          <p className="text-slate-500 mb-8">Vi sätter upp ert system på under 24 timmar. Fullt anpassat med era mallar och er logotyp.</p>
          <a href="mailto:demo@casecore.se" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition inline-block">
            Boka en genomgång
          </a>
          <p className="text-xs text-slate-400 mt-12 font-medium">© {new Date().getFullYear()} CaseCore Legal Tech. Utvecklat för modern juridik.</p>
        </div>
      </footer>

    </main>
  )
}