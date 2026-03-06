import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import MobileNavigation from '@/components/MobileNavigation'
import UserProfile from '@/components/UserProfile'
import { Building2, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-slate-50 flex-col lg:flex-row">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-blue-900 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-black text-slate-900">
                Case<span className="text-blue-600">Core</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <UserProfile />
              <MobileNavigation />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
