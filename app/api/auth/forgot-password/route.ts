import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    // 1. Kolla om e-posten finns
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Vi returnerar alltid 200 OK även om mejlet är fel, så hackers inte kan lista ut vilka e-postadresser som finns i systemet
      return NextResponse.json({ message: 'Om adressen finns i vårt register har ett mejl skickats.' })
    }

    // 2. Skapa en säker, slumpmässig token som dör om 1 timme
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600 * 1000)

    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    })

    // 3. Bygg länken
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetLink = `${appUrl}/reset-password?token=${token}`

    // 4. Skicka mejlet! (onboarding@resend.dev fungerar alltid för testning innan din domän är helt godkänd)
    await resend.emails.send({
      from: 'CaseCore Support <onboarding@resend.dev>',
      to: email,
      subject: 'Återställning av lösenord - CaseCore',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Återställ ditt lösenord</h2>
          <p>Vi har tagit emot en begäran om att återställa lösenordet för ditt CaseCore-konto.</p>
          <p>Klicka på knappen nedan för att välja ett nytt lösenord. Länken är giltig i 1 timme.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Återställ lösenord</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Om du inte begärt detta kan du ignorera detta mejl.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: 'Ett mejl har skickats!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Något gick fel vid utskicket.' }, { status: 500 })
  }
}