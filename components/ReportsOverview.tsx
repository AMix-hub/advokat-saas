'use client'
import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react'

export default function ReportsOverview() {
  const [stats, setStats] = useState<any>(null)
  const [caseTypes, setCaseTypes] = useState<any[]>([])
  const [profitability, setProfitability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const [overviewRes, typesRes, profitRes] = await Promise.all([
        fetch('/api/reports?type=overview'),
        fetch('/api/reports?type=case_types'),
        fetch('/api/reports?type=profitability')
      ])

      if (overviewRes.ok) setStats((await overviewRes.json()).data)
      if (typesRes.ok) setCaseTypes((await typesRes.json()).data)
      if (profitRes.ok) setProfitability((await profitRes.json()).data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-slate-500 text-center py-20">Genererar rapporter...</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: '📊 Översikt', icon: BarChart3 },
          { id: 'types', label: '📁 Ärendekategorier', icon: TrendingUp },
          { id: 'profit', label: '💰 Lönsamhet', icon: DollarSign }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-bold border-b-2 transition ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Totala ärenden</p>
                <p className="text-3xl font-black text-slate-900">{stats.totalCases}</p>
                <p className="text-xs text-slate-500 mt-2">
                  🔵 {stats.openCases} öppna • ✅ {stats.closedCases} avslutade
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Inbetald intäkt</p>
              <p className="text-3xl font-black text-emerald-600">
                {stats.totalRevenue.toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">Loggade timmar</p>
              <p className="text-3xl font-black text-blue-600">{stats.totalHours.toFixed(1)} h</p>
              <p className="text-xs text-slate-500 mt-2">
                ≈ {stats.averageHourlyRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr/h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CASE TYPES TAB */}
      {activeTab === 'types' && caseTypes && (
        <div className="space-y-4">
          {caseTypes.map((type) => (
            <div key={type.type} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800">{type.type}</h4>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {type.count} st
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Avg timmar per ärende</p>
                  <p className="font-semibold text-slate-900">{(type.avgHours._avg.hours || 0).toFixed(1)} h</p>
                </div>
                <div>
                  <p className="text-slate-500">Total intäkt</p>
                  <p className="font-semibold text-emerald-600">
                    {(type.totalRevenue._sum.totalAmount || 0).toLocaleString('sv-SE')} kr
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROFITABILITY TAB */}
      {activeTab === 'profit' && profitability && (
        <div className="space-y-4">
          {profitability.slice(0, 10).map((item) => (
            <div
              key={item.caseId}
              className={`bg-white rounded-2xl shadow-sm border-2 p-6 ${
                item.profitMargin < 20
                  ? 'border-red-200 bg-red-50'
                  : item.profitMargin < 40
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  item.profitMargin < 20
                    ? 'bg-red-100 text-red-700'
                    : item.profitMargin < 40
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {item.profitMargin.toFixed(0)}% marg
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-slate-600">Intäkt</p>
                  <p className="font-semibold text-emerald-600">{item.revenue.toLocaleString('sv-SE')} kr</p>
                </div>
                <div>
                  <p className="text-slate-600">Kostnader</p>
                  <p className="font-semibold text-slate-800">{item.costs.toLocaleString('sv-SE')} kr</p>
                </div>
                <div>
                  <p className="text-slate-600">Vinst</p>
                  <p className={`font-semibold ${item.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.profit.toLocaleString('sv-SE')} kr
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Timmar</p>
                  <p className="font-semibold text-slate-800">{item.hoursWorked.toFixed(1)} h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
