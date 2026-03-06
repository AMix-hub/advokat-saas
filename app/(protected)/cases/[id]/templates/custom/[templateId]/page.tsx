import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export default async function CustomTemplateRenderer({ params }: { params: Promise<{ id: string, templateId: string }> }) {
  const resolvedParams = await params;

  // Hämta ärendet
  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  // Hämta den valda mallen
  const template = await prisma.customTemplate.findUnique({
    where: { id: resolvedParams.templateId }
  })

  if (!caseItem || !template) return notFound()

  // Hämta byråns uppgifter
  const user = await prisma.user.findFirst()
  const today = new Date().toLocaleDateString('sv-SE')

  // MAGIN: Vi byter ut alla "koder" mot riktig data!
  const finalContent = template.content
    .replace(/{{KLIENT}}/g, caseItem.client.name)
    .replace(/{{ORGNR}}/g, caseItem.client.orgNr || '')
    .replace(/{{ÄRENDE}}/g, caseItem.title)
    .replace(/{{BYRÅ}}/g, user?.firmName || 'Advokatbyrån AB')
    .replace(/{{DATUM}}/g, today)

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 print:hidden px-4">
          <Link href={`/cases/${caseItem.id}/templates`} className="text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition bg-white px-4 py-2 rounded-lg shadow-sm">
            &larr; Tillbaka till mallar
          </Link>
          <PrintButton />
        </div>

        {/* A4-papperet */}
        <div className="bg-white p-12 md:p-24 shadow-xl print:shadow-none print:p-0 min-h-[1056px] text-slate-900">
          
          <h1 className="text-3xl font-black mb-12 border-b-2 border-slate-900 pb-4">{template.name}</h1>

          {/* whitespace-pre-wrap gör så att radbrytningar från textrutan bevaras på papperet */}
          <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
            {finalContent}
          </div>

        </div>
      </div>
    </main>
  )
}