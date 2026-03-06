import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET en enskild faktura
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id: resolvedParams.id },
      include: { items: true, case: { include: { client: true } } }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Faktura hittades inte' }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ error: 'Kunde inte hämta faktura' }, { status: 500 })
  }
}

// PUT - Uppdatera faktura
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params
    const body = await req.json()
    const { status, dueDate, notes } = body

    // Uppdatera bara dessa fält (status, dueDate, notes)
    const invoice = await prisma.invoice.update({
      where: { id: resolvedParams.id },
      data: {
        ...(status && { status }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(notes !== undefined && { notes })
      },
      include: { items: true, case: { include: { client: true } } }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Kunde inte uppdatera faktura' }, { status: 500 })
  }
}

// DELETE - Ta bort faktura (bara om den är DRAFT)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const resolvedParams = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Faktura hittades inte' }, { status: 404 })
    }

    // Tillåt bara radering av DRAFT-fakturor för säkerhet
    if (invoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Kan bara radera utkast-fakturor' },
        { status: 400 }
      )
    }

    // Delete cascade kommer hantera items automatiskt
    await prisma.invoice.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Faktura raderad' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ error: 'Kunde inte radera faktura' }, { status: 500 })
  }
}
