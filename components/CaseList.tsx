'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CaseList() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-slate-500 p-4">Laddar ärenden...</p>
  if (cases.length === 0) return <p className="text-slate-400 p-4">Inga ärenden hittades.</p>

  return (
    <div className="divide-y divide-white/[0.06]">
      {cases.map((c: any) => (
        <Link 
          href={`/cases/${c.id}`} 
          key={c.id} 
          className="py-4 flex justify-between items-center hover:bg-white/[0.05] transition px-2 rounded-lg cursor-pointer block"
        >
          <div>
            <h3 className="font-semibold text-slate-100">{c.title}</h3>
            <p className="text-sm text-slate-500">{c.client?.name}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            c.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-slate-300'
          }`}>
            {c.status}
          </span>
        </Link>
      ))}
    </div>
  )
}