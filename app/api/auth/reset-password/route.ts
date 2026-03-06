import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // 1. Hitta biljetten och kolla så den inte blivit för gammal
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Länken är ogiltig eller har gått ut. Vänligen begär en ny.' }, { status: 400 })
    }

    // 2. Kryptera det nya lösenordet
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Uppdatera användaren
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    })

    // 4. Radera biljetten (så den inte kan användas igen)
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return NextResponse.json({ message: 'Ditt lösenord har uppdaterats!' })
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte uppdatera lösenordet.' }, { status: 500 })
  }
}