import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

// Här bestämmer vi VILKA sidor som är låsta. 
// Denna kod låser hela systemet (dashboard, ärenden) men lämnar API och login öppet.
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}