import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getToken } from 'next-auth/jwt'
import crypto from 'crypto'

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.xlsx'])
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

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

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Filen är för stor. Max 20 MB.' }, { status: 400 })
    }

    // Validate file extension – use only the basename to prevent path traversal
    const safeBaseName = path.basename(file.name)
    const ext = path.extname(safeBaseName).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Filtypen är inte tillåten.' }, { status: 400 })
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

    // Generate a cryptographically random filename to prevent enumeration and path traversal
    const randomId = crypto.randomBytes(16).toString('hex')
    const uniqueFilename = `${randomId}${ext}`
    const filePath = path.join(uploadDir, uniqueFilename)

    // Spara filen fysiskt på servern
    await writeFile(filePath, buffer)

    // Spara informationen i databasen och koppla till ärendet (använd originalnamnet som visningsnamn)
    const document = await prisma.document.create({
      data: {
        name: safeBaseName,
        url: `/uploads/${uniqueFilename}`,
        caseId: caseId,
      }
    })

    // Auto-logga att ett dokument laddades upp!
    await prisma.log.create({
      data: {
        action: `Laddade upp dokument: ${safeBaseName}`,
        caseId: caseId
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Fel vid filuppladdning:", error)
    return NextResponse.json({ error: 'Kunde inte ladda upp filen' }, { status: 500 })
  }
}