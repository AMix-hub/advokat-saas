import { ReactNode } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import Sidebar from '@/components/Sidebar'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <div className="flex h-screen overflow-hidden bg-slate-950">
        {/* Sidebar handles desktop + mobile header/drawer */}
        <Sidebar />

        {/* Main Content — padded top on mobile for the fixed header strip */}
        <main className="flex-1 overflow-auto pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </SessionWrapper>
  )
}
