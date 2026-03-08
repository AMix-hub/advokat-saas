'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload, AlertTriangle, CheckCircle2, Users,
  ChevronRight, RefreshCw, FileText, X,
} from 'lucide-react'

interface ImportUser {
  id: string
  name: string | null
  email: string
  firmName: string | null
}

interface ParsedRow {
  name: string
  email: string
  orgNr: string
  _valid: boolean
  _error?: string
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (lines.length === 0) return []

  // Detect if first line is a header
  const firstLine = lines[0].toLowerCase()
  const startIdx = (firstLine.includes('namn') || firstLine.includes('name') || firstLine.includes('email')) ? 1 : 0

  return lines.slice(startIdx).map(line => {
    const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''))
    const name  = parts[0] ?? ''
    const email = parts[1] ?? ''
    const orgNr = parts[2] ?? ''

    let _valid = true
    let _error: string | undefined

    if (!name) { _valid = false; _error = 'Namn saknas' }
    else if (!email) { _valid = false; _error = 'E-post saknas' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { _valid = false; _error = 'Ogiltig e-post' }

    return { name, email, orgNr, _valid, _error }
  })
}

const EXAMPLE_CSV = `Namn,E-post,Org.nr
Anna Svensson,anna@example.com,556789-1234
Björn Karlsson,bjorn@example.com,
Carla Nilsson,carla@example.com,802001-4567`

const MAX_PREVIEW_ROWS = 100

export default function ImportClient() {
  const [users, setUsers] = useState<ImportUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [targetUserId, setTargetUserId] = useState('')
  const [csvText, setCsvText] = useState('')
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.status === 403) { setAccessDenied(true); return }
      const data = await res.json()
      setUsers(data.users || [])
      if (data.users?.length > 0) setTargetUserId(data.users[0].id)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCSVChange = (text: string) => {
    setCsvText(text)
    setResult(null)
    if (text.trim()) {
      setParsedRows(parseCSV(text))
    } else {
      setParsedRows([])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => handleCSVChange(ev.target?.result as string ?? '')
    reader.readAsText(file, 'UTF-8')
  }

  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r._valid)
    if (validRows.length === 0 || !targetUserId) return

    setImporting(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          rows: validRows.map(({ name, email, orgNr }) => ({ name, email, orgNr: orgNr || undefined })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ created: 0, skipped: 0, errors: [data.error || 'Något gick fel.'] })
      } else {
        setResult(data)
        if (data.created > 0) {
          setCsvText('')
          setParsedRows([])
        }
      }
    } finally {
      setImporting(false)
    }
  }

  const validCount   = parsedRows.filter(r => r._valid).length
  const invalidCount = parsedRows.filter(r => !r._valid).length

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Åtkomst nekad</h1>
        <p className="text-slate-400 text-center">Du har inte behörighet att se den här sidan.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/[0.08] text-white rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Dataimport</h1>
            <p className="text-slate-500 text-sm">Migrera klientregister från gammalt system via CSV</p>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-400">
          <p className="font-bold mb-1">Hur fungerar import?</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li>Förbered en CSV-fil (eller klistra in data) med kolumnerna: <strong>Namn, E-post, Org.nr</strong> (org.nr är valfritt).</li>
            <li>Separera kolumner med komma (<code>,</code>), semikolon (<code>;</code>) eller tab.</li>
            <li>Max 500 rader per import. Befintliga klienter med samma e-post hoppas automatiskt över.</li>
            <li>Välj vilken användare klienterna ska tilldelas och granska förhandsgranskningen innan import.</li>
          </ul>
        </div>

        {/* Step 1: Target user */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-black">1</span>
            Välj mottagande användare
          </h2>
          {loadingUsers ? (
            <div className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
          ) : (
            <select
              value={targetUserId}
              onChange={e => setTargetUserId(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.email} {u.firmName ? `– ${u.firmName}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Step 2: CSV input */}
        <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-black">2</span>
            Ladda upp eller klistra in CSV-data
          </h2>

          {/* File upload */}
          <div
            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition"
            onClick={() => fileRef.current?.click()}
          >
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">Klicka för att välja CSV-fil</p>
            <p className="text-xs text-slate-600 mt-1">eller klistra in data i textfältet nedan</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Paste area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">CSV-data</label>
              <button
                type="button"
                onClick={() => handleCSVChange(EXAMPLE_CSV)}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Läs in exempeldata
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={e => handleCSVChange(e.target.value)}
              placeholder={`Namn,E-post,Org.nr\nAnna Svensson,anna@example.com,556789-1234\n...`}
              rows={8}
              className="w-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-mono rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>
        </div>

        {/* Step 3: Preview */}
        {parsedRows.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-black">3</span>
                Förhandsgranska ({parsedRows.length} rader)
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {validCount} giltiga
                </span>
                {invalidCount > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <X className="w-3.5 h-3.5" /> {invalidCount} ogiltiga
                  </span>
                )}
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-6 py-2 text-slate-500 font-semibold">Namn</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-semibold">E-post</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-semibold hidden sm:table-cell">Org.nr</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {parsedRows.slice(0, MAX_PREVIEW_ROWS).map((row, i) => (
                    <tr key={i} className={row._valid ? '' : 'bg-red-500/5'}>
                      <td className="px-6 py-2 text-white">{row.name || <span className="text-red-400 italic">tom</span>}</td>
                      <td className="px-4 py-2 text-slate-400">{row.email || <span className="text-red-400 italic">tom</span>}</td>
                      <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">{row.orgNr || '—'}</td>
                      <td className="px-4 py-2">
                        {row._valid
                          ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> OK</span>
                          : <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {row._error}</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {parsedRows.length > MAX_PREVIEW_ROWS && (
                    <tr>
                      <td colSpan={4} className="px-6 py-2 text-slate-600 text-center">
                        … och {parsedRows.length - MAX_PREVIEW_ROWS} fler rader
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl border p-4 text-sm flex items-start gap-3 ${
            result.created > 0
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {result.created > 0
              ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            }
            <div>
              {result.created > 0
                ? <p className="font-bold">Import klar! {result.created} klienter skapades. {result.skipped > 0 && `${result.skipped} hoppades över.`}</p>
                : <p className="font-bold">Import misslyckades. {result.skipped > 0 && `${result.skipped} rader hoppades över.`}</p>
              }
              {result.errors.length > 0 && (
                <ul className="mt-1 text-xs space-y-0.5 list-disc list-inside opacity-80">
                  {result.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Import button */}
        {parsedRows.length > 0 && validCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={importing || !targetUserId}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-bold text-sm rounded-xl transition"
            >
              {importing
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importerar...</>
                : <><Users className="w-4 h-4" /> Importera {validCount} klienter <ChevronRight className="w-4 h-4" /></>
              }
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
