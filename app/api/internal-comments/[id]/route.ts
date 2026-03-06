import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// PUT - Uppdatera kommentar
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params
    const body = await req.json()
    const { content } = body

    const comment = await prisma.internalComment.update({
      where: { id: resolvedParams.id },
      data: { content },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Could not update comment' }, { status: 500 })
  }
}

// DELETE - Radera kommentar
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    await prisma.internalComment.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Could not delete comment' }, { status: 500 })
  }
}
