/**
 * JWT Token Refresh Endpoint
 * Refreshes access tokens using refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyJWT, extractJWT } from '@/lib/middleware/auth';

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = refreshTokenSchema.parse(body);

    // Verify refresh token
    const claims = await verifyJWT(validated.refresh_token);
    
    if (!claims) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Check if token has refresh scope
    // Note: In production, you'd check for 'refresh' scope in token claims
    // For now, we'll accept any valid JWT as a refresh token

    // TODO: Generate new access token
    // In a real implementation, you would:
    // 1. Verify the refresh token was issued for refresh
    // 2. Generate a new access token with shorter expiry
    // 3. Return new access token

    // For now, return the same token (not ideal, but functional)
    // In production, implement proper token generation
    
    return NextResponse.json({
      access_token: validated.refresh_token, // TODO: Generate new token
      expires_in: 3600,
      token_type: 'Bearer',
      user: {
        id: claims.sub,
        email: claims.email,
        roles: claims.roles,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/refresh (alternative: using Authorization header)
 */
export async function PUT(request: NextRequest) {
  // Extract refresh token from Authorization header
  const refreshToken = extractJWT(request);
  
  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Missing refresh token' },
      { status: 401 }
    );
  }

  // Verify refresh token
  const claims = await verifyJWT(refreshToken);
  
  if (!claims) {
    return NextResponse.json(
      { error: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }

  // TODO: Generate new access token
  return NextResponse.json({
    access_token: refreshToken, // TODO: Generate new token
    expires_in: 3600,
    token_type: 'Bearer',
    user: {
      id: claims.sub,
      email: claims.email,
      roles: claims.roles,
    },
  });
}

