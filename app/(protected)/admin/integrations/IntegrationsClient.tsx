'use client'

import { Plug, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function IntegrationsClient() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-slate-900 rounded-2xl border border-white/[0.08] p-10 text-center space-y-5">
        <div className="w-14 h-14 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto">
          <Plug className="w-7 h-7 text-slate-300" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Integrationer</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Visma och Fortnox konfigureras nu per byrå. Varje användare anger sina egna API-uppgifter direkt i sina egna inställningar.
        </p>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-sm rounded-xl transition"
        >
          Gå till Inställningar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  )
}
