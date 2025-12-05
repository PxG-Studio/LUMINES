/**
 * User context helper for SPARK
 *
 * TEMPORARY: MVP uses default user ID
 * TODO: Replace with actual auth integration:
 * - Cloudflare Zero Trust JWT validation
 * - nocturnaID user management
 * - Session management
 */

/**
 * Get current user ID
 *
 * MVP: Returns default user ID from environment
 * Production: Extract from JWT token, validate with Cloudflare Zero Trust
 */
export function getCurrentUserId(): string {
  const defaultUserId = process.env.DEFAULT_USER_ID || '00000000-0000-0000-0000-000000000000';

  return defaultUserId;
}

/**
 * Set user context for database queries (for RLS policies)
 * This sets the app.current_user_id PostgreSQL setting
 *
 * NOTE: This requires SECURITY DEFINER functions or direct connection
 * For MVP, RLS policies may not work without proper session context
 * This is a placeholder for future auth integration
 */
export async function setUserContext(userId: string, client: any): Promise<void> {
  try {
    await client.query(`SET app.current_user_id = $1`, [userId]);
  } catch (error) {
    console.warn('Could not set user context (RLS may not work):', error);
  }
}
