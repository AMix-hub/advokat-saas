import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: token.email } })
    const userName = user?.name || 'En kollega'

    const resolvedParams = await params;
    const body = await req.json()

    // Ownership check: only the assigned user (or an admin) may update the case
    const existingCase = await prisma.case.findUnique({ where: { id: resolvedParams.id } })
    if (!existingCase) return NextResponse.json({ error: 'Ärendet hittades inte' }, { status: 404 })
    if (existingCase.assignedToId !== user?.id && !user?.isAdmin) {
      return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
    }
    
    // Vi kollar om requesten skickar med invoiceStatus, annars låter vi bli det fältet
    const dataToUpdate: any = {
      title: body.title,
      description: body.description,
      status: body.status,
    }
    
    if (body.hourlyRate) dataToUpdate.hourlyRate = parseFloat(body.hourlyRate)
    if (body.invoiceStatus) dataToUpdate.invoiceStatus = body.invoiceStatus

    const updatedCase = await prisma.case.update({
      where: { id: resolvedParams.id },
      data: dataToUpdate
    })

    // Logga bara om det är en status/fakturaändring, inte om vi sparar t.ex. titeln (undviker spam)
    if (body.status || body.invoiceStatus) {
      const actionText = body.invoiceStatus 
        ? `${userName} ändrade fakturastatus till: ${body.invoiceStatus}`
        : `${userName} uppdaterade ärendestatus till: ${body.status}`
        
      await prisma.log.create({
        data: { action: actionText, caseId: resolvedParams.id }
      })
    }

    return NextResponse.json(updatedCase)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte uppdatera ärendet' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: token.email } })
    const resolvedParams = await params;

    // Ownership check: only the assigned user (or an admin) may delete the case
    const existingCase = await prisma.case.findUnique({ where: { id: resolvedParams.id } })
    if (!existingCase) return NextResponse.json({ error: 'Ärendet hittades inte' }, { status: 404 })
    if (existingCase.assignedToId !== user?.id && !user?.isAdmin) {
      return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
    }

    await prisma.log.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.task.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.timeEntry.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.document.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.expense.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.case.delete({ where: { id: resolvedParams.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte radera' }, { status: 500 })
  }
}