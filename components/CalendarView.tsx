'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckSquare } from 'lucide-react'

type CalEvent = {
  id: string
  title: string
  caseId: string
  caseTitle: string
  date: string          // ISO date string  yyyy-mm-dd
  kind: 'DEADLINE' | 'TASK'
  isCompleted: boolean
  isOverdue: boolean
  deadlineType?: string // LAW_DEADLINE | COURT_DATE | REMINDER | OTHER
}

const KIND_STYLES: Record<string, string> = {
  DEADLINE_COURT_DATE:   'bg-violet-500/20 text-violet-300 border-violet-500/30',
  DEADLINE_LAW_DEADLINE: 'bg-red-500/20 text-red-300 border-red-500/30',
  DEADLINE_REMINDER:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  DEADLINE_OTHER:        'bg-white/10 text-slate-300 border-white/20',
  TASK:                  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  COMPLETED:             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 opacity-60',
}

function getStyle(ev: CalEvent) {
  if (ev.isCompleted) return KIND_STYLES.COMPLETED
  if (ev.kind === 'TASK') return KIND_STYLES.TASK
  return KIND_STYLES[`DEADLINE_${ev.deadlineType}`] ?? KIND_STYLES.DEADLINE_OTHER
}

const DAYS_SE = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
const MONTHS_SE = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December']

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns 0=Monday … 6=Sunday for the first day of the month */
function firstWeekday(year: number, month: number) {
  // getDay() returns 0=Sunday, convert to Mon=0
  return (new Date(year, month, 1).getDay() + 6) % 7
}

export default function CalendarView({ events }: { events: CalEvent[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()) }

  const eventMap = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    })
    return map
  }, [events])

  const totalDays = daysInMonth(year, month)
  const startOffset = firstWeekday(year, month)
  // Cells: leading empties + days
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = isoDate(today)

  // Stats for header
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(totalDays).padStart(2, '0')}`
  const monthEvents = events.filter(ev => ev.date >= monthStart && ev.date <= monthEnd)
  const overdueCount = events.filter(ev => ev.isOverdue && !ev.isCompleted).length

  return (
    <div>
      {/* ── Summary pills ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Deadlines denna månaden', value: monthEvents.filter(e => e.kind === 'DEADLINE').length, color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
          { label: 'Uppgifter denna månaden',  value: monthEvents.filter(e => e.kind === 'TASK').length,     color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
          { label: 'Förfallna (alla månader)', value: overdueCount, color: overdueCount > 0 ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-white/[0.04] text-slate-300 border-white/[0.08]' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${color}`}>
            <span className="text-lg font-black">{value}</span>
            <span className="font-medium opacity-80">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Month navigation ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] transition text-slate-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] transition text-slate-400">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black text-white ml-1">
            {MONTHS_SE[month]} {year}
          </h2>
        </div>
        <button onClick={goToday} className="px-4 py-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] transition text-sm font-bold text-slate-400">
          Idag
        </button>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-white/[0.04] border-b border-white/[0.08]">
          {DAYS_SE.map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/[0.06]">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`e${idx}`} className="min-h-[100px] bg-white/[0.02] p-1" />
            }
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = eventMap[dateStr] ?? []
            const isToday = dateStr === todayStr
            const isPast = dateStr < todayStr

            return (
              <div
                key={dateStr}
                className={`min-h-[100px] p-1.5 flex flex-col gap-1 transition ${
                  isToday ? 'bg-blue-500/10' : isPast ? 'bg-transparent' : 'bg-transparent'
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold self-end ${
                  isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300'
                }`}>
                  {day}
                </div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <Link key={ev.id} href={`/cases/${ev.caseId}`} title={`${ev.title} — ${ev.caseTitle}`}>
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold truncate border ${getStyle(ev)} hover:opacity-80 transition`}>
                        {ev.kind === 'TASK'
                          ? <CheckSquare className="w-2.5 h-2.5 flex-shrink-0" />
                          : <CalendarDays className="w-2.5 h-2.5 flex-shrink-0" />}
                        <span className="truncate">{ev.title}</span>
                      </div>
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] font-bold text-slate-400 px-1.5">
                      +{dayEvents.length - 3} till
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 mt-5 text-xs font-semibold text-slate-500">
        {[
          { style: KIND_STYLES.DEADLINE_COURT_DATE,   icon: CalendarDays, label: 'Domstolsförhandling' },
          { style: KIND_STYLES.DEADLINE_LAW_DEADLINE, icon: CalendarDays, label: 'Juridisk deadline' },
          { style: KIND_STYLES.DEADLINE_REMINDER,     icon: CalendarDays, label: 'Påminnelse' },
          { style: KIND_STYLES.TASK,                  icon: CheckSquare,  label: 'Uppgift' },
          { style: KIND_STYLES.COMPLETED,             icon: CheckSquare,  label: 'Avklarad' },
        ].map(({ style, icon: Icon, label }) => (
          <div key={label} className={`flex items-center gap-1.5 px-2 py-1 rounded border ${style}`}>
            <Icon className="w-3 h-3" /> {label}
          </div>
        ))}
      </div>

      {/* ── Upcoming list ─────────────────────────────────────────────────── */}
      {(() => {
        const upcoming = events
          .filter(ev => !ev.isCompleted && ev.date >= isoDate(today))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 8)
        if (upcoming.length === 0) return null
        return (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Närmaste händelser
            </h3>
            <div className="space-y-2">
              {upcoming.map(ev => (
                <Link key={ev.id} href={`/cases/${ev.caseId}`}>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/30 hover:shadow-sm transition group">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.kind === 'TASK' ? 'bg-blue-500' : ev.deadlineType === 'COURT_DATE' ? 'bg-violet-500' : ev.deadlineType === 'LAW_DEADLINE' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-100 text-sm truncate group-hover:text-blue-400 transition">{ev.title}</p>
                      <p className="text-xs text-slate-400 truncate">{ev.caseTitle}</p>
                    </div>
                    <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
                      {new Date(ev.date + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
