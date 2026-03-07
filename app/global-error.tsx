'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <title>Något gick fel | CaseCore</title>
      </head>
      <body style={{ margin: 0, backgroundColor: '#020617', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: '#ef4444', marginBottom: '1rem' }}>500</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>
              Något gick fel
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              Ett oväntat fel har inträffat. Försök igen om en stund.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#4f46e5',
                color: '#fff',
                fontWeight: 600,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4338ca' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4f46e5' }}
              onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 3px rgba(99,102,241,0.5)' }}
              onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
            >
              Försök igen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
