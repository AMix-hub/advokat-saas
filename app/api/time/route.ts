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
    
    return NextResponse.json(timeEntry)
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel vid tidsregistreringen' }, { status: 500 })
  }
}