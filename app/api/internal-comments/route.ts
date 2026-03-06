import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET alla interna kommentarer för ett case
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    
    if (!caseId) {
      return NextResponse.json({ error: 'caseId är required' }, { status: 400 })
    }

    const comments = await prisma.internalComment.findMany({
      where: { caseId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Could not fetch comments' }, { status: 500 })
  }
}

// POST - Skapa ny intern kommentar
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { caseId, content } = body

    if (!caseId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId, content' },
        { status: 400 }
      )
    }

    // Get user ID from email token
    const user = await prisma.user.findUnique({
      where: { email: token.email as string }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const comment = await prisma.internalComment.create({
      data: {
        content,
        caseId,
        userId: user.id
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Could not create comment' }, { status: 500 })
  }
}
