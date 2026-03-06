import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export default async function KravbrevTemplate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()
  const user = await prisma.user.findFirst()
  const today = new Date().toLocaleDateString('sv-SE')

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 print:hidden px-4">
          <Link href={`/cases/${caseItem.id}/templates`} className="text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition bg-white px-4 py-2 rounded-lg shadow-sm">
            &larr; Tillbaka till mallar
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white p-12 md:p-20 shadow-xl print:shadow-none print:p-0 min-h-[1056px] text-slate-900 text-sm leading-relaxed relative">
          
          <div className="flex justify-between items-start mb-20 border-b-2 border-slate-800 pb-10">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.firmName || 'Advokatbyrån AB'}</h2>
              <p className="text-slate-600">{user?.name || 'Handläggare'}</p>
              <p className="text-slate-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="font-bold uppercase tracking-wider text-slate-500 mb-1">Datum</p>
              <p className="font-medium text-lg">{today}</p>
            </div>
          </div>

          <div className="mb-16">
            <p className="font-bold text-slate-500 uppercase text-xs mb-1">Mottagare / Motpart</p>
            <div className="border border-slate-300 border-dashed p-4 rounded bg-slate-50 w-64">
              <p className="text-slate-400 italic text-center text-xs">Fyll i motpartens namn och adress manuellt eller i utskrift</p>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-8">KRAVBREV ANGÅENDE: {caseItem.title.toUpperCase()}</h1>

          <div className="space-y-4 text-base">
            <p>
              Vi företräder härmed <strong>{caseItem.client.name}</strong> i egenskap av ombud. Samtlig korrespondens i detta ärende ska fortsättningsvis ske exklusivt med vår byrå.
            </p>
            <p>
              Bakgrunden är följande: 
              <span className="block mt-2 p-4 border-l-4 border-slate-200 text-slate-600 italic">
                {caseItem.description ? caseItem.description : '[Här kan en mer ingående beskrivning av omständigheterna och grunden för kravet skrivas in för hand innan utskrift/PDF-export.]'}
              </span>
            </p>
            <p>
              Med anledning av ovanstående framställs härmed ett formellt krav å vår klients vägnar. Vi emotser er skriftliga inställning till kravet, alternativt betalning/fullgörande av era förpliktelser, senast inom <strong>10 dagar</strong> från datumet för detta brev.
            </p>
            <p>
              Om rättelse eller godtagbart svar ej inkommer inom angiven tid, har vi vår klients uttryckliga instruktion att utan ytterligare varsel vidta rättsliga åtgärder, vilket kan komma att medföra ytterligare kostnader för er i form av rättegångskostnader.
            </p>
          </div>

          <div className="mt-20">
            <p className="mb-8 text-base">Med vänlig hälsning,</p>
            <div className="w-64 border-b border-slate-400 mb-2"></div>
            <p className="font-bold text-base">{user?.name || 'Advokat / Handläggare'}</p>
            <p className="text-slate-500">{user?.firmName || 'Advokatbyrån AB'}</p>
          </div>

        </div>
      </div>
    </main>
  )
}