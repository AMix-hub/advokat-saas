import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
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
          where: { email: credentials.email }
        })

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null
        }

        return { id: user.id, email: user.email, name: user.name }
      }
    })
  ],
  // NYTT: Lägg till denna del för att peka ut vår egna sida
  pages: {
    signIn: '/login', // Säger att inloggningen ligger på /login
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }