'use client';

/**
 * Custom hook for accessing NextAuth session
 */
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    isLoggedIn: status === 'authenticated',
    provider: (session as any)?.provider,
    roles: (session as any)?.roles || [],
  };
}

