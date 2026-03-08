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

// GET /api/admin/overview — Plattformsöversikt för webmaster (endast admin)
export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  const [users, totalCases, totalClients, activeCodes] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        firmName: true,
        isAdmin: true,
        licenseType: true,
        modules: true,
        createdAt: true,
        _count: { select: { cases: true, createdClients: true } },
      },
    }),
    prisma.case.count(),
    prisma.client.count(),
    prisma.activationCode.count({ where: { isActive: true } }),
  ])

  const stats = {
    totalUsers: users.length,
    totalCases,
    totalClients,
    activeCodeCount: activeCodes,
    soloUsers: users.filter(u => u.licenseType === 'SOLO').length,
    byraUsers: users.filter(u => u.licenseType === 'BYRA').length,
    trialUsers: users.filter(u => u.licenseType === 'TRIAL').length,
  }

  return NextResponse.json({ stats, users })
}
