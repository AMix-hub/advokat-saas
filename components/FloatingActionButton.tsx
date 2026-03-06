'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function FloatingActionButton() {
  return (
    <Link
      href="/cases/new"
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 z-40 font-bold text-lg"
      title="Skapa nytt ärende"
    >
      <Plus className="w-8 h-8" />
    </Link>
  )
}
