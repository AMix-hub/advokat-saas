'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length > 1) {
      // Skickar dig till den nya söksidan med ditt sökord i URL:en
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setQuery('')
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök ärende, klient..."
        className="pl-9 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-sm focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none w-64 font-medium text-slate-300 placeholder:text-slate-500 transition-all"
      />
    </form>
  )
}