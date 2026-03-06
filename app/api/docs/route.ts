import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET /api/docs — list saved generated documents (newest first)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const docs = await prisma.generatedDocument.findMany({
      include: {
        case: { select: { id: true, title: true } },
        createdBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(docs)
  } catch {
    return NextResponse.json({ error: 'Kunde inte hämta dokument' }, { status: 500 })
  }
}

// POST /api/docs — save a generated document
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const { templateName, content, variables, caseId } = await req.json()

    if (!templateName || typeof templateName !== 'string') {
      return NextResponse.json({ error: 'Mallnamn saknas' }, { status: 400 })
    }
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Dokumentinnehåll saknas' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: token.email } })
    if (!user) return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })

    // Validate caseId if provided
    if (caseId && typeof caseId === 'string') {
      const caseRecord = await prisma.case.findUnique({ where: { id: caseId } })
      if (!caseRecord) return NextResponse.json({ error: 'Ärendet hittades inte' }, { status: 404 })
    }

    const doc = await prisma.generatedDocument.create({
      data: {
        templateName,
        content,
        variables: typeof variables === 'string' ? variables : JSON.stringify(variables ?? {}),
        createdById: user.id,
        ...(caseId && typeof caseId === 'string' ? { caseId } : {}),
      },
      include: {
        case: { select: { id: true, title: true } },
        createdBy: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(doc, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Kunde inte spara dokument' }, { status: 500 })
  }
}
