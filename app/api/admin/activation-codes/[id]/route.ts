import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

async function requireAdmin(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) return { error: 'Ej inloggad', status: 401 }
  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user?.isAdmin) return { error: 'Åtkomst nekad', status: 403 }
  return null
}

// PATCH /api/admin/activation-codes/[id] — Uppdatera en aktiveringskod (endast admin)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.activationCode.update({
      where: { id },
      data: {
        isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
        description: body.description !== undefined ? body.description?.trim() || null : undefined,
        maxUses: body.maxUses !== undefined
          ? (body.maxUses === -1 ? -1 : Math.max(1, parseInt(body.maxUses) || 1))
          : undefined,
        expiresAt: body.expiresAt !== undefined
          ? (body.expiresAt ? new Date(body.expiresAt) : null)
          : undefined,
      },
    })

    return NextResponse.json({ code: updated })
  } catch (error) {
    console.error('Activation code update error:', error)
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}

// DELETE /api/admin/activation-codes/[id] — Ta bort en aktiveringskod (endast admin)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  try {
    const { id } = await params
    await prisma.activationCode.delete({ where: { id } })
    return NextResponse.json({ message: 'Koden har tagits bort.' })
  } catch (error) {
    console.error('Activation code delete error:', error)
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}
