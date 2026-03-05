'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="hidden md:flex items-center ml-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök klienter eller ärenden..."
        className="border border-slate-300 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-sm w-64 shadow-sm"
      />
      <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-r-lg font-bold hover:bg-slate-800 transition text-sm shadow-sm">
        🔍
      </button>
    </form>
  )
}