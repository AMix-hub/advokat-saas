import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Uppdatera ett ärende (Detta lade vi till i förra steget)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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

    await prisma.log.create({
      data: { 
        action: `Ärendet uppdaterades (Ny status: ${body.status})`, 
        caseId: resolvedParams.id 
      }
    })

    return NextResponse.json(updatedCase)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte uppdatera ärendet' }, { status: 500 })
  }
}

// NYTT: Radera ett ärende helt och hållet
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // 1. Ta först bort alla relaterade rader så vi inte får felmeddelanden i databasen
    await prisma.log.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.task.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.timeEntry.deleteMany({ where: { caseId: resolvedParams.id } })
    await prisma.document.deleteMany({ where: { caseId: resolvedParams.id } })
    
    // 2. Ta därefter bort själva ärendet
    await prisma.case.delete({ where: { id: resolvedParams.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte radera ärendet' }, { status: 500 })
  }
}