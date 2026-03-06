import Link from 'next/link'
import { Building2, ShieldCheck, ArrowRight, LayoutDashboard } from 'lucide-react'

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
        <div className="flex gap-4">
          <Link href="/login" className="font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition">
            Logga in
          </Link>
          <Link href="/login" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-md">
            Kom igång
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-32 text-center">
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
          <Link href="/login" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-slate-300 transition flex items-center justify-center gap-2 text-lg">
            Boka en demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}