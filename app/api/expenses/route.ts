import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null
    const userName = user?.name || 'En kollega'

    const body = await req.json()
    
    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        amount: parseFloat(body.amount),
        caseId: body.caseId,
      }
    })
    
    // Skriv in ANVÄNDARENS NAMN i loggen!
    await prisma.log.create({
      data: { 
        action: `${userName} registrerade ett utlägg: ${body.amount} kr (${body.description})`, 
        caseId: body.caseId 
      }
    })
    
    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte spara utlägget' }, { status: 500 })
  }
}