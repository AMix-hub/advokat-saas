import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        amount: parseFloat(body.amount),
        caseId: body.caseId,
      }
    })
    
    // Logga händelsen automatiskt
    await prisma.log.create({
      data: { 
        action: `Registrerade utlägg: ${body.amount} kr (${body.description})`, 
        caseId: body.caseId 
      }
    })
    
    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte spara utlägget' }, { status: 500 })
  }
}