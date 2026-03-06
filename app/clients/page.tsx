export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      cases: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl text-white">🏛️</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Case<span className="text-blue-600">Core</span>
              </h1>
            </div>
            
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="font-bold text-slate-500 hover:text-slate-900 transition">Översikt</Link>
              <Link href="/clients" className="font-bold text-slate-900 border-b-2 border-blue-600 pb-1">Klientregister</Link>
            </div>
          </div>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Klientregister</h2>
              <p className="text-slate-500 mt-1">Totalt {clients.length} registrerade klienter</p>
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