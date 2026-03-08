import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

async function requireAdmin(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) return { error: 'Ej inloggad', status: 401 }
  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user?.isAdmin) return { error: 'Åtkomst nekad', status: 403 }
  return { adminUser: user }
}

// POST /api/admin/import — Importera klienter från CSV (endast admin)
// Body: { targetUserId: string, rows: Array<{ name, email, orgNr?, phone? }> }
export async function POST(req: Request) {
  const result = await requireAdmin(req)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: (result as { status: number }).status })

  try {
    const body = await req.json()
    const { targetUserId, rows } = body as {
      targetUserId: string
      rows: Array<{ name: string; email: string; orgNr?: string }>
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Välj vilken användare klienterna ska tilldelas.' }, { status: 400 })
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Inga rader att importera.' }, { status: 400 })
    }

    const MAX_ROWS = 500
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ error: `Max ${MAX_ROWS} rader per import.` }, { status: 400 })
    }

    // Validate target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'Vald användare hittades inte.' }, { status: 404 })
    }

    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const row of rows) {
      const name = row.name?.trim()
      const email = row.email?.trim().toLowerCase()
      const orgNr = row.orgNr?.trim() || null

      if (!name || !email) {
        skipped++
        continue
      }

      // Email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(`Ogiltig e-post: ${email}`)
        skipped++
        continue
      }

      try {
        await prisma.client.create({
          data: {
            name,
            email,
            orgNr,
            createdById: targetUserId,
          },
        })
        created++
      } catch {
        // Unique constraint violation or other error — skip duplicate
        skipped++
      }
    }

    return NextResponse.json({ created, skipped, errors })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Något gick fel vid import.' }, { status: 500 })
  }
}
