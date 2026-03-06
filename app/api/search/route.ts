import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get('q')

  // Kräver minst 2 tecken för att inte belasta databasen i onödan
  if (!query || query.length < 2) {
    return NextResponse.json({ clients: [], cases: [] })
  }

  try {
    const clients = await prisma.client.findMany({
      where: { 
        OR: [ 
          { name: { contains: query, mode: 'insensitive' } }, 
          { orgNr: { contains: query, mode: 'insensitive' } } 
        ] 
      },
      take: 5 // Visar max 5 snabba träffar
    })

    const cases = await prisma.case.findMany({
      where: { 
        OR: [ 
          { title: { contains: query, mode: 'insensitive' } } 
        ] 
      },
      include: { client: true },
      take: 5
    })

    return NextResponse.json({ clients, cases })
  } catch (error) {
    return NextResponse.json({ error: 'Sökningen misslyckades' }, { status: 500 })
  }
}