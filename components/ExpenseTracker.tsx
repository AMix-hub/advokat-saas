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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">💳 Utlägg & Kostnader</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Beskrivning (T.ex. Ansökningsavgift)" 
          className="flex-1 border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm" 
          required 
        />
        <div className="flex gap-4">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Belopp i kr" 
            className="w-32 border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 shadow-sm" 
            required 
          />
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:bg-slate-300 shadow-sm whitespace-nowrap"
          >
            {isSubmitting ? 'Sparar...' : 'Lägg till'}
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {expenses.length === 0 && <p className="text-slate-500 italic text-sm">Inga utlägg registrerade.</p>}
        {expenses.map(expense => (
          <li key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">{expense.description}</p>
              <p className="text-xs text-slate-500 font-medium">{new Date(expense.createdAt).toLocaleDateString('sv-SE')}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-md">
              {expense.amount.toLocaleString('sv-SE')} kr
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}