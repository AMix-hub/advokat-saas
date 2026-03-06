export const dynamic = 'force-dynamic'

import ResetPasswordForm from './ResetPasswordForm'

// Denna server-komponent krävs för att kunna ta emot token från URL:en (t.ex. ?token=123) säkert
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const resolvedParams = await searchParams
  const token = resolvedParams.token || ''

  return (
    <main className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}