'use client'

import { useState, useEffect } from 'react'
import AccessDenied from '@/components/AccessDenied'
import {
  BookOpen,
  FileText,
  Printer,
  Save,
  ArrowLeft,
  History,
  CheckCircle2,
  ChevronDown,
  Plus,
  Zap,
} from 'lucide-react'

// ────────────────────────────────────────────────────────────
// Template definitions
// ────────────────────────────────────────────────────────────
interface TemplateField {
  key: string
  label: string
  placeholder: string
  multiline?: boolean
  required?: boolean
}

interface DocTemplate {
  id: string
  name: string
  category: string
  description: string
  emoji: string
  color: string
  fields: TemplateField[]
  render: (v: Record<string, string>) => string
}

const today = () => new Date().toLocaleDateString('sv-SE')

const TEMPLATES: DocTemplate[] = [
  {
    id: 'kravbrev',
    name: 'Kravbrev',
    category: 'Tvistemål',
    description: 'Formellt betalningskrav eller krav på fullgörande riktat till motpart.',
    emoji: '✉️',
    color: 'red',
    fields: [
      { key: 'BYRÅ', label: 'Byråns namn', placeholder: 'Advokatbyrån AB', required: true },
      { key: 'HANDLÄGGARE', label: 'Handläggarens namn', placeholder: 'Erik Svensson', required: true },
      { key: 'KLIENT', label: 'Klientens namn', placeholder: 'Anna Lindström', required: true },
      { key: 'MOTPART', label: 'Motpartens namn', placeholder: 'Bolaget AB', required: true },
      { key: 'ÄRENDEBESKRIVNING', label: 'Ärendebeskrivning', placeholder: 'Beskriv bakgrunden och grunden för kravet…', multiline: true, required: true },
      { key: 'BELOPP', label: 'Kravbelopp (kr)', placeholder: '50 000', required: true },
      { key: 'SVARSTID', label: 'Svarstid (dagar)', placeholder: '10', required: true },
    ],
    render: v => `KRAVBREV

Avsändare: ${v.BYRÅ || '___'}
Handläggare: ${v.HANDLÄGGARE || '___'}
Datum: ${today()}

Till: ${v.MOTPART || '___'}

Vi representerar härmed ${v.KLIENT || '___'} och framställer på uppdrag av vår klient följande formella krav.

BAKGRUND OCH GRUND FÖR KRAVET
${v.ÄRENDEBESKRIVNING || '[Beskriv bakgrunden]'}

KRAV
Vi kräver härmed att ${v.MOTPART || '___'} erlägger beloppet ${v.BELOPP || '___'} kr senast inom ${v.SVARSTID || '10'} dagar från datumet för detta brev.

KONSEKVENSER VID UTEBLIVEN REAKTION
Uteblir betalning eller godtagbart svar inom angiven tid, har vi instruktion att utan ytterligare varsel vidta rättsliga åtgärder. Ni erinras om att rättegångskostnader i sådant fall kan komma att yrkas.

Samtlig framtida korrespondens i detta ärende ska ske exklusivt med vår byrå.

Med vänlig hälsning,

${v.HANDLÄGGARE || '___'}
${v.BYRÅ || '___'}`,
  },
  {
    id: 'fullmakt',
    name: 'Fullmakt',
    category: 'Processer',
    description: 'Generell fullmakt att företräda klient i juridiska ärenden.',
    emoji: '⚖️',
    color: 'emerald',
    fields: [
      { key: 'FULLMAKTSGIVARE', label: 'Fullmaktsgivare (klientens namn)', placeholder: 'Anna Lindström', required: true },
      { key: 'PERSONNUMMER', label: 'Personnummer / Org.nr', placeholder: '19801010-1234', required: true },
      { key: 'FULLMAKTSHAVARE', label: 'Fullmaktshavare (advokatens namn)', placeholder: 'Erik Svensson', required: true },
      { key: 'BYRÅ', label: 'Byråns namn', placeholder: 'Advokatbyrån AB', required: true },
      { key: 'ÄNDAMÅL', label: 'Ändamål / Uppdragsbeskrivning', placeholder: 'Att företräda undertecknad i tvisten rörande…', multiline: true, required: true },
      { key: 'GILTIGHET', label: 'Giltighetstid', placeholder: 'Tills vidare / t.o.m. ÅÅÅÅ-MM-DD', required: true },
    ],
    render: v => `FULLMAKT

Datum: ${today()}

FULLMAKTSGIVARE
Namn: ${v.FULLMAKTSGIVARE || '___'}
Personnummer / Org.nr: ${v.PERSONNUMMER || '___'}

FULLMAKTSHAVARE
Namn: ${v.FULLMAKTSHAVARE || '___'}
Byrå: ${v.BYRÅ || '___'}

UPPDRAG
Undertecknad ger härmed ${v.FULLMAKTSHAVARE || '___'} vid ${v.BYRÅ || '___'} fullmakt att å undertecknads vägnar:

${v.ÄNDAMÅL || '[Beskriv uppdraget]'}

Fullmaktshavaren äger rätt att vidta alla de åtgärder som erfordras för att utföra uppdraget, inklusive att mottaga delgivning, ingå förlikning, föra talan inför domstol samt anlita biträdande ombud.

GILTIGHETSTID
Denna fullmakt gäller: ${v.GILTIGHET || 'Tills vidare'}

Ort och datum: ________________, ${today()}

Underskrift: ____________________________
Namnförtydligande: ${v.FULLMAKTSGIVARE || '___'}`,
  },
  {
    id: 'uppdragsavtal',
    name: 'Uppdragsavtal',
    category: 'Avtal',
    description: 'Uppdragsbrevöverenskommelse (engagement letter) med klient.',
    emoji: '📋',
    color: 'blue',
    fields: [
      { key: 'BYRÅ', label: 'Byråns namn', placeholder: 'Advokatbyrån AB', required: true },
      { key: 'HANDLÄGGARE', label: 'Ansvarig handläggare', placeholder: 'Erik Svensson', required: true },
      { key: 'KLIENT', label: 'Klientens namn', placeholder: 'Anna Lindström', required: true },
      { key: 'UPPDRAGSBESKRIVNING', label: 'Uppdragsbeskrivning', placeholder: 'Rådgivning och biträde i tvistemål avseende…', multiline: true, required: true },
      { key: 'TIMARVODE', label: 'Timarvode (kr/tim)', placeholder: '2 500', required: true },
      { key: 'FÖRSKOTT', label: 'Förskott (kr)', placeholder: '10 000' },
      { key: 'FAKTURAINTERVALL', label: 'Fakturaintervall', placeholder: 'Månadsvis' },
    ],
    render: v => `UPPDRAGSAVTAL

${v.BYRÅ || '___'}
${v.HANDLÄGGARE || '___'}
Datum: ${today()}

Klient: ${v.KLIENT || '___'}

UPPDRAG
Vi åtar oss härmed uppdraget att bistå er med följande:
${v.UPPDRAGSBESKRIVNING || '[Beskriv uppdraget]'}

ARVODE OCH KOSTNADER
Timarvode: ${v.TIMARVODE || '___'} kr/timme (exkl. moms)
Förskott: ${v.FÖRSKOTT || 'Inget förskott avtalat'} kr
Fakturering: ${v.FAKTURAINTERVALL || 'Månadsvis'}

Utlägg (resekostnader, domstolsavgifter m.m.) debiteras mot kvitto utöver timarvodet.

KOMMUNIKATION OCH SEKRETESS
Samtliga handlingar och upplysningar som vi erhåller i samband med uppdraget behandlas konfidentiellt i enlighet med advokatetiska regler. Vi är föremål för tillsynen av Advokatsamfundet.

AVSLUTNING AV UPPDRAG
Endera part äger rätt att säga upp detta avtal med omedelbar verkan. Upparbetat arvode debiteras för utfört arbete.

Vänligen bekräfta att ni tagit del av villkoren genom att underteckna och returnera en kopia av detta brev.

Med vänlig hälsning,

${v.HANDLÄGGARE || '___'}
${v.BYRÅ || '___'}

Klientens underskrift: ____________________________   Datum: ___________
Namnförtydligande: ${v.KLIENT || '___'}`,
  },
  {
    id: 'sekretessavtal',
    name: 'Sekretessavtal (NDA)',
    category: 'Avtal',
    description: 'Ömsesidigt sekretessavtal mellan två parter.',
    emoji: '🔒',
    color: 'violet',
    fields: [
      { key: 'PART_A', label: 'Part A (namn / org.nr)', placeholder: 'Bolaget AB, 556000-0000', required: true },
      { key: 'PART_B', label: 'Part B (namn / org.nr)', placeholder: 'Anna Lindström', required: true },
      { key: 'ÄNDAMÅL', label: 'Ändamål med samarbetet', placeholder: 'Utbyte av konfidentiell information i syfte att utvärdera ett potentiellt förvärv av…', multiline: true, required: true },
      { key: 'GILTIGHETSTID', label: 'Giltighetstid (år)', placeholder: '3', required: true },
      { key: 'VITESBELOPP', label: 'Vitesbelopp (kr)', placeholder: '500 000' },
    ],
    render: v => `SEKRETESSAVTAL (NDA)

Datum: ${today()}

PARTER
Part A: ${v.PART_A || '___'}
Part B: ${v.PART_B || '___'}

BAKGRUND OCH ÄNDAMÅL
Parterna avser att samarbeta avseende: ${v.ÄNDAMÅL || '[Beskriv ändamålet]'}

I samband med detta samarbete kan parterna komma att utbyta konfidentiell information varför parterna önskar reglera sekretessen enligt nedan.

DEFINITION AV KONFIDENTIELL INFORMATION
Med konfidentiell information avses all information, oavsett form (skriftlig, muntlig, digital), som en part delger den andra parten och som är märkt som konfidentiell eller borde förstås vara konfidentiell utifrån sin natur.

SEKRETESSÅTAGANDE
Vardera part förbinder sig att (i) inte röja konfidentiell information till tredje man utan den andra partens skriftliga samtycke; (ii) enbart använda informationen för ändamålet ovan; (iii) vidta rimliga säkerhetsåtgärder för att skydda informationen.

GILTIGHETSTID
Detta avtal gäller i ${v.GILTIGHETSTID || '3'} år från undertecknandedatum och fortlöper sedan tills vidare med 3 månaders uppsägningstid.

VITE
Vid brott mot detta avtal utgår ett omedelbart förfallet vite om ${v.VITESBELOPP || '___'} kr, utan krav på att skada behöver bevisas.

TILLÄMPLIG LAG
Svensk lag. Tvister avgörs av allmän domstol med Stockholms tingsrätt som första instans.

Part A: ____________________________   Datum: ___________
${v.PART_A || '___'}

Part B: ____________________________   Datum: ___________
${v.PART_B || '___'}`,
  },
  {
    id: 'forlikningsavtal',
    name: 'Förlikningsavtal',
    category: 'Tvistemål',
    description: 'Avtal som reglerar en förlikning och avslutar en tvist.',
    emoji: '🤝',
    color: 'amber',
    fields: [
      { key: 'PART_A', label: 'Part A (kärande / klient)', placeholder: 'Anna Lindström', required: true },
      { key: 'PART_B', label: 'Part B (svarande / motpart)', placeholder: 'Bolaget AB', required: true },
      { key: 'TVISTEFRÅGA', label: 'Tvistefråga (kort beskrivning)', placeholder: 'Avtalstvist avseende leverans av varor', multiline: true, required: true },
      { key: 'FÖRLIKNINGSBELOPP', label: 'Förlikningsbelopp (kr)', placeholder: '75 000', required: true },
      { key: 'BETALNINGSVILLKOR', label: 'Betalningsvillkor', placeholder: 'Betalning senast 30 dagar från undertecknandet', required: true },
      { key: 'ÖMSESIDIG_FRIGÖRELSE', label: 'Ytterligare villkor', placeholder: 'Parterna avstår från alla övriga krav med anledning av tvisteförhållandet.' },
    ],
    render: v => `FÖRLIKNINGSAVTAL

Datum: ${today()}

PARTER
Part A: ${v.PART_A || '___'}
Part B: ${v.PART_B || '___'}

BAKGRUND
Parterna har haft en tvist avseende: ${v.TVISTEFRÅGA || '[Beskriv tvisten]'}

FÖRLIKNING
Parterna är överens om att avsluta tvisten på följande villkor:

1. FÖRLIKNINGSBELOPP
   ${v.PART_B || '___'} erlägger till ${v.PART_A || '___'} ett förlikningsbelopp om ${v.FÖRLIKNINGSBELOPP || '___'} kr.

2. BETALNINGSVILLKOR
   ${v.BETALNINGSVILLKOR || '___'}

3. FRIGÖRELSEKLAUSUL
   ${v.ÖMSESIDIG_FRIGÖRELSE || 'Parterna friskriver härmed varandra från alla nuvarande och framtida krav som hänför sig till tvisteförhållandet.'}

4. ÅTERKALLELSE AV TALAN
   Eventuell rättslig talan med anledning av tvisten ska återkallas snarast möjligt efter att förlikningsbeloppet erlagts.

5. SEKRETESS
   Villkoren i detta avtal är konfidentiella. Parterna förbinder sig att inte röja dem utan den andra partens samtycke.

Part A: ____________________________   Datum: ___________
${v.PART_A || '___'}

Part B: ____________________________   Datum: ___________
${v.PART_B || '___'}`,
  },
  {
    id: 'staemningsansoekan',
    name: 'Stämningsansökan',
    category: 'Domstolsförfarande',
    description: 'Underlag för stämningsansökan till tingsrätten.',
    emoji: '🏛️',
    color: 'indigo',
    fields: [
      { key: 'KÄRANDE', label: 'Kärande (klientens namn + adress)', placeholder: 'Anna Lindström, Storgatan 1, 111 22 Stockholm', required: true },
      { key: 'SVARANDE', label: 'Svarande (motpartens namn + adress)', placeholder: 'Bolaget AB, Handelsgatan 5, 222 33 Göteborg', required: true },
      { key: 'DOMSTOL', label: 'Behörig domstol', placeholder: 'Stockholms tingsrätt', required: true },
      { key: 'YRKANDEN', label: 'Yrkanden (vad käranden yrkar)', placeholder: '1. Att tingsrätten förpliktar svaranden att betala…', multiline: true, required: true },
      { key: 'GRUNDER', label: 'Grunder (rättslig och faktisk grund)', placeholder: 'Avtalet ingicks den…, svaranden har brustit i…', multiline: true, required: true },
      { key: 'BEVIS', label: 'Bevisning', placeholder: 'Avtal daterat…, e-postkorrespondens…' },
    ],
    render: v => `STÄMNINGSANSÖKAN
Till ${v.DOMSTOL || '___'}
Datum: ${today()}

KÄRANDE
${v.KÄRANDE || '___'}
Ombud: [Advokatens namn och byrå]

SVARANDE
${v.SVARANDE || '___'}

YRKANDEN
Käranden yrkar att tingsrätten:
${v.YRKANDEN || '[Ange yrkanden]'}

Käranden yrkar vidare att svaranden förpliktas ersätta kärandens rättegångskostnader.

GRUNDER
${v.GRUNDER || '[Ange rättslig och faktisk grund]'}

BEVISNING
Käranden åberopar som bevisning:
${v.BEVIS || '[Ange bevisning]'}

BILAGOR
Bilaga 1: [Avtal / relevant handling]
[Komplettera med aktuella bilagor]

Ort och datum: ________________, ${today()}

Underskrift: ____________________________
[Ombudet / advokatens namnförtydligande]`,
  },
]

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
type View = 'gallery' | 'compose' | 'preview'

interface SavedDoc {
  id: string
  templateName: string
  variables: string
  case?: { id: string; title: string } | null
  createdBy?: { name: string | null; email: string } | null
  createdAt: string
}

// ────────────────────────────────────────────────────────────
// Color helper
// ────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
  emerald:{ bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
}

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [view, setView] = useState<View>('gallery')
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [cases, setCases] = useState<{ id: string; title: string }[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    fetch('/api/cases').then(r => r.json()).then(d => { if (Array.isArray(d)) setCases(d) })
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data.user && !data.user.modules?.includes('docs')) setAccessDenied(true) })
      .catch(err => { console.error('Failed to check module access:', err) })
  }, [])

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch('/api/docs')
      const d = await res.json()
      if (Array.isArray(d)) setSavedDocs(d)
    } finally {
      setLoadingHistory(false)
    }
  }

  const selectTemplate = (t: DocTemplate) => {
    setSelectedTemplate(t)
    setFields({})
    setSelectedCaseId('')
    setSaveSuccess(false)
    setView('compose')
  }

  const generatePreview = () => {
    if (!selectedTemplate) return ''
    return selectedTemplate.render(fields)
  }

  const handlePrint = () => window.print()

  const handleSave = async () => {
    if (!selectedTemplate) return
    setSaving(true)
    try {
      const res = await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName: selectedTemplate.name,
          content: generatePreview(),
          variables: JSON.stringify(fields),
          caseId: selectedCaseId || undefined,
        }),
      })
      if (res.ok) {
        setSaveSuccess(true)
        loadHistory()
      }
    } finally {
      setSaving(false)
    }
  }

  const allRequiredFilled = selectedTemplate
    ? selectedTemplate.fields.filter(f => f.required).every(f => (fields[f.key] ?? '').trim() !== '')
    : false

  if (accessDenied) return <AccessDenied moduleName="CaseCore Docs" />

  // ── Gallery view ────────────────────────────────────────
  if (view === 'gallery') {
    return (
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-indigo-400" />
                CaseCore Docs
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Välj en mall, fyll i variablerna och generera ett färdigt juridiskt dokument.
              </p>
            </div>
            <button
              onClick={() => { setShowHistory(h => !h); if (!showHistory) loadHistory() }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm transition"
            >
              <History className="w-4 h-4" />
              Dokumenthistorik
            </button>
          </div>

          {/* History panel */}
          {showHistory && (
            <div className="mb-8 bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                Sparade dokument
              </h2>
              {loadingHistory ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : savedDocs.length === 0 ? (
                <p className="text-slate-500 text-sm">Inga sparade dokument ännu.</p>
              ) : (
                <div className="space-y-2">
                  {savedDocs.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-white">{d.templateName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {d.case?.title && <span className="mr-2">📁 {d.case.title}</span>}
                          {new Date(d.createdAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map(t => {
              const c = colorMap[t.color] ?? colorMap.blue
              return (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className="text-left p-6 bg-slate-900 rounded-2xl border border-white/[0.08] hover:border-white/20 hover:bg-slate-800/80 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 ${c.bg} ${c.border} border rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {t.emoji}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition">{t.name}</h3>
                    <span className={`text-[10px] font-black ${c.text} ${c.bg} ${c.border} border px-2 py-0.5 rounded-full whitespace-nowrap`}>
                      {t.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Plus className="w-3 h-3" />
                    {t.fields.length} variabler
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </main>
    )
  }

  // ── Compose view ────────────────────────────────────────
  if (view === 'compose' && selectedTemplate) {
    const c = colorMap[selectedTemplate.color] ?? colorMap.blue
    return (
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">

          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setView('gallery')}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>{selectedTemplate.emoji}</span>
                {selectedTemplate.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedTemplate.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: form */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Fyll i variabler</h2>

              <div className="space-y-4">
                {selectedTemplate.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">
                      {f.label}
                      {f.required && <span className="text-red-400 ml-0.5">*</span>}
                    </label>
                    {f.multiline ? (
                      <textarea
                        value={fields[f.key] ?? ''}
                        onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        rows={3}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={fields[f.key] ?? ''}
                        onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                      />
                    )}
                  </div>
                ))}

                {/* Optional: link to case */}
                {cases.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">
                      Kopplat ärende (valfritt)
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCaseId}
                        onChange={e => setSelectedCaseId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none pr-8"
                      >
                        <option value="">Inget ärende</option>
                        {cases.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                <button
                  onClick={() => setView('preview')}
                  disabled={!allRequiredFilled}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  <FileText className="w-4 h-4" />
                  Förhandsgranska
                </button>
              </div>
            </div>

            {/* Right: live preview */}
            <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Förhandsgranskning</h2>
              <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-5 min-h-64">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                  {generatePreview() || <span className="text-slate-600 italic">Fyll i variablerna för att se dokumentet…</span>}
                </pre>
              </div>
            </div>

          </div>
        </div>
      </main>
    )
  }

  // ── Preview / print view ────────────────────────────────
  if (view === 'preview' && selectedTemplate) {
    const preview = generatePreview()
    return (
      <>
        {/* Print toolbar (hidden in print) */}
        <div className="print:hidden sticky top-0 z-40 bg-slate-950 border-b border-white/[0.08] flex items-center justify-between px-6 py-3 gap-4">
          <button
            onClick={() => setView('compose')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </button>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" /> Sparat!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2 rounded-lg font-bold text-sm transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Sparar…' : 'Spara'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
            >
              <Printer className="w-4 h-4" />
              Skriv ut / PDF
            </button>
          </div>
        </div>

        {/* Document */}
        <main className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white p-12 md:p-20 shadow-xl print:shadow-none min-h-[1056px] text-slate-900 leading-relaxed">
              <div className="flex justify-between items-start mb-12 border-b-2 border-slate-800 pb-8 print:mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">CaseCore Docs</span>
                  </div>
                  <p className="text-slate-500 text-sm">Automatiskt genererat juridiskt dokument</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Datum</p>
                  <p className="font-bold text-slate-800">{today()}</p>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-8 font-sans text-slate-900">
                {preview}
              </pre>
              <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center print:mt-8">
                Genererat av CaseCore Docs · {today()}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return null
}
