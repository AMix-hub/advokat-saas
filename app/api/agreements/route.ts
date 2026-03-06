import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET alla avtal
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    const status = req.nextUrl.searchParams.get('status')

    const where: any = {}
    if (caseId) where.caseId = caseId
    if (status) where.status = status

    const agreements = await prisma.agreement.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        case: true,
        changes: { orderBy: { changedAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(agreements)
  } catch (error) {
    console.error('Error fetching agreements:', error)
    return NextResponse.json({ error: 'Could not fetch agreements' }, { status: 500 })
  }
}

// POST - Skapa nytt avtal
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, type, content, startDate, endDate, caseId } = body

    if (!title || !content || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, startDate' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email as string }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const agreement = await prisma.agreement.create({
      data: {
        title,
        type: type || 'CLIENT_AGREEMENT',
        content,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        caseId: caseId || null,
        createdById: user.id
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        case: true,
        changes: { orderBy: { changedAt: 'desc' } }
      }
    })

    return NextResponse.json(agreement, { status: 201 })
  } catch (error) {
    console.error('Error creating agreement:', error)
    return NextResponse.json({ error: 'Could not create agreement' }, { status: 500 })
  }
}
