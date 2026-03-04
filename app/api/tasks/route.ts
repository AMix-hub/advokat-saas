import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
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

export async function PATCH(req: Request) {
  try {
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

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    await prisma.task.delete({ where: { id: body.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}