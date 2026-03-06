import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export default async function EngagementLetterTemplate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()

  // Hämtar byråns uppgifter från första användaren/admin
  const user = await prisma.user.findFirst()
  const today = new Date().toLocaleDateString('sv-SE')

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Kontroller för skärmen (döljs vid utskrift) */}
        <div className="flex justify-between items-center mb-8 print:hidden px-4">
          <Link href={`/cases/${caseItem.id}`} className="text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition bg-white px-4 py-2 rounded-lg shadow-sm">
            &larr; Tillbaka till ärendet
          </Link>
          <PrintButton />
        </div>

        {/* Själva A4-papperet */}
        <div className="bg-white p-12 md:p-20 shadow-xl print:shadow-none print:p-0 min-h-[1056px] text-slate-900 text-sm leading-relaxed">
          
          {/* Sidhuvud */}
          <div className="border-b-2 border-slate-800 pb-6 mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Uppdragsavtal</h1>
              <p className="text-slate-500 font-bold mt-1">Ärendenr: {caseItem.id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-800">{user?.firmName || 'Advokatbyrån AB'}</h2>
              <p className="text-slate-500">{user?.name || 'Handläggare'}</p>
              <p className="text-slate-500 font-bold mt-2">Datum: {today}</p>
            </div>
          </div>

          {/* Parterna */}
          <div className="mb-10">
            <h3 className="font-bold text-lg mb-4 border-b border-slate-200 pb-2">1. Parterna</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-bold text-slate-500 text-xs uppercase">Uppdragstagare (Byrån)</p>
                <p className="font-bold text-base mt-1">{user?.firmName || 'Advokatbyrån AB'}</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 text-xs uppercase">Uppdragsgivare (Klienten)</p>
                <p className="font-bold text-base mt-1">{caseItem.client.name}</p>
                <p>{caseItem.client.email}</p>
                {caseItem.client.orgNr && <p>Org.nr/Personnr: {caseItem.client.orgNr}</p>}
              </div>
            </div>
          </div>

          {/* Uppdraget */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2 border-b border-slate-200 pb-2">2. Uppdragets omfattning</h3>
            <p className="mb-4">
              Uppdragstagaren åtar sig härmed att biträda Uppdragsgivaren i ärendet benämnt <strong>"{caseItem.title}"</strong>.
            </p>
            <p>
              Beskrivning av uppdraget enligt initial överenskommelse:<br/>
              <span className="italic text-slate-700">{caseItem.description || 'Enligt separat muntlig eller skriftlig instruktion.'}</span>
            </p>
          </div>

          {/* Arvode och Betalning */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2 border-b border-slate-200 pb-2">3. Arvode och debitering</h3>
            <p className="mb-2">
              För uppdraget utgår arvode baserat på nedlagd tid. Den överenskomna timtaxan för detta specifika ärende är <strong>{caseItem.hourlyRate.toLocaleString('sv-SE')} SEK exklusive mervärdesskatt</strong> per påbörjad timme (debiteras i intervaller om 0,1 timmar).
            </p>
            <p>
              Utöver arvode har Uppdragstagaren rätt till ersättning för utlägg och kostnader som uppkommit i samband med uppdragets utförande. Fakturering sker löpande om inte annat avtalats. Betalningsvillkor är 30 dagar netto.
            </p>
          </div>

          {/* Allmänna villkor */}
          <div className="mb-16">
            <h3 className="font-bold text-lg mb-2 border-b border-slate-200 pb-2">4. Allmänna villkor och Tystnadsplikt</h3>
            <p>
              Uppdragstagaren är bunden av Sveriges Advokatsamfunds vägledande regler om god advokatsed, innefattande strikt tystnadsplikt och lojalitet mot Uppdragsgivaren. Uppdragstagarens ansvar är begränsat till den skada som orsakats genom grov vårdslöshet och är under alla omständigheter begränsat till ansvarsförsäkringens maxtak.
            </p>
          </div>

          {/* Underskrifter */}
          <div className="mt-20 pt-10">
            <p className="mb-10 italic text-slate-600">Detta avtal har upprättats i två likalydande exemplar varav parterna tagit var sitt.</p>
            
            <div className="grid grid-cols-2 gap-16">
              <div>
                <div className="border-b border-slate-400 h-10 mb-2"></div>
                <p className="font-bold">{user?.firmName || 'Advokatbyrån AB'}</p>
                <p className="text-sm text-slate-500">Ort och datum</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 mb-2"></div>
                <p className="font-bold">{caseItem.client.name}</p>
                <p className="text-sm text-slate-500">Ort och datum</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}