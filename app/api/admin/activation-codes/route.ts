import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

// GET /api/admin/activation-codes — Hämta alla aktiveringskoder (endast admin)
export async function GET(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
  }

  const codes = await prisma.activationCode.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ codes })
}

// POST /api/admin/activation-codes — Skapa en ny aktiveringskod (endast admin)
export async function POST(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
  }

  try {
    const { code, description, licenseType, maxUses, expiresAt } = await req.json()

    if (!code || typeof code !== 'string' || code.trim().length < 4) {
      return NextResponse.json({ error: 'Koden måste vara minst 4 tecken.' }, { status: 400 })
    }

    const normalized = code.trim().toUpperCase()
    const normalizedType = licenseType === 'BYRA' ? 'BYRA' : 'SOLO'

    const existing = await prisma.activationCode.findUnique({ where: { code: normalized } })
    if (existing) {
      return NextResponse.json({ error: 'Den koden finns redan.' }, { status: 400 })
    }

    const newCode = await prisma.activationCode.create({
      data: {
        code: normalized,
        description: description?.trim() || null,
        licenseType: normalizedType,
        maxUses: maxUses === -1 ? -1 : Math.max(1, parseInt(maxUses) || 1),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json({ code: newCode }, { status: 201 })
  } catch (error) {
    console.error('Activation code creation error:', error)
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}
