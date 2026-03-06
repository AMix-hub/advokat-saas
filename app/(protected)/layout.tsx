import { ReactNode } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import Sidebar from '@/components/Sidebar'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionWrapper>
  )
}
