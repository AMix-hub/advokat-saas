import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    const task = await prisma.task.create({
      data: {
        title: body.title,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        caseId: body.caseId,
      }
    })
    
    // Logga automatiskt att en uppgift lades till
    await prisma.log.create({
      data: { action: `La till uppgift: ${body.title}`, caseId: body.caseId }
    })
    
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    const task = await prisma.task.update({
      where: { id: body.id },
      data: { isCompleted: body.isCompleted }
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const body = await req.json()
    await prisma.task.delete({ where: { id: body.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}