'use client';

/**
 * Login Page
 * Dedicated authentication page for LUMEN
 * Users can sign in with GitHub or Google
 */

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { Button } from '@/design-system/primitives/Button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/lumen';
  const error = searchParams.get('error');

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
          maxWidth: 400,
          width: '100%',
          background: 'var(--nv-bg-1)',
          border: '1px solid var(--nv-border)',
          borderRadius: '12px',
          padding: '40px 32px',
          textAlign: 'center'
        }}
      >
        {/* Logo/Title */}
        <Link 
          href="/lumen"
          style={{ 
            fontSize: 24, 
            fontWeight: 600, 
            textDecoration: 'none', 
            color: 'var(--nv-text-0)',
            display: 'block',
            marginBottom: 8
          }}
        >
          Lumenforge.io
        </Link>
        
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            margin: '0 0 8px 0',
            color: 'var(--nv-text-0)'
          }}
        >
          Sign in to your account
        </h1>
        
        <p
          style={{
            fontSize: 16,
            color: 'var(--nv-text-1)',
            margin: '0 0 32px 0'
          }}
        >
          Choose your preferred sign-in method
        </p>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: 24,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: 14
            }}
          >
            {error === 'CredentialsSignin' && 'Invalid credentials. Please try again.'}
            {error === 'OAuthSignin' && 'Error occurred during OAuth sign-in. Please try again.'}
            {error === 'OAuthCallback' && 'Error occurred during OAuth callback. Please try again.'}
            {error === 'OAuthCreateAccount' && 'Could not create OAuth account. Please try again.'}
            {error === 'EmailCreateAccount' && 'Could not create email account. Please try again.'}
            {error === 'Callback' && 'Error occurred during callback. Please try again.'}
            {error === 'OAuthAccountNotLinked' && 'This account is already linked to another user.'}
            {error === 'EmailSignin' && 'Check your email for the sign-in link.'}
            {error === 'SessionRequired' && 'Please sign in to access this page.'}
            {!['CredentialsSignin', 'OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'SessionRequired'].includes(error) && 'An error occurred. Please try again.'}
          </div>
        )}

        {/* Auth Buttons */}
        <div style={{ marginBottom: 24 }}>
          <AuthButtons 
            direction="column" 
            size="md"
            showUserInfo={false}
          />
        </div>

        {/* Back to Landing */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid var(--nv-border)'
          }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/lumen')}
            style={{ fontSize: 14 }}
          >
            ← Back to Home
          </Button>
        </div>

        {/* Terms/Privacy */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--nv-text-2)',
            margin: '24px 0 0 0',
            lineHeight: 1.5
          }}
        >
          By signing in, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: 'var(--nv-text-0)', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

