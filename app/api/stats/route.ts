import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })
  try {
    const user = await prisma.user.findUnique({ where: { email: token.email } })
    if (!user) return NextResponse.json({ error: 'Användaren hittades inte' }, { status: 401 })

    const totalClients = await prisma.client.count({ where: { createdById: user.id } })
    const openCases = await prisma.case.count({ where: { status: 'OPEN', assignedToId: user.id } })
    const closedCases = await prisma.case.count({ where: { status: 'CLOSED', assignedToId: user.id } })
    
    // Summera alla fakturerbara timmar för den inloggade användaren
    const timeEntries = await prisma.timeEntry.aggregate({
      where: { case: { assignedToId: user.id } },
      _sum: { hours: true }
    })

    return NextResponse.json({
      totalClients,
      openCases,
      closedCases,
      totalHours: timeEntries._sum.hours || 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta statistik' }, { status: 500 })
  }
}