import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import UserProfile from '@/components/UserProfile'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const user = await prisma.user.findFirst()

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 transition bg-blue-50 px-4 py-2 rounded-lg">
            &larr; Tillbaka till översikten
          </Link>
          <UserProfile />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Företagsinställningar</h1>
          <p className="text-slate-600 mb-8">Anpassa byråns profil. Dessa uppgifter används bland annat på fakturaunderlag.</p>
          
          {user ? (
            <SettingsForm 
              initialName={user.name || ''} 
              initialFirmName={user.firmName || ''} 
              initialBankgiro={user.bankgiro || ''} // Skickar med bankgirot
            />
          ) : (
            <p className="text-red-500">Kunde inte ladda inställningarna.</p>
          )}
        </div>
      </div>
    </main>
  )
}