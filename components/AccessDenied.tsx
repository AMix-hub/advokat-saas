'use client'

import { Lock } from 'lucide-react'

interface Props {
  moduleName: string
}

export default function AccessDenied({ moduleName }: Props) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Inget abonnemang</h1>
        <p className="text-slate-400 text-sm">
          Du har inte tillgång till <span className="text-purple-400 font-semibold">{moduleName}</span>.
          Kontakta din administratör för att aktivera detta tillägg.
        </p>
      </div>
    </main>
  )
}
