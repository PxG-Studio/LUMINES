import { getCurrentUser, getAuthToken, isAuthenticated } from './client';
import { query } from '../database/client';
import { AuthenticationError, PermissionError } from '../errors/ErrorHandler';

/**
 * Require authentication middleware
 * Returns authenticated user or throws error
 */
export async function requireAuth(): Promise<{ userId: string; user: any }> {
  if (!isAuthenticated()) {
    throw new AuthenticationError('Authentication required');
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new AuthenticationError('No authenticated user');
  }

  const token = getAuthToken();
  if (!token) {
    throw new AuthenticationError('No auth token available');
  }

  try {
    const result = await query(
      `SELECT id, email, name, avatar, roles FROM users WHERE id = $1`,
      [currentUser.id]
    );

    if (result.rows.length === 0) {
      await createUserFromAuth(currentUser);

      const newUserResult = await query(
        `SELECT id, email, name, avatar, roles FROM users WHERE id = $1`,
        [currentUser.id]
      );

      return {
        userId: currentUser.id,
        user: newUserResult.rows[0],
      };
    }

    return {
      userId: currentUser.id,
      user: result.rows[0],
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    throw new AuthenticationError('Failed to verify user');
  }
}

/**
 * Check if user has required role
 */
export async function requireRole(role: string): Promise<{ userId: string; user: any }> {
  const auth = await requireAuth();

  if (!auth.user.roles || !auth.user.roles.includes(role)) {
    throw new PermissionError(`Required role: ${role}`);
  }

  return auth;
}

/**
 * Check if user owns project
 */
export async function requireProjectOwnership(projectId: string): Promise<{ userId: string; user: any }> {
  const auth = await requireAuth();

  const result = await query(
    `SELECT user_id FROM slate_projects WHERE id = $1`,
    [projectId]
  );

  if (result.rows.length === 0) {
    throw new PermissionError('Project not found');
  }

  if (result.rows[0].user_id !== auth.userId) {
    throw new PermissionError('You do not own this project');
  }

  return auth;
}

/**
 * Create user from auth session
 */
async function createUserFromAuth(user: any): Promise<void> {
  try {
    await query(
      `INSERT INTO users (id, email, name, avatar, roles, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        user.id,
        user.email,
        user.name || null,
        user.avatar || null,
        user.roles || [],
      ]
    );
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Validate API request authentication
 */
export async function validateRequest(request: Request): Promise<{ userId: string; user: any } | null> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const result = await query(
      `SELECT us.user_id, u.email, u.name, u.avatar, u.roles
       FROM user_sessions us
       JOIN users u ON u.id = us.user_id
       WHERE us.token = $1 AND us.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      userId: result.rows[0].user_id,
      user: {
        id: result.rows[0].user_id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        avatar: result.rows[0].avatar,
        roles: result.rows[0].roles,
      },
    };
  } catch (error) {
    console.error('Request validation error:', error);
    return null;
  }
}
