import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CaseCore | Den moderna plattformen för advokatbyråer',
  description: 'Komplett hantering av ärenden, KYC, tidrapportering och fakturering i ett säkert och krypterat system.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}