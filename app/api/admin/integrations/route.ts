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

const ALLOWED_SERVICES = ['visma', 'fortnox']

function maskApiKey(key: string | null): string | null {
  if (!key) return null
  if (key.length <= 4) return '••••'
  return `${'•'.repeat(key.length - 4)}${key.slice(-4)}`
}

// GET /api/admin/integrations — Hämta integrationsinställningar (endast admin)
export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  const settings = await prisma.integrationSetting.findMany({
    orderBy: { service: 'asc' },
  })

  // Mask API keys — only show last 4 chars
  const masked = settings.map(s => ({
    ...s,
    apiKey: maskApiKey(s.apiKey),
  }))

  return NextResponse.json({ integrations: masked })
}

// POST /api/admin/integrations — Spara integrationsinställningar (endast admin)
export async function POST(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  try {
    const body = await req.json()
    const { service, apiKey, clientId, isEnabled } = body as {
      service: string
      apiKey?: string
      clientId?: string
      isEnabled?: boolean
    }

    if (!ALLOWED_SERVICES.includes(service)) {
      return NextResponse.json({ error: 'Okänd tjänst.' }, { status: 400 })
    }

    const existing = await prisma.integrationSetting.findUnique({ where: { service } })

    const data: Record<string, unknown> = {
      isEnabled: typeof isEnabled === 'boolean' ? isEnabled : (existing?.isEnabled ?? false),
      clientId: clientId !== undefined ? clientId : (existing?.clientId ?? null),
    }

    // Only update apiKey if a new value is provided (empty string = clear it)
    if (apiKey !== undefined) {
      data.apiKey = apiKey || null
    }

    const updated = await prisma.integrationSetting.upsert({
      where: { service },
      create: { service, ...data },
      update: data,
    })

    return NextResponse.json({
      integration: {
        ...updated,
        apiKey: maskApiKey(updated.apiKey),
      },
    })
  } catch (error) {
    console.error('Integration save error:', error)
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}
