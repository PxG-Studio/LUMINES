'use client';

/**
 * Global Error Boundary for Next.js App Router
 * Catches errors in the root layout and pages
 */

import React from 'react';
import { Button } from '@/design-system/primitives/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--nv-bg-0)',
        color: 'var(--nv-text-0)',
        padding: '32px'
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: '100%',
          background: 'var(--nv-bg-1)',
          border: '1px solid var(--nv-border)',
          borderRadius: '12px',
          padding: '40px 32px',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            margin: '0 0 16px 0',
            color: 'var(--nv-text-0)'
          }}
        >
          Something went wrong!
        </h1>
        
        <p
          style={{
            fontSize: 16,
            color: 'var(--nv-text-1)',
            margin: '0 0 32px 0',
            lineHeight: 1.6
          }}
        >
          We're sorry, but something unexpected happened. Please try again or return to the home page.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details
            style={{
              marginBottom: 24,
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              textAlign: 'left'
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                color: '#ef4444',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 8
              }}
            >
              Error Details (Development Only)
            </summary>
            <pre
              style={{
                fontSize: 12,
                color: '#ef4444',
                overflow: 'auto',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="accent"
            onClick={reset}
            style={{ fontSize: 16, padding: '12px 24px' }}
          >
            Try Again
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/lumen'}
            style={{ fontSize: 16, padding: '12px 24px' }}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

