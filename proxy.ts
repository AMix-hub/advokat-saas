import { withAuth } from "next-auth/middleware"

export default withAuth

export const config = {
  matcher: [
    // Lade till "pitch" i listan över sidor som inte kräver inloggning!
    "/((?!api/auth|login|portal|pitch|_next/static|_next/image|favicon.ico).*)"
  ]
}