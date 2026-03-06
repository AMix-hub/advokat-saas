import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Skapa själva tidsloggen
    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: body.description,
        hours: parseFloat(body.hours),
        caseId: body.caseId,
      }
    })
    
    // Lägg automatiskt till en händelse i ärendets loggbok
    await prisma.log.create({
      data: { 
        action: `Loggade tid: ${body.hours} h (${body.description})`, 
        caseId: body.caseId 
      }
    })
    
    return NextResponse.json(timeEntry)
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel vid tidsregistreringen' }, { status: 500 })
  }
}