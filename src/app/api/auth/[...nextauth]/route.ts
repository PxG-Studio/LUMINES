/**
 * NextAuth.js API Route Handler
 * 
 * Handles authentication requests
 */

import NextAuth from 'next-auth';
import { getNextAuthConfig } from '@/lib/auth/nextauth';

const handler = NextAuth(getNextAuthConfig());

export { handler as GET, handler as POST };

