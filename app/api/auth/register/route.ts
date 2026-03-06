import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, firmName, email, password, inviteCode } = await req.json()

    // Säkerhetsspärr: Koden de måste skriva in för att få skapa ett konto
    // Du kan ändra 'CASECORE2026' till vad du vill, eller lägga det i din .env fil senare
    const validCode = process.env.INVITE_CODE || 'CASECORE2026'
    
    if (inviteCode !== validCode) {
      return NextResponse.json({ error: 'Ogiltig licenskod. Kontakta support om du saknar kod.' }, { status: 403 })
    }

    // Kolla om e-posten redan finns
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'E-postadressen är redan registrerad.' }, { status: 400 })
    }

    // Kryptera lösenordet innan vi sparar det
    const hashedPassword = await bcrypt.hash(password, 10)

    // Skapa byrån/användaren i databasen
    const user = await prisma.user.create({
      data: {
        name,
        firmName,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ message: 'Konto skapat framgångsrikt!' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Något gick fel vid skapandet av kontot.' }, { status: 500 })
  }
}