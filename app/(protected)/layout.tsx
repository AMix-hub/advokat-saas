import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
