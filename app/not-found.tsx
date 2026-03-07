import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 – Sidan hittades inte | CaseCore',
  description: 'Sidan du letar efter existerar inte eller har flyttats.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-black text-indigo-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Sidan hittades inte</h1>
        <p className="text-slate-400 mb-8">Sidan du letar efter existerar inte eller har flyttats.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  )
}
