import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const resolvedParams = await params;
    const body = await req.json()

    // HANTERA GDPR - RADERING
    if (body.action === 'GDPR_ANONYMIZE') {
      const updatedClient = await prisma.client.update({
        where: { id: resolvedParams.id },
        data: {
          name: `Anonymiserad Klient (GDPR)`,
          email: `raderad_${Date.now()}@gdpr.local`,
          orgNr: 'Raderad',
          isAnonymized: true,
          kycNotes: 'All kundkännedom raderad enligt GDPR-begäran.'
        }
      })
      return NextResponse.json(updatedClient)
    }

    // HANTERA KYC - KUNDKÄNNEDOM
    if (body.action === 'UPDATE_KYC') {
      const updatedClient = await prisma.client.update({
        where: { id: resolvedParams.id },
        data: {
          kycCompleted: body.kycCompleted,
          pepStatus: body.pepStatus,
          kycNotes: body.kycNotes,
        }
      })
      return NextResponse.json(updatedClient)
    }

    return NextResponse.json({ error: 'Ogiltig åtgärd' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte utföra åtgärden' }, { status: 500 })
  }
}