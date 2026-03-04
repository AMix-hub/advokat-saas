import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Hämtar alla klienter
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta klienter' }, { status: 500 })
  }
}

// Skapar en ny klient
export async function POST(req: Request) {
  try {
    const { name, email, orgNr } = await req.json()
    
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        orgNr,
      }
    })
    
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("Fel vid skapande av klient:", error)
    return NextResponse.json({ error: 'Kunde inte skapa klient' }, { status: 500 })
  }
}