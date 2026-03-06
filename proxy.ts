import { withAuth } from "next-auth/middleware"

export default withAuth

export const config = {
  matcher: [
    // Låser alla sidor (inklusive /dashboard).
    // Följande sidor är upplåsta: api/auth, inloggning, återställning, registrering samt startsidan ($)
    "/((?!api/auth|login|pitch|forgot-password|reset-password|register|_next/static|_next/image|favicon.ico|$).*)"
  ]
}