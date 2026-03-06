import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    })
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta inställningar' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    
    // Sparar loggan (base64) i databasen tillsammans med allt annat
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: {
        name: body.name,
        firmName: body.firmName,
        bankgiro: body.bankgiro,
        logo: body.logo, // NYTT FÄLT
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte spara inställningarna' }, { status: 500 })
  }
}