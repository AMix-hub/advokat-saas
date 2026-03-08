import { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
