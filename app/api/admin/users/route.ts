import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

async function requireAdmin(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) return { error: 'Ej inloggad', status: 401 }
  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user?.isAdmin) return { error: 'Åtkomst nekad', status: 403 }
  return null
}

// GET /api/admin/users — Hämta alla användare (endast admin)
export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      modules: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ users })
}
