import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId') ?? undefined

    const cases = await prisma.case.findMany({
      where: clientId ? { clientId } : undefined,
      select: { id: true, title: true, status: true },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(cases)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte hämta ärenden' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Hämta inloggad användare för loggboken
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null
    const userName = user?.name || 'En handläggare'

    const body = await req.json()
    
    // Skapa det nya ärendet i databasen
    const newCase = await prisma.case.create({
      data: {
        title: body.title,
        description: body.description,
        hourlyRate: parseFloat(body.hourlyRate),
        status: 'OPEN',
        clientId: body.clientId,
        assignedToId: body.assignedToId || user?.id, // Sätt ansvarig
      }
    })

    // Skapa en första händelse i loggboken
    await prisma.log.create({
      data: { 
        action: `${userName} skapade ärendet och öppnade akten.`, 
        caseId: newCase.id 
      }
    })

    // Returnera det nya ärendet så vi kan skicka användaren till rätt sida
    return NextResponse.json(newCase)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte skapa ärendet' }, { status: 500 })
  }
}