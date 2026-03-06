import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    
    // Kontrollera om e-posten redan finns för att undvika krockar
    const existingClient = await prisma.client.findUnique({
      where: { email: body.email }
    })

    if (existingClient) {
      return NextResponse.json({ error: 'En klient med denna e-post finns redan.' }, { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        orgNr: body.orgNr,
      }
    })
    
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte skapa klienten' }, { status: 500 })
  }
}