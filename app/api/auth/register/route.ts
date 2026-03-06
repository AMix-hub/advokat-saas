import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, firmName, email, password, inviteCode } = await req.json()

    if (!inviteCode) {
      return NextResponse.json({ error: 'Åtkomstkod saknas.' }, { status: 400 })
    }

    const normalized = inviteCode.trim().toUpperCase()

    // Kontrollera mot databasens aktiveringskoder
    const now = new Date()
    const dbCode = await prisma.activationCode.findUnique({ where: { code: normalized } })

    let codeValid = false

    if (dbCode) {
      if (!dbCode.isActive) {
        return NextResponse.json({ error: 'Åtkomstkoden är inaktiverad. Kontakta support.' }, { status: 403 })
      }
      if (dbCode.expiresAt && dbCode.expiresAt < now) {
        return NextResponse.json({ error: 'Åtkomstkoden har gått ut. Kontakta support.' }, { status: 403 })
      }
      if (dbCode.maxUses !== -1 && dbCode.usedCount >= dbCode.maxUses) {
        return NextResponse.json({ error: 'Åtkomstkoden har redan använts maximalt antal gånger.' }, { status: 403 })
      }
      codeValid = true
    } else {
      // Fallback: kontrollera mot miljövariabeln för bakåtkompatibilitet
      const envCode = process.env.INVITE_CODE || 'CASECORE2026'
      codeValid = normalized === envCode.toUpperCase()
    }

    if (!codeValid) {
      return NextResponse.json({ error: 'Ogiltig åtkomstkod. Kontakta support om du saknar kod.' }, { status: 403 })
    }

    // Kolla om e-posten redan finns
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'E-postadressen är redan registrerad.' }, { status: 400 })
    }

    // Kryptera lösenordet innan vi sparar det
    const hashedPassword = await bcrypt.hash(password, 10)

    // Skapa byrån/användaren i databasen
    await prisma.user.create({
      data: {
        name,
        firmName,
        email,
        password: hashedPassword,
      }
    })

    // Öka räknaren för databaskoder
    if (dbCode) {
      await prisma.activationCode.update({
        where: { id: dbCode.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ message: 'Konto skapat framgångsrikt!' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Något gick fel vid skapandet av kontot.' }, { status: 500 })
  }
}