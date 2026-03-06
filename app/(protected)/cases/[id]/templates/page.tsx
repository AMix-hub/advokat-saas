export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function TemplatesHub({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()

  // Hämta byråns egna dynamiska mallar
  const customTemplates = await prisma.customTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <Link href={`/cases/${caseItem.id}`} className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till ärendet
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
          <div className="mb-10 border-b border-slate-100 pb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dokumentmallar</h1>
              <p className="text-slate-500">
                Generera färdiga juridiska dokument för <span className="font-bold text-slate-700">{caseItem.title}</span>.
              </p>
            </div>
            <Link href="/templates" className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition text-sm">
              ⚙️ Hantera egna mallar
            </Link>
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Standardmallar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link href={`/cases/${caseItem.id}/templates/engagement-letter`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4">📝</div>
              <h3 className="font-bold text-slate-900 mb-1">Uppdragsavtal</h3>
            </Link>
            <Link href={`/cases/${caseItem.id}/templates/fullmakt`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-2xl mb-4">⚖️</div>
              <h3 className="font-bold text-slate-900 mb-1">Fullmakt</h3>
            </Link>
            <Link href={`/cases/${caseItem.id}/templates/kravbrev`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-2xl mb-4">✉️</div>
              <h3 className="font-bold text-slate-900 mb-1">Kravbrev</h3>
            </Link>
          </div>

          {/* Egna mallar */}
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Era egna mallar</h2>
          {customTemplates.length === 0 ? (
            <p className="text-slate-500 italic text-sm">Inga egna mallar skapade ännu.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customTemplates.map(template => (
                <Link key={template.id} href={`/cases/${caseItem.id}/templates/custom/${template.id}`} className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-amber-400 hover:shadow-md transition block">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    📄
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-xs text-slate-400">Generera med klientspecifik data.</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}