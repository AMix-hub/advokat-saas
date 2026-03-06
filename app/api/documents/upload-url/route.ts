import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Kopplar upp mot ditt framtida AWS-kassaskåp
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1', // eu-north-1 är Stockholm!
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
})

export async function POST(req: Request) {
  try {
    const { filename, contentType, caseId } = await req.json()

    // Om du inte har lagt in dina AWS-nycklar i .env ännu, stoppar vi här så appen inte kraschar
    if (!process.env.AWS_BUCKET_NAME) {
      return NextResponse.json({ error: 'AWS är inte konfigurerat ännu.' }, { status: 500 })
    }

    // Skapar ett unikt filnamn: ärendeID/Tidsstämpel-Filnamn.pdf
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`
    const fileKey = `cases/${caseId}/${uniqueFilename}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    })

    // Skapar en säker länk som dör efter 60 sekunder
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

    // Den permanenta länken där filen sedan kan läsas
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

    return NextResponse.json({ signedUrl, fileUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Kunde inte skapa en säker uppladdningslänk' }, { status: 500 })
  }
}