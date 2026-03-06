'use client'
import { useEffect, useState } from 'react'
import { CreditCard, Trash2, Eye, Plus, Download } from 'lucide-react'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'
  totalAmount: number
  notes?: string
  items: InvoiceItem[]
  case: {
    title: string
    id: string
    client: {
      name: string
      email: string
      orgNr?: string
    }
  }
}

export default function InvoiceManager({ caseId }: { caseId?: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState({
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  })

  useEffect(() => {
    fetchInvoices()
  }, [caseId])

  const fetchInvoices = async () => {
    try {
      const url = caseId ? `/api/invoices?caseId=${caseId}` : '/api/invoices'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseId) return

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          dueDate: new Date(formData.dueDate),
          items: formData.items.filter(item => item.description && item.unitPrice > 0),
          notes: formData.notes || null
        })
      })

      if (res.ok) {
        setFormData({ dueDate: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], notes: '' })
        setShowForm(false)
        fetchInvoices()
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        fetchInvoices()
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Är du säker på att du vill radera denna faktura?')) return

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchInvoices()
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-white/10 text-slate-300 border-white/20'
      case 'SENT':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'PAID':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'OVERDUE':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-white/10 text-slate-300 border-white/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return '📝 Utkast'
      case 'SENT':
        return '✉️ Skickad'
      case 'PAID':
        return '✅ Betald'
      case 'OVERDUE':
        return '⚠️ Förfallen'
      default:
        return status
    }
  }

  if (loading) {
    return <div className="text-slate-500">Laddar fakturor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" /> Fakturor
          </h3>
          {caseId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ny faktura
            </button>
          )}
        </div>

        {/* Formulär för ny faktura */}
        {showForm && caseId && (
          <form onSubmit={handleCreateInvoice} className="mb-6 p-4 bg-white/[0.04] rounded-lg border border-white/[0.06] space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Förfallodag</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.05] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Fakturarader</label>
              <div className="space-y-3 mb-3">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Beskrivning"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].description = e.target.value
                        setFormData({ ...formData, items: newItems })
                      }}
                      className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.05] text-white"
                    />
                    <input
                      type="number"
                      placeholder="Antal"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].quantity = parseFloat(e.target.value) || 0
                        setFormData({ ...formData, items: newItems })
                      }}
                      className="w-20 px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.05] text-white"
                    />
                    <input
                      type="number"
                      placeholder="Pris/enhet"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0
                        setFormData({ ...formData, items: newItems })
                      }}
                      className="w-28 px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.05] text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formData.items.filter((_, i) => i !== idx)
                        setFormData({ ...formData, items: newItems.length > 0 ? newItems : [{ description: '', quantity: 1, unitPrice: 0 }] })
                      }}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }] })}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold"
              >
                + Lägg till rad
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Anteckningar</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="T.ex. betalningsvillkor, tack för affären..."
                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.05] text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition"
              >
                Skapa faktura
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-white/10 text-slate-300 py-2 rounded-lg font-bold hover:bg-white/[0.15] transition"
              >
                Avbryt
              </button>
            </div>
          </form>
        )}

        {/* Lista på fakturor */}
        {invoices.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Inga fakturor ännu</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 border border-white/[0.08] rounded-lg hover:bg-white/[0.05] transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="font-bold text-white">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-slate-400">
                      {invoice.case.client.name} • {invoice.case.title}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusBadge(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-slate-500">Fakturadatum</p>
                    <p className="font-semibold text-white">{new Date(invoice.invoiceDate).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Förfallodag</p>
                    <p className="font-semibold text-white">{new Date(invoice.dueDate).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Belopp</p>
                    <p className="font-semibold text-emerald-600 text-lg">{invoice.totalAmount.toLocaleString('sv-SE')} kr</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {invoice.status === 'DRAFT' && (
                    <button
                      onClick={() => handleUpdateStatus(invoice.id, 'SENT')}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                    >
                      Skicka
                    </button>
                  )}
                  {invoice.status === 'SENT' && (
                    <button
                      onClick={() => handleUpdateStatus(invoice.id, 'PAID')}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                      Markera betald
                    </button>
                  )}
                  {invoice.status === 'DRAFT' && (
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Ta bort
                    </button>
                  )}
                  <button
                    className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition flex items-center gap-1"
                    title="Visa detaljer"
                  >
                    <Eye className="w-4 h-4" /> Visa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
