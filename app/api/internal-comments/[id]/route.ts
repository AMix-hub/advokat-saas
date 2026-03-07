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

    const user = await prisma.user.findUnique({ where: { email: token.email as string } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params
    const body = await req.json()
    const { content } = body

    // Ownership check: only the author (or an admin) may edit the comment
    const existing = await prisma.internalComment.findUnique({ where: { id: resolvedParams.id } })
    if (!existing) return NextResponse.json({ error: 'Kommentaren hittades inte' }, { status: 404 })
    if (existing.userId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
    }

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

    const user = await prisma.user.findUnique({ where: { email: token.email as string } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    // Ownership check: only the author (or an admin) may delete the comment
    const existing = await prisma.internalComment.findUnique({ where: { id: resolvedParams.id } })
    if (!existing) return NextResponse.json({ error: 'Kommentaren hittades inte' }, { status: 404 })
    if (existing.userId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: 'Åtkomst nekad' }, { status: 403 })
    }

    await prisma.internalComment.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Could not delete comment' }, { status: 500 })
  }
}
