/**
 * Authentication Middleware
 * JWT validation and user context extraction
 */

import { NextRequest } from 'next/server';
import { userQueries } from '@/lib/db/queries';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    roles: string[];
    nocturnaId?: string | null;
  };
}

/**
 * Extract JWT from Authorization header
 */
export function extractJWT(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify JWT token
 * TODO: Implement actual JWT verification with nocturnaID.org public key
 */
export async function verifyJWT(token: string): Promise<{
  sub: string;
  email: string;
  roles: string[];
} | null> {
  try {
    // TODO: Implement JWT verification
    // For now, this is a placeholder
    // Should:
    // 1. Get public key from nocturnaID.org/.well-known/jwks.json
    // 2. Verify token signature
    // 3. Verify expiration, issuer, audience
    // 4. Extract claims

    // Placeholder: return null to indicate token is invalid
    // In production, implement actual verification
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Authentication middleware
 * Validates JWT and attaches user to request
 */
export async function authenticate(
  request: NextRequest
): Promise<{ request: AuthenticatedRequest; error?: { status: number; message: string } }> {
  const token = extractJWT(request);
  
  if (!token) {
    return {
      request: request as AuthenticatedRequest,
      error: {
        status: 401,
        message: 'Missing or invalid authorization header',
      },
    };
  }

  const claims = await verifyJWT(token);
  
  if (!claims) {
    return {
      request: request as AuthenticatedRequest,
      error: {
        status: 401,
        message: 'Invalid or expired token',
      },
    };
  }

  // Find or create user based on JWT subject
  let user = await userQueries.findByNocturnaId(claims.sub);
  
  if (!user) {
    // Create user if doesn't exist
    user = await userQueries.create({
      email: claims.email,
      nocturnaId: claims.sub,
      jwtSubject: claims.sub,
      roles: claims.roles,
    });
  }

  // Attach user to request
  (request as AuthenticatedRequest).user = {
    id: user.id,
    email: user.email,
    roles: user.roles,
    nocturnaId: user.nocturnaId,
  };

  return { request: request as AuthenticatedRequest };
}

/**
 * Require authentication middleware
 * Returns 401 if not authenticated
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ request: AuthenticatedRequest; error?: { status: number; message: string } }> {
  const result = await authenticate(request);
  return result;
}

/**
 * Require role middleware
 * Returns 403 if user doesn't have required role
 */
export function requireRole(
  request: AuthenticatedRequest,
  roles: string[]
): { request: AuthenticatedRequest; error?: { status: number; message: string } } {
  if (!request.user) {
    return {
      request,
      error: {
        status: 401,
        message: 'Authentication required',
      },
    };
  }

  const hasRole = roles.some(role => request.user!.roles.includes(role));
  
  if (!hasRole) {
    return {
      request,
      error: {
        status: 403,
        message: 'Insufficient permissions',
      },
    };
  }

  return { request };
}

