import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'

export default async function TemplatesHub({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href={`/cases/${caseItem.id}`} className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till ärendet
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dokumentmallar</h1>
            <p className="text-slate-500">
              Generera färdiga juridiska dokument för <span className="font-bold text-slate-700">{caseItem.title}</span> (Klient: {caseItem.client.name}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mall 1: Uppdragsavtal */}
            <Link href={`/cases/${caseItem.id}/templates/engagement-letter`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Uppdragsavtal</h3>
              <p className="text-sm text-slate-500">Standardavtal som reglerar uppdragets omfattning, timtaxa och allmänna villkor.</p>
            </Link>

            {/* Mall 2: Fullmakt */}
            <Link href={`/cases/${caseItem.id}/templates/fullmakt`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Fullmakt (Ombud)</h3>
              <p className="text-sm text-slate-500">Allmän rättegångs- och ombudsfullmakt för att företräda klienten inför domstol och motpart.</p>
            </Link>

            {/* Mall 3: Kravbrev */}
            <Link href={`/cases/${caseItem.id}/templates/kravbrev`} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ✉️
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Kravbrev</h3>
              <p className="text-sm text-slate-500">Formellt varnings-/kravbrev att skicka till motpart innan rättsliga åtgärder vidtas.</p>
            </Link>

          </div>
        </div>

      </div>
    </main>
  )
}