import { withAuth } from "next-auth/middleware"

// Exportera funktionen explicit så att Next.js förstår att det ÄR en funktion
export default withAuth

export const config = {
  matcher: [
    "/((?!api/auth|login|portal|_next/static|_next/image|favicon.ico).*)"
  ]
}