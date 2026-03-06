import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    const body = await req.json();

    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: body.description,
        hours: parseFloat(body.hours),
        caseId: caseId,
      }
    });

    // Logga automatiskt att tid har lagts till
    await prisma.log.create({
      data: {
        action: `Tidrapportering: ${body.hours}h (${body.description})`,
        caseId: caseId
      }
    });

    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Kunde inte spara tiden' }, { status: 500 });
  }
}