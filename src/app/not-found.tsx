'use client';

/**
 * 404 Not Found Page
 * Shown when a route doesn't exist
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/design-system/primitives/Button';

export default function NotFound() {
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
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: 'var(--nv-text-0)',
            lineHeight: 1
          }}
        >
          404
        </h1>
        
        <h2
          style={{
            fontSize: 24,
            fontWeight: 600,
            margin: '0 0 8px 0',
            color: 'var(--nv-text-0)'
          }}
        >
          Page Not Found
        </h2>
        
        <p
          style={{
            fontSize: 16,
            color: 'var(--nv-text-1)',
            margin: '0 0 32px 0',
            lineHeight: 1.6
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="accent"
            onClick={() => window.location.href = '/lumen'}
            style={{ fontSize: 16, padding: '12px 24px' }}
          >
            Go to Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            style={{ fontSize: 16, padding: '12px 24px' }}
          >
            Go Back
          </Button>
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--nv-border)' }}>
          <p style={{ fontSize: 14, color: 'var(--nv-text-2)', marginBottom: 16 }}>
            Popular pages:
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lumen" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline', fontSize: 14 }}>
              LUMEN
            </Link>
            <Link href="/spark" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline', fontSize: 14 }}>
              SPARK
            </Link>
            <Link href="/slate/ide" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline', fontSize: 14 }}>
              SLATE
            </Link>
            <Link href="/waypoint" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline', fontSize: 14 }}>
              Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

