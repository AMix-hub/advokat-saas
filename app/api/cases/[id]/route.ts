import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null
    const userName = user?.name || 'En kollega'

    const resolvedParams = await params;
    const body = await req.json()
    
    const updatedCase = await prisma.case.update({
      where: { id: resolvedParams.id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        hourlyRate: parseFloat(body.hourlyRate),
      }
    })

    // Skriv in ANVÄNDARENS NAMN i loggen!
    await prisma.log.create({
      data: { 
        action: `${userName} uppdaterade ärendet (Ny status: ${body.status})`, 
        caseId: resolvedParams.id 
      }
    })

    return NextResponse.json(updatedCase)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte uppdatera ärendet' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    await prisma.log.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.task.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.timeEntry.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.document.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.expense.deleteMany({ where: { caseId: resolvedParams.id } })
    
    await prisma.case.delete({ where: { id: resolvedParams.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte radera ärendet' }, { status: 500 })
  }
}