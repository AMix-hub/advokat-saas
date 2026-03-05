import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Skapa en logg på att ärendet har ändrats
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