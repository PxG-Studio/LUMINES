/**
 * JWT Token Refresh Endpoint
 * Refreshes access tokens using refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyJWT, extractJWT } from '@/lib/middleware/auth';
import { generateAccessToken } from '@/lib/auth/jwt';
import { logger } from '@/lib/monitoring/logger';

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

    // Generate new access token with shorter expiry (15 minutes)
    const newAccessToken = await generateAccessToken(
      claims.sub,
      claims.roles || ['user'],
      '15m' // Access tokens expire in 15 minutes
    );

    logger.info('Access token refreshed', { 
      userId: claims.sub, 
      email: claims.email 
    });
    
    return NextResponse.json({
      access_token: newAccessToken,
      expires_in: 900, // 15 minutes in seconds
      token_type: 'Bearer',
      refresh_token: validated.refresh_token, // Return the same refresh token
      user: {
        id: claims.sub,
        email: claims.email,
        roles: claims.roles || ['user'],
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

  // Generate new access token
  const newAccessToken = await generateAccessToken(
    claims.sub,
    claims.roles || ['user'],
    '15m' // Access tokens expire in 15 minutes
  );

  logger.info('Access token refreshed (via PUT)', { 
    userId: claims.sub, 
    email: claims.email 
  });

  return NextResponse.json({
    access_token: newAccessToken,
    expires_in: 900, // 15 minutes in seconds
    token_type: 'Bearer',
    refresh_token: refreshToken, // Return the same refresh token
    user: {
      id: claims.sub,
      email: claims.email,
      roles: claims.roles || ['user'],
    },
  });
}

