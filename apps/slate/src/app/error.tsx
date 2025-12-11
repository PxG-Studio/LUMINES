// Minimal error page - no React context, no styled-jsx, inline styles only
'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ 
      margin: 0, 
      padding: 24, 
      color: '#fff', 
      background: '#0b0b0f', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8, fontWeight: 600 }}>Something went wrong</h1>
      <p style={{ color: '#9ba1aa', marginBottom: 16 }}>Please try again later.</p>
      <button
        onClick={reset}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          background: '#6d8cff',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 500
        }}
      >
        Try again
      </button>
    </div>
  );
}

