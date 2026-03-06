import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const user = token?.email ? await prisma.user.findUnique({ where: { email: token.email } }) : null
    const userName = user?.name || 'En handläggare'

    const body = await req.json()
    
    // Sparar filens uppgifter i databasen
    const document = await prisma.document.create({
      data: {
        name: body.name,
        url: body.url,
        caseId: body.caseId,
      }
    })
    
    // Skriver in i ärendets oförstörbara loggbok
    await prisma.log.create({
      data: { 
        action: `${userName} laddade upp bevisning/dokument: ${body.name}`, 
        caseId: body.caseId 
      }
    })
    
    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte spara dokumentet i databasen' }, { status: 500 })
  }
}