export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Matchar alla sökvägar (kräver inloggning) FÖRUTOM:
     * - api/auth (NextAuths egna rutter)
     * - login (Inloggningssidan)
     * - portal (Den publika klientportalen!)
     * - _next/static, _next/image, favicon.ico (Filer för design och bilder)
     */
    "/((?!api/auth|login|portal|_next/static|_next/image|favicon.ico).*)"
  ]
}