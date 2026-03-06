import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Laddar in det snygga och moderna typsnittet Inter
const inter = Inter({ subsets: ['latin'] })

// HÄR ÄNDRAR VI VAD SOM STÅR I FLIKEN OCH PÅ GOOGLE!
export const metadata: Metadata = {
  title: 'CaseCore | Den moderna plattformen för advokatbyråer',
  description: 'Komplett hantering av ärenden, KYC, tidrapportering och fakturering i ett säkert och krypterat system.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}