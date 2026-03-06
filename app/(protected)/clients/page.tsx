export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      cases: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Klientregister</h1>
                <p className="text-slate-500 text-sm">Totalt {clients.length} registrerade klienter</p>
              </div>
            </div>
            <Link 
              href="/clients/new" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
            >
              + Ny klient
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Klientnamn</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">E-post</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Org.nr / Personnr</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Ärenden</th>
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                      Inga klienter i registret ännu.
                    </td>
                  </tr>
                ) : (
                  clients.map(client => (
                    <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition group">
                      <td className="py-4 px-4 font-bold text-slate-900">{client.name}</td>
                      <td className="py-4 px-4 text-slate-600">{client.email}</td>
                      <td className="py-4 px-4 text-slate-600">{client.orgNr || '-'}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm border border-blue-100">
                          {client.cases.length} st
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link 
                          href={`/clients/${client.id}`}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm transition group-hover:border-blue-300 inline-block"
                        >
                          Visa profil &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}