'use client'
import { useState, useEffect } from 'react'
import CaseList from '@/components/CaseList'
import DashboardStats from '@/components/DashboardStats'
import UserProfile from '@/components/UserProfile' // <-- NY IMPORT

export default function Home() {
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState('')

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data)
        if (data.length > 0) setSelectedClient(data[0].id)
      })
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Uppdaterad Header med Profilmeny */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Advokat<span className="text-blue-600">SaaS</span>
            </h1>
            <p className="text-slate-600 mt-2">Hantering av juridiska ärenden och klienter.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <UserProfile />
            <button 
              onClick={() => setShowClientModal(true)}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm h-[52px]"
            >
              + Ny klient
            </button>
          </div>
        </header>

        <DashboardStats />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Aktuella ärenden</h2>
            <button 
              onClick={() => setShowCaseModal(true)}
              disabled={clients.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                clients.length === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              + Nytt ärende
            </button>
          </div>
          <CaseList />
        </div>

        {/* Modal: Ny Klient */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4">Skapa ny klient</h2>
              <form action={async (formData) => {
                const res = await fetch('/api/clients', {
                  method: 'POST',
                  body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), orgNr: formData.get('orgNr') }),
                })
                if (res.ok) window.location.reload()
              }} className="space-y-4">
                <input name="name" placeholder="Företagsnamn / Namn" className="w-full border p-2 rounded" required />
                <input type="email" name="email" placeholder="E-post" className="w-full border p-2 rounded" required />
                <input name="orgNr" placeholder="OrgNr" className="w-full border p-2 rounded" />
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowClientModal(false)} className="px-4 py-2 text-slate-600">Avbryt</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Spara klient</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Nytt Ärende */}
        {showCaseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4">Skapa nytt ärende</h2>
              <form action={async (formData) => {
                const res = await fetch('/api/cases', {
                  method: 'POST',
                  body: JSON.stringify({ title: formData.get('title'), description: formData.get('desc'), clientId: selectedClient }),
                })
                if (res.ok) window.location.reload()
              }} className="space-y-4">
                <input name="title" placeholder="Titel" className="w-full border p-2 rounded" required />
                <textarea name="desc" placeholder="Beskrivning" className="w-full border p-2 rounded" rows={3} />
                <select className="w-full border p-2 rounded" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowCaseModal(false)} className="px-4 py-2 text-slate-600">Avbryt</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Spara ärende</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}