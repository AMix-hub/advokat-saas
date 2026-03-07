'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TimeTracker({ caseId, timeEntries }: { caseId: string, timeEntries: any[] }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Tillstånd för Live-Timern
  const [isActive, setIsActive] = useState(false)
  const [seconds, setSeconds] = useState(0)

  // Klockans logik som tickar varje sekund
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  // Formatera sekunderna till snygg klocka (HH:MM:SS)
  const formatTime = (totalSeconds: number) => {
    const h = `0${Math.floor(totalSeconds / 3600)}`.slice(-2)
    const m = `0${Math.floor((totalSeconds % 3600) / 60)}`.slice(-2)
    const s = `0${totalSeconds % 60}`.slice(-2)
    return `${h}:${m}:${s}`
  }

  // Stanna klockan och räkna ut timmarna
  const handleStopTimer = () => {
    setIsActive(false)
    // Räknar om sekunder till timmar (1 decimal). Minsta debitering är 0.1h (6 min).
    const calculatedHours = Math.max(0.1, Math.round((seconds / 3600) * 10) / 10)
    setHours(calculatedHours.toString())
    setSeconds(0)
  }

  // Spara tidsloggen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !hours) return
    setIsSubmitting(true)

    await fetch('/api/time', {
      method: 'POST',
      body: JSON.stringify({ description, hours, caseId })
    })

    setDescription('')
    setHours('')
    setIsSubmitting(false)
    window.dispatchEvent(new CustomEvent('faktura-uppdatera'))
    router.refresh()
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Tidsregistrering</h2>
      
      {/* LIVE TIMER SEKTION */}
      <div className="bg-slate-900 rounded-xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div>
          <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-widest">Tidtagare</p>
          <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-blue-400">
            {formatTime(seconds)}
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-bold transition shadow-md ${isActive ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {isActive ? '⏸ Pausa' : '▶ Starta'}
          </button>
          
          {(seconds > 0 || isActive) && (
            <button 
              onClick={handleStopTimer}
              className="flex-1 md:flex-none bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-400 transition shadow-md"
            >
              ⏹ Stoppa & För över
            </button>
          )}
        </div>
      </div>

      {/* MANUELL INMATNING / SPARA-FORMULÄR */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Vad har du gjort? (T.ex. Telefonmöte klient)" 
          className="flex-1 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white" 
          required 
        />
        <div className="flex gap-4">
          <input 
            type="number" 
            step="0.1" 
            min="0.1"
            value={hours} 
            onChange={(e) => setHours(e.target.value)} 
            placeholder="Timmar (ex. 1.5)" 
            className="w-32 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white" 
            required 
          />
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 shadow-sm whitespace-nowrap"
          >
            {isSubmitting ? 'Sparar...' : 'Logga tid'}
          </button>
        </div>
      </form>

      {/* HISTORIK ÖVER LOGGAD TID */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-2">Tidigare loggat på ärendet</h3>
      <ul className="space-y-2">
        {timeEntries.length === 0 && <p className="text-slate-500 italic text-sm">Ingen tid loggad ännu.</p>}
        {timeEntries.map(entry => (
          <li key={entry.id} className="flex justify-between items-center p-3 bg-white/[0.04] rounded-lg border border-white/[0.06] hover:border-white/[0.08] transition">
            <div>
              <p className="font-semibold text-slate-100">{entry.description}</p>
              <p className="text-xs text-slate-500 font-medium">{new Date(entry.createdAt).toLocaleDateString('sv-SE')}</p>
            </div>
            <span className="bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-md">
              {entry.hours} h
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}