import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export default async function FullmaktTemplate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()
  const user = await prisma.user.findFirst()

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 print:hidden px-4">
          <Link href={`/cases/${caseItem.id}/templates`} className="text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition bg-white px-4 py-2 rounded-lg shadow-sm">
            &larr; Tillbaka till mallar
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white p-12 md:p-24 shadow-xl print:shadow-none print:p-0 min-h-[1056px] text-slate-900 leading-relaxed">
          
          <h1 className="text-4xl font-black tracking-tight uppercase text-center mb-20">Fullmakt</h1>

          <p className="mb-8 text-lg">
            Härmed befullmäktigas advokatbyrån <strong>{user?.firmName || 'Advokatbyrån AB'}</strong>, eller den advokatbyrån i sitt ställe förordnar, att som ombud företräda mig/oss och bevaka min/vår rätt i ärende angående:
          </p>

          <div className="bg-slate-50 p-6 border border-slate-300 mb-12 italic text-lg text-center font-serif">
            "{caseItem.title}"
          </div>

          <p className="mb-10 text-lg">
            Fullmakten innefattar behörighet att föra talan inför domstolar, myndigheter och skiljenämnder, att träffa förlikning, uppbära medel och kvittera handlingar, samt att i övrigt vidta alla de åtgärder som kan anses erforderliga i samband med ärendet.
          </p>

          <div className="mt-32 pt-10">
            <div className="grid grid-cols-2 gap-16">
              <div>
                <div className="border-b border-slate-400 h-10 mb-2"></div>
                <p className="font-bold">{caseItem.client.name}</p>
                {caseItem.client.orgNr && <p className="text-sm text-slate-600">Org.nr: {caseItem.client.orgNr}</p>}
                <p className="text-sm text-slate-500 mt-1">Namnteckning</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 mb-2"></div>
                <p className="text-sm text-slate-500 mt-1">Ort och datum</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}