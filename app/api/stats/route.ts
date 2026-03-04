import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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