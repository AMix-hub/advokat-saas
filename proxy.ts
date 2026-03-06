import { withAuth } from "next-auth/middleware"

export default withAuth

export const config = {
  matcher: [
    // Låser alla sidor utom de vi uttryckligen listar här nedan (nu inklusive 'register'):
    "/((?!api/auth|login|portal|pitch|forgot-password|reset-password|register|_next/static|_next/image|favicon.ico).*)"
  ]
}