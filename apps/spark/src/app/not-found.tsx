// Minimal 404 page - no React context, no styled-jsx, inline styles only
'use client';

export default function NotFound() {
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
      <h1 style={{ fontSize: 32, marginBottom: 8, fontWeight: 600 }}>Page Not Found</h1>
      <p style={{ color: '#9ba1aa', marginBottom: 16 }}>The page you requested could not be found.</p>
      <a
        href="/spark"
        style={{
          marginTop: 24,
          padding: '12px 24px',
          background: '#6d8cff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 500
        }}
      >
        Go to Spark
      </a>
    </div>
  );
}

