import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    
    // Hämtar administratören (eftersom det just nu är ett enanvändarsystem)
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return NextResponse.json({ error: 'Användare hittades inte' }, { status: 404 })
    }

    // Uppdaterar namnet och byrånamnet
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        firmName: body.firmName,
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte spara inställningarna' }, { status: 500 })
  }
}