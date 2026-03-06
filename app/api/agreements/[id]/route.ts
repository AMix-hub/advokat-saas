import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const allowedFields: Record<string, unknown> = {}
    if (body.status !== undefined) allowedFields.status = body.status
    if (body.title !== undefined) allowedFields.title = body.title
    if (body.endDate !== undefined) allowedFields.endDate = body.endDate ? new Date(body.endDate) : null

    const agreement = await prisma.agreement.update({
      where: { id },
      data: allowedFields,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        case: true,
      },
    })

    return NextResponse.json(agreement)
  } catch (error) {
    console.error('Error updating agreement:', error)
    return NextResponse.json({ error: 'Kunde inte uppdatera avtal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { id } = await params
    await prisma.agreement.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting agreement:', error)
    return NextResponse.json({ error: 'Kunde inte radera avtal' }, { status: 500 })
  }
}
