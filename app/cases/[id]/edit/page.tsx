import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import EditForm from './EditForm'

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const caseItem = await prisma.case.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!caseItem) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href={`/cases/${caseItem.id}`} className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Avbryt och gå tillbaka
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Redigera ärende</h1>
          <p className="text-slate-600 mb-8">
            Uppdatera information för <span className="font-bold">{caseItem.title}</span> (Klient: {caseItem.client.name})
          </p>
          
          <EditForm caseItem={caseItem} />
        </div>
      </div>
    </main>
  )
}