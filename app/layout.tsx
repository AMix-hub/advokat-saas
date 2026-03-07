import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://casecore.se'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'CaseCore | Den moderna plattformen för advokatbyråer',
    template: '%s | CaseCore',
  },
  description:
    'CaseCore är den moderna ärendehanteringen för svenska advokatbyråer. Fånga varje fakturerbar minut, automatisera KYC och låt systemet sköta faktureringen — GDPR-compliant.',
  keywords: [
    'ärendehantering advokatbyrå',
    'juridik SaaS',
    'KYC AML',
    'tidrapportering jurist',
    'faktureringssystem advokat',
    'CaseCore',
    'advokatprogram',
  ],
  authors: [{ name: 'CaseCore Legal Tech' }],
  creator: 'CaseCore Legal Tech',
  publisher: 'CaseCore Legal Tech',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: APP_URL,
    siteName: 'CaseCore',
    title: 'CaseCore | Den moderna plattformen för advokatbyråer',
    description:
      'Komplett ärendehantering, KYC, tidrapportering och fakturering i ett säkert GDPR-anpassat system byggt för svenska juristbyråer.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CaseCore – ärendehantering för advokatbyråer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaseCore | Den moderna plattformen för advokatbyråer',
    description:
      'Komplett ärendehantering, KYC, tidrapportering och fakturering – GDPR-compliant och byggt för svenska juristbyråer.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
  },
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
        <SpeedInsights />
      </body>
    </html>
  )
}