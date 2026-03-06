import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Denna e-postadress används redan.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        // Vi ärver byrånamnet och bankgirot från den första användaren
        firmName: body.firmName,
        bankgiro: body.bankgiro
      }
    })

    // Returnera allt utom lösenordet för säkerhets skull
    const { password, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword)

  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte skapa kontot' }, { status: 500 })
  }
}