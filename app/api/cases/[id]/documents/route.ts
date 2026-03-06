import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req })
    if (!token?.email) return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 })

    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    
    // Ta emot form-data (filen)
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Ingen fil skickades med.' }, { status: 400 })
    }

    // Konvertera filen till ett format som kan sparas på hårddisken
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Skapa mappen public/uploads om den inte redan finns
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Mappen fanns redan, ignorera
    }

    // Skapa ett unikt filnamn så att filer med samma namn inte skriver över varandra
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const filePath = path.join(uploadDir, uniqueFilename)

    // Spara filen fysiskt på din PC
    await writeFile(filePath, buffer)

    // Spara informationen i databasen och koppla till ärendet
    const document = await prisma.document.create({
      data: {
        name: file.name,
        url: `/uploads/${uniqueFilename}`, // Detta är den publika URL:en som webbläsaren kan läsa
        caseId: caseId,
      }
    })

    // Auto-logga att ett dokument laddades upp!
    await prisma.log.create({
      data: {
        action: `Laddade upp dokument: ${file.name}`,
        caseId: caseId
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Fel vid filuppladdning:", error)
    return NextResponse.json({ error: 'Kunde inte ladda upp filen' }, { status: 500 })
  }
}