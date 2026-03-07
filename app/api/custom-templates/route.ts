import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const templates = await prisma.customTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta mallar' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    const template = await prisma.customTemplate.create({
      data: {
        name: body.name,
        content: body.content,
      }
    })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte spara mallen' }, { status: 500 })
  }
}