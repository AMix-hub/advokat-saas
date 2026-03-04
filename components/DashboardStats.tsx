'use client'
import { useEffect, useState } from 'react'

export default function DashboardStats() {
  const [stats, setStats] = useState({ totalClients: 0, openCases: 0, closedCases: 0, totalHours: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="h-24 animate-pulse bg-slate-200 rounded-2xl mb-8"></div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Aktiva Ärenden</p>
        <p className="text-3xl font-black text-blue-600">{stats.openCases}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Klienter</p>
        <p className="text-3xl font-black text-slate-800">{stats.totalClients}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Stängda Ärenden</p>
        <p className="text-3xl font-black text-emerald-600">{stats.closedCases}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Fakturerbara h</p>
        <p className="text-3xl font-black text-indigo-600">{stats.totalHours.toFixed(1)}</p>
      </div>
    </div>
  )
}