import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta inställningar' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        firmName: body.firmName,
        bankgiro: body.bankgiro, // Sparar det nya bankgirot
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte spara inställningarna' }, { status: 500 })
  }
}