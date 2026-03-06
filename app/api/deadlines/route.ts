import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET alla deadlines (eller för ett specifikt case)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    const type = req.nextUrl.searchParams.get('type')
    const isCompleted = req.nextUrl.searchParams.get('isCompleted')

    const where: any = {}
    if (caseId) where.caseId = caseId
    if (type) where.type = type
    if (isCompleted !== null) where.isCompleted = isCompleted === 'true'

    const deadlines = await prisma.deadline.findMany({
      where,
      include: { case: { include: { client: true } } },
      orderBy: { dueDate: 'asc' }
    })

    return NextResponse.json(deadlines)
  } catch (error) {
    console.error('Error fetching deadlines:', error)
    return NextResponse.json({ error: 'Kunde inte hämta deadlines' }, { status: 500 })
  }
}

// POST - Skapa ny deadline/mileston
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { caseId, title, description, dueDate, type } = body

    if (!caseId || !title || !dueDate) {
      return NextResponse.json(
        { error: 'Saknade required fält: caseId, title, dueDate' },
        { status: 400 }
      )
    }

    // Validera case existerar
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId }
    })

    if (!caseExists) {
      return NextResponse.json({ error: 'Ärendet hittades inte' }, { status: 404 })
    }

    const deadline = await prisma.deadline.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        type: type || 'REMINDER',
        caseId,
        isCompleted: false
      },
      include: { case: { include: { client: true } } }
    })

    return NextResponse.json(deadline, { status: 201 })
  } catch (error) {
    console.error('Error creating deadline:', error)
    return NextResponse.json({ error: 'Kunde inte skapa deadline' }, { status: 500 })
  }
}
