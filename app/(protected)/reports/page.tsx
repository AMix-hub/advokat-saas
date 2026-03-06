export const dynamic = 'force-dynamic'

import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import ReportsOverview from '@/components/ReportsOverview'
import { ArrowLeft } from 'lucide-react'

export default async function ReportsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1.5 transition bg-blue-50 px-3 py-2 rounded-lg text-sm">
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" /> Rapporter & Statistik
          </h1>
          <p className="text-slate-600">Se detaljerad analys av dina ärenden, intäkter och lönsamhet</p>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <ReportsOverview />
        </div>
      </div>
    </main>
  )
}
