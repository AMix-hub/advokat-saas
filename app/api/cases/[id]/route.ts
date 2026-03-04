import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    const body = await req.json();

    // Uppdatera status
    if (body.action === 'UPDATE_STATUS') {
      const updatedCase = await prisma.case.update({
        where: { id: caseId },
        data: {
          status: body.status,
          logs: { create: { action: `Ändrade status till: ${body.status}` } }
        }
      });
      return NextResponse.json(updatedCase);
    }

    // Redigera ärendets detaljer (Titel, beskrivning, taxa)
    if (body.action === 'UPDATE_DETAILS') {
      const updatedCase = await prisma.case.update({
        where: { id: caseId },
        data: {
          title: body.title,
          description: body.description,
          hourlyRate: parseFloat(body.hourlyRate),
          logs: { create: { action: `Uppdaterade ärendets detaljer och taxa.` } }
        }
      });
      return NextResponse.json(updatedCase);
    }

    // Lägg till en logganteckning
    if (body.action === 'ADD_LOG') {
      const newLog = await prisma.log.create({
        data: { caseId: caseId, action: body.note }
      });
      return NextResponse.json(newLog);
    }

    return NextResponse.json({ error: 'Ogiltig åtgärd' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ett fel uppstod' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    await prisma.log.deleteMany({ where: { caseId } });
    await prisma.timeEntry.deleteMany({ where: { caseId } });
    await prisma.document.deleteMany({ where: { caseId } });
    await prisma.case.delete({ where: { id: caseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Kunde inte radera ärendet' }, { status: 500 });
  }
}