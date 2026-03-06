import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET en enskild deadline
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    const deadline = await prisma.deadline.findUnique({
      where: { id: resolvedParams.id },
      include: { case: { include: { client: true } } }
    })

    if (!deadline) {
      return NextResponse.json({ error: 'Deadline hittades inte' }, { status: 404 })
    }

    return NextResponse.json(deadline)
  } catch (error) {
    console.error('Error fetching deadline:', error)
    return NextResponse.json({ error: 'Kunde inte hämta deadline' }, { status: 500 })
  }
}

// PUT - Uppdatera deadline
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params
    const body = await req.json()
    const { title, description, dueDate, type, isCompleted } = body

    const deadline = await prisma.deadline.update({
      where: { id: resolvedParams.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(type && { type }),
        ...(isCompleted !== undefined && { isCompleted })
      },
      include: { case: { include: { client: true } } }
    })

    return NextResponse.json(deadline)
  } catch (error) {
    console.error('Error updating deadline:', error)
    return NextResponse.json({ error: 'Kunde inte uppdatera deadline' }, { status: 500 })
  }
}

// DELETE - Ta bort deadline
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    const deadline = await prisma.deadline.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!deadline) {
      return NextResponse.json({ error: 'Deadline hittades inte' }, { status: 404 })
    }

    await prisma.deadline.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Deadline raderad' })
  } catch (error) {
    console.error('Error deleting deadline:', error)
    return NextResponse.json({ error: 'Kunde inte radera deadline' }, { status: 500 })
  }
}
