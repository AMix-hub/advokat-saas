import { NextResponse } from 'next/server'

// Integrations are now per-user and managed at /api/integrations.
// This endpoint is kept as a stub so existing references don't 404.
export async function GET() {
  return NextResponse.json(
    { message: 'Integrationer hanteras nu per användare via /api/integrations.' },
    { status: 410 },
  )
}

export async function POST() {
  return NextResponse.json(
    { message: 'Integrationer hanteras nu per användare via /api/integrations.' },
    { status: 410 },
  )
}
