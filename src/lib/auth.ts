/**
 * Server-side auth helper
 * Use this in Server Components and API routes
 */
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

