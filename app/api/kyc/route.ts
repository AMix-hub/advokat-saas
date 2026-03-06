import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET /api/kyc — all clients with their latest KYC record
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const clients = await prisma.client.findMany({
      where: { isAnonymized: false },
      select: {
        id: true,
        name: true,
        email: true,
        orgNr: true,
        kycCompleted: true,
        pepStatus: true,
        kycRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(clients)
  } catch {
    return NextResponse.json({ error: 'Kunde inte hämta KYC-data' }, { status: 500 })
  }
}

// POST /api/kyc — create or update a KYC record for a client
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const {
      clientId,
      riskLevel,
      pepChecked,
      pepResult,
      sanctionsChecked,
      sanctionsResult,
      idVerified,
      sourceOfFunds,
      notes,
      expiresAt,
    } = await req.json()

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Klient-ID saknas' }, { status: 400 })
    }

    const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH']
    if (riskLevel && !validRiskLevels.includes(riskLevel)) {
      return NextResponse.json({ error: 'Ogiltig risknivå' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: token.email } })
    if (!user) return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })

    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return NextResponse.json({ error: 'Klienten hittades inte' }, { status: 404 })

    const record = await prisma.kycRecord.create({
      data: {
        clientId,
        riskLevel: riskLevel ?? 'LOW',
        pepChecked: pepChecked ?? false,
        pepResult: pepResult ?? false,
        sanctionsChecked: sanctionsChecked ?? false,
        sanctionsResult: sanctionsResult ?? false,
        idVerified: idVerified ?? false,
        sourceOfFunds: sourceOfFunds ?? null,
        notes: notes ?? null,
        reviewer: user.name ?? user.email,
        reviewedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    // Sync the kycCompleted and pepStatus flags on the Client model
    await prisma.client.update({
      where: { id: clientId },
      data: {
        kycCompleted: (pepChecked && sanctionsChecked && idVerified),
        pepStatus: pepResult ?? false,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Kunde inte spara KYC-bedömning' }, { status: 500 })
  }
}
