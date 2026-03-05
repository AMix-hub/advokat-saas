'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md print:hidden flex items-center gap-2"
    >
      🖨️ Skriv ut / Spara som PDF
    </button>
  )
}