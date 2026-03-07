import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user) return NextResponse.json({ error: 'Användaren hittades inte' }, { status: 401 })

  const cases = await prisma.case.findMany({
    where: { assignedToId: user.id },
    include: { client: true, timeEntries: true },
    orderBy: { createdAt: 'desc' }
  })

  // Vi använder semikolon (;) för att svenska Excel ska förstå kolumnerna
  let csv = 'Ärende;Klient;Status;Timtaxa;Loggade Timmar;Fakturerbart Belopp (SEK)\n'

  cases.forEach(c => {
    const totalHours = c.timeEntries.reduce((acc, curr) => acc + curr.hours, 0)
    const totalAmount = totalHours * c.hourlyRate
    csv += `${c.title};${c.client.name};${c.status};${c.hourlyRate};${totalHours};${totalAmount}\n`
  })

  // Vi lägger till en BOM (\uFEFF) i början så Excel förstår svenska tecken som ÅÄÖ
  const buffer = Buffer.from('\uFEFF' + csv, 'utf-8')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="casecore-export.csv"',
    },
  })
}