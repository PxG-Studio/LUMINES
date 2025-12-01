'use client';

/**
 * SessionProvider wrapper for NextAuth
 * Must be a client component to use React context
 */
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import React from 'react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}

