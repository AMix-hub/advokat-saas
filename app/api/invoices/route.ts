import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET alla invoices (eller för ett specifikt case)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    const status = req.nextUrl.searchParams.get('status')

    const where = caseId ? { caseId } : {}
    if (status) Object.assign(where, { status })

    const invoices = await prisma.invoice.findMany({
      where,
      include: { items: true, case: { include: { client: true } } },
      orderBy: { invoiceDate: 'desc' }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Kunde inte hämta fakturor' }, { status: 500 })
  }
}

// POST - Skapa ny faktura
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { caseId, dueDate, notes, items } = body

    if (!caseId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Saknade required fält: caseId, items' },
        { status: 400 }
      )
    }

    // Räkna totalt belopp
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)

    // Generera unik fakturanummer (år + löpande nummer)
    const year = new Date().getFullYear()
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `${year}-` } },
      orderBy: { invoiceNumber: 'desc' }
    })
    
    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1 
      : 1
    const invoiceNumber = `${year}-${String(nextNumber).padStart(3, '0')}`

    // Skapa faktura
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        caseId,
        dueDate: new Date(dueDate) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 dagar
        totalAmount,
        notes,
        status: 'DRAFT',
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            amount: (item.quantity || 1) * item.unitPrice
          }))
        }
      },
      include: { items: true, case: { include: { client: true } } }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Kunde inte skapa faktura' }, { status: 500 })
  }
}
