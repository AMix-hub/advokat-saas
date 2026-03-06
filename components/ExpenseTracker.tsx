'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ExpenseTracker({ caseId, expenses }: { caseId: string, expenses: any[] }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return
    setIsSubmitting(true)

    await fetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description, amount, caseId })
    })

    setDescription('')
    setAmount('')
    setIsSubmitting(false)
    router.refresh()
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">💳 Utlägg & Kostnader</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Beskrivning (T.ex. Ansökningsavgift)" 
          className="flex-1 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500" 
          required 
        />
        <div className="flex gap-4">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Belopp i kr" 
            className="w-32 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/[0.05] text-white placeholder:text-slate-500" 
            required 
          />
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-700 border border-white/10 whitespace-nowrap"
          >
            {isSubmitting ? 'Sparar...' : 'Lägg till'}
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {expenses.length === 0 && <p className="text-slate-500 italic text-sm">Inga utlägg registrerade.</p>}
        {expenses.map(expense => (
          <li key={expense.id} className="flex justify-between items-center p-3 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <div>
              <p className="font-semibold text-slate-200">{expense.description}</p>
              <p className="text-xs text-slate-500 font-medium">{new Date(expense.createdAt).toLocaleDateString('sv-SE')}</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-md">
              {expense.amount.toLocaleString('sv-SE')} kr
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}