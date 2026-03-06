import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null
    const userName = user?.name || 'En kollega'

    const body = await req.json()
    
    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: body.description,
        hours: parseFloat(body.hours),
        caseId: body.caseId,
      }
    })
    
    // Skriv in ANVÄNDARENS NAMN i loggen!
    await prisma.log.create({
      data: { 
        action: `${userName} loggade tid: ${body.hours} h (${body.description})`, 
        caseId: body.caseId 
      }
    })

    // Lägg automatiskt till tidsraden på aktiv utkast-faktura om en finns
    const draftInvoice = await prisma.invoice.findFirst({
      where: { caseId: body.caseId, status: 'DRAFT' }
    })

    if (draftInvoice) {
      const caseData = await prisma.case.findUnique({
        where: { id: body.caseId },
        select: { hourlyRate: true }
      })
      const hourlyRate = caseData?.hourlyRate ?? 0
      const hours = parseFloat(body.hours)
      const itemAmount = hours * hourlyRate

      await prisma.invoiceItem.create({
        data: {
          description: body.description,
          quantity: hours,
          unitPrice: hourlyRate,
          amount: itemAmount,
          invoiceId: draftInvoice.id
        }
      })

      await prisma.invoice.update({
        where: { id: draftInvoice.id },
        data: { totalAmount: { increment: itemAmount } }
      })
    }
    
    return NextResponse.json(timeEntry)
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel vid tidsregistreringen' }, { status: 500 })
  }
}