import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET /api/kommunikation — list messages (optionally filtered by clientId or search query)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId') ?? undefined
    const q = searchParams.get('q') ?? undefined

    const messages = await prisma.message.findMany({
      where: {
        ...(clientId ? { clientId } : {}),
        ...(q
          ? {
              OR: [
                { subject: { contains: q, mode: 'insensitive' } },
                { body: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        case: { select: { id: true, title: true } },
        sender: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Kunde inte hämta meddelanden' }, { status: 500 })
  }
}

// POST /api/kommunikation — create a new outbound message
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { clientId, subject, body, caseId } = await req.json()

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Klient saknas' }, { status: 400 })
    }
    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({ error: 'Ämne saknas' }, { status: 400 })
    }
    if (!body || typeof body !== 'string' || body.trim() === '') {
      return NextResponse.json({ error: 'Meddelandetext saknas' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: token.email } })
    if (!user) return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })

    // Validate that the client exists
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return NextResponse.json({ error: 'Klient hittades inte' }, { status: 404 })

    // If a caseId is provided, validate it belongs to the client
    if (caseId && typeof caseId === 'string') {
      const caseRecord = await prisma.case.findFirst({ where: { id: caseId, clientId } })
      if (!caseRecord) return NextResponse.json({ error: 'Ärendet tillhör inte klienten' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        subject: subject.trim(),
        body: body.trim(),
        direction: 'OUTBOUND',
        clientId,
        senderId: user.id,
        ...(caseId && typeof caseId === 'string' ? { caseId } : {}),
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        case: { select: { id: true, title: true } },
        sender: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 })
  }
}

// PATCH /api/kommunikation?id=xxx — mark a message as read
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Meddelande-ID saknas' }, { status: 400 })

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    })

    return NextResponse.json(message)
  } catch {
    return NextResponse.json({ error: 'Kunde inte uppdatera meddelande' }, { status: 500 })
  }
}
