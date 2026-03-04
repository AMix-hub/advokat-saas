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
    <div className="divide-y divide-slate-100">
      {cases.map((c: any) => (
        <Link 
          href={`/cases/${c.id}`} 
          key={c.id} 
          className="py-4 flex justify-between items-center hover:bg-slate-50 transition px-2 rounded-lg cursor-pointer block"
        >
          <div>
            <h3 className="font-semibold text-slate-800">{c.title}</h3>
            <p className="text-sm text-slate-500">{c.client?.name}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            c.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {c.status}
          </span>
        </Link>
      ))}
    </div>
  )
}