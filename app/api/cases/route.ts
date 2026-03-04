import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      include: { client: true }
    })
    return NextResponse.json(cases)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta ärenden' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, clientId } = await req.json()
    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        clientId,
        logs: {
          create: { action: 'Ärende skapat via webbgränssnitt' }
        }
      }
    })
    return NextResponse.json(newCase, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte skapa ärende' }, { status: 500 })
  }
}