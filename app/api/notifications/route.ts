import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET - Hämta notification logs
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const status = req.nextUrl.searchParams.get('status')
    const type = req.nextUrl.searchParams.get('type')

    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type

    const logs = await prisma.notificationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching notification logs:', error)
    return NextResponse.json({ error: 'Could not fetch logs' }, { status: 500 })
  }
}

// POST - Skapa och skicka notification
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { type, recipient, subject, message, caseId, deadlineId, invoiceId } = body

    if (!type || !recipient || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, recipient, message' },
        { status: 400 }
      )
    }

    // Skapa loggpost
    const notificationLog = await prisma.notificationLog.create({
      data: {
        type,
        recipient,
        subject: subject || null,
        message,
        caseId: caseId || null,
        deadlineId: deadlineId || null,
        invoiceId: invoiceId || null,
        status: 'PENDING'
      }
    })

    // Simulera att skicka (i produktion skulle detta anropa Resend API eller Twilio)
    try {
      // TODO: Implementera faktisk e-mail/SMS sending med Resend/Twilio
      // För nu: bara markera som sent
      await prisma.notificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })

      return NextResponse.json({
        ...notificationLog,
        status: 'SENT',
        sentAt: new Date()
      }, { status: 201 })
    } catch (sendError) {
      await prisma.notificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: 'FAILED',
          error: String(sendError),
          retries: 1
        }
      })
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Could not create notification' }, { status: 500 })
  }
}
