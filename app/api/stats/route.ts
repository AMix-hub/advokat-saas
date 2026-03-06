import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })
  try {
    const totalClients = await prisma.client.count();
    const openCases = await prisma.case.count({ where: { status: 'OPEN' } });
    const closedCases = await prisma.case.count({ where: { status: 'CLOSED' } });
    
    // Summera alla fakturerbara timmar i hela systemet
    const timeEntries = await prisma.timeEntry.aggregate({
      _sum: { hours: true }
    });

    return NextResponse.json({
      totalClients,
      openCases,
      closedCases,
      totalHours: timeEntries._sum.hours || 0
    });
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta statistik' }, { status: 500 });
  }
}