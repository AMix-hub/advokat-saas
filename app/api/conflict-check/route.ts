import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET: Hämtar historiken över den inloggade användarens sökningar
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: token.email } })

    const logs = await prisma.conflictLog.findMany({
      where: { userId: user?.id },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50 // Visar de 50 senaste sökningarna
    })
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta loggar' }, { status: 500 })
  }
}

// POST: Utför själva sökningen och sparar i loggen
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null

    const { query } = await req.json()
    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Sökordet måste vara minst 2 tecken' }, { status: 400 })
    }

    // Sök i klientregistret (Namn, Orgnr, E-post)
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { orgNr: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ]
      }
    })

    // Sök i ärenderegistret (Titel och Beskrivning)
    const cases = await prisma.case.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { client: true }
    })

    const totalMatches = clients.length + cases.length

    // Skapa det oförstörbara beviset i databasen
    const log = await prisma.conflictLog.create({
      data: {
        searchTerm: query,
        matchesFound: totalMatches,
        userId: user?.id
      }
    })

    return NextResponse.json({ clients, cases, log })
  } catch (error) {
    return NextResponse.json({ error: 'Ett fel uppstod vid jävsprövningen' }, { status: 500 })
  }
}