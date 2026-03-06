export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Låser alla sidor utom de som uttryckligen listas nedan:
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|pitch|forgot-password|reset-password).*)",
  ],
}