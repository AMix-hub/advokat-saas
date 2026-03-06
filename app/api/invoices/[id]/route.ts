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
    const { status, dueDate, notes, addItems } = body

    // Hämta aktuell faktura för att kunna verifiera status och caseId
    const currentInvoice = await prisma.invoice.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!currentInvoice) {
      return NextResponse.json({ error: 'Faktura hittades inte' }, { status: 404 })
    }

    // Tillåt bara tillägg av rader på utkast-fakturor
    if (addItems && addItems.length > 0 && currentInvoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Kan bara lägga till rader på utkast-fakturor' },
        { status: 400 }
      )
    }

    // Räkna ut extra belopp från nya rader
    const additionalAmount = addItems
      ? addItems.reduce((sum: number, item: any) => sum + ((item.quantity || 1) * item.unitPrice), 0)
      : 0

    // Uppdatera faktura (status, dueDate, notes, och eventuellt nya rader)
    const invoice = await prisma.invoice.update({
      where: { id: resolvedParams.id },
      data: {
        ...(status && { status }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(notes !== undefined && { notes }),
        ...(addItems && addItems.length > 0 && {
          totalAmount: currentInvoice.totalAmount + additionalAmount,
          items: {
            create: addItems.map((item: any) => ({
              description: item.description,
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice,
              amount: (item.quantity || 1) * item.unitPrice
            }))
          }
        })
      },
      include: { items: true, case: { include: { client: true } } }
    })

    // Synkronisera Case.invoiceStatus när fakturans status ändras
    const caseInvoiceStatus =
      status === 'SENT' ? 'SENT' :
      status === 'PAID' ? 'PAID' :
      status === 'DRAFT' ? 'UNBILLED' :
      null

    if (caseInvoiceStatus) {
      await prisma.case.update({
        where: { id: invoice.caseId },
        data: { invoiceStatus: caseInvoiceStatus }
      })
    }

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
