/**
 * JWT Token Verification Endpoint
 * Verifies access tokens and returns user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, extractJWT } from '@/lib/middleware/auth';

/**
 * GET /api/auth/verify
 * Verify access token from Authorization header
 */
export async function GET(request: NextRequest) {
  const token = extractJWT(request);
  
  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'Missing or invalid authorization header' },
      { status: 401 }
    );
  }

  const claims = await verifyJWT(token);
  
  if (!claims) {
    return NextResponse.json(
      { valid: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    valid: true,
    user_id: claims.sub,
    email: claims.email,
    roles: claims.roles,
    expires_at: claims.exp ? new Date(claims.exp * 1000).toISOString() : null,
    issued_at: claims.iat ? new Date(claims.iat * 1000).toISOString() : null,
  });
}

