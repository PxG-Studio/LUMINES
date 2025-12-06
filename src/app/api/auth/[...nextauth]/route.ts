/**
 * NextAuth API Route Handler
 * Handles all authentication requests (sign in, sign out, callback, etc.)
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
