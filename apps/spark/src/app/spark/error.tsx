'use client';

import React from 'react';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export const dynamic = 'force-dynamic';

export default function GlobalError({ error }: { error: Error }) {
  return (
    <ThemeProvider>
      <main style={{ padding: 24, color: '#fff', background: '#0b0b0f', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: '#9ba1aa' }}>Please try again later.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre style={{ marginTop: 16, color: '#ef4444' }}>{error?.message}</pre>
        )}
      </main>
    </ThemeProvider>
  );
}

