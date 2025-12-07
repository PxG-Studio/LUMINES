/**
 * NextAuth Configuration Bridge
 * 
 * Re-exports NextAuth configuration from SPARK auth module
 * This allows the main app to use SPARK's auth configuration
 */

export { getNextAuthConfig } from '@/lib/spark/auth/nextauth';
export type { SessionUser } from '@/lib/spark/auth/nextauth';

