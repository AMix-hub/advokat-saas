import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-post", type: "text" },
        password: { label: "Lösenord", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null
        }

        // Auto-promote the designated admin email to isAdmin if not already set
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
        let isAdmin = user.isAdmin
        if (adminEmail && user.email === adminEmail && !user.isAdmin) {
          await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } })
          isAdmin = true
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin,
          modules: user.modules,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false
        token.modules = (user as { modules?: string[] }).modules ?? []
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isAdmin?: boolean; modules?: string[] }).isAdmin = (token.isAdmin ?? false) as boolean;
        (session.user as { isAdmin?: boolean; modules?: string[] }).modules = (token.modules ?? []) as string[]
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }