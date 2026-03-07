import type { NextConfig } from 'next'

const securityHeaders = [
  // Prevent clickjacking by refusing to render the page in a frame
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only send referrer on same-origin requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Enable HSTS (1 year) – only active over HTTPS in production
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Restrict browser features not needed by this app
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Content-Security-Policy – tightened for a Next.js app with NextAuth
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js needs inline scripts for hydration; unsafe-eval is needed for dev only
      "script-src 'self' 'unsafe-inline'",
      // Inline styles are used by Tailwind/emotion
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs (for base64 thumbnails)
      "img-src 'self' data: blob:",
      // Fonts served from self
      "font-src 'self'",
      // API calls go to self only
      "connect-src 'self'",
      // Disallow framing from other origins
      "frame-ancestors 'none'",
      // No plugins
      "object-src 'none'",
      // Upgrade insecure requests in production
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    // Optimise images; add external hostname patterns here as needed
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig