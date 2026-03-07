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

// PATCH /api/admin/users/[id] — Uppdatera en användares roll och tillägg (endast admin)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.user.update({
      where: { id },
      data: {
        isAdmin: typeof body.isAdmin === 'boolean' ? body.isAdmin : undefined,
        modules: Array.isArray(body.modules) ? body.modules : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        modules: true,
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}
