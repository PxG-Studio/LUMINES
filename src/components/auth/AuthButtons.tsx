'use client';

/**
 * AuthButtons Component
 * Displays GitHub and Google sign-in buttons for LUMEN landing page
 */
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { GitHubSignInButton } from './GitHubSignInButton';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Button } from '@/design-system/primitives/Button';

export interface AuthButtonsProps {
  /**
   * Show user info when logged in
   */
  showUserInfo?: boolean;
  
  /**
   * Button size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show buttons in a row or column
   */
  direction?: 'row' | 'column';
}

export function AuthButtons({
  showUserInfo = true,
  size = 'md',
  direction = 'row',
}: AuthButtonsProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div 
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        role="status"
        aria-live="polite"
        aria-label="Loading authentication status"
      >
        <div 
          style={{ 
            width: 20, 
            height: 20, 
            border: '2px solid var(--nv-border)', 
            borderTop: '2px solid var(--nv-text-0)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
          aria-hidden="true"
        />
        <span style={{ fontSize: 14, color: 'var(--nv-text-2)' }}>Loading...</span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        alignItems: 'center',
        flexDirection: direction === 'column' ? 'column' : 'row'
      }}>
        {showUserInfo && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8 
          }}>
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1px solid var(--nv-border)'
                }}
              />
            )}
            <span style={{ 
              fontSize: 14, 
              color: 'var(--nv-text-0)',
              fontWeight: 500
            }}>
              {session.user.name || session.user.email}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/lumen' })}
          style={{ fontSize: 14, padding: '8px 16px' }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexDirection: direction === 'column' ? 'column' : 'row',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle}>
      <GitHubSignInButton
        text={size === 'sm' ? 'GitHub' : 'Continue with GitHub'}
        variant="default"
        fullWidth={direction === 'column'}
      />
      <GoogleSignInButton
        text={size === 'sm' ? 'Google' : 'Continue with Google'}
        variant="default"
        fullWidth={direction === 'column'}
      />
    </div>
  );
}

