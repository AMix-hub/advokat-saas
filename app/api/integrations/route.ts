import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

const ALLOWED_SERVICES = ['visma', 'fortnox']

function maskApiKey(key: string | null): string | null {
  if (!key) return null
  if (key.length <= 4) return '••••'
  return `${'•'.repeat(key.length - 4)}${key.slice(-4)}`
}

// GET /api/integrations — Hämta den inloggade användarens integrationsinställningar
export async function GET(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user) return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })

  const settings = await prisma.integrationSetting.findMany({
    where: { userId: user.id },
    orderBy: { service: 'asc' },
  })

  const masked = settings.map(s => ({
    ...s,
    apiKey: maskApiKey(s.apiKey),
  }))

  return NextResponse.json({ integrations: masked })
}

// POST /api/integrations — Spara den inloggade användarens integrationsinställningar
export async function POST(req: Request) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: token.email } })
  if (!user) return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })

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

    const existing = await prisma.integrationSetting.findUnique({
      where: { service_userId: { service, userId: user.id } },
    })

    const data: Record<string, unknown> = {
      isEnabled: typeof isEnabled === 'boolean' ? isEnabled : (existing?.isEnabled ?? false),
      clientId: clientId !== undefined ? clientId : (existing?.clientId ?? null),
    }

    if (apiKey !== undefined) {
      data.apiKey = apiKey || null
    }

    const updated = await prisma.integrationSetting.upsert({
      where: { service_userId: { service, userId: user.id } },
      create: { service, userId: user.id, ...data },
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
