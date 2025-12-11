/**
 * API Key Authentication for SPARK
 * 
 * Provides API key validation and user identification for SPARK endpoints
 */

import { NextRequest } from 'next/server';
import { getCurrentUserId } from './user-context';

export interface APIKeyAuthResult {
  authenticated: boolean;
  userId?: string;
  apiKeyId?: string;
  error?: string;
}

/**
 * Validate API key from request
 * 
 * MVP: Simple API key validation
 * Production: Should validate against database and check permissions
 */
export async function validateAPIKey(request: NextRequest): Promise<APIKeyAuthResult> {
  // Check for API key in headers
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return {
      authenticated: false,
      error: 'API key required. Provide X-API-Key header or Authorization: Bearer <key>',
    };
  }

  // MVP: Simple validation against environment variable
  // Production: Should validate against database
  const validAPIKeys = process.env.SPARK_API_KEYS?.split(',') || [];
  const masterAPIKey = process.env.SPARK_MASTER_API_KEY;

  // Check against master key
  if (masterAPIKey && apiKey === masterAPIKey) {
    return {
      authenticated: true,
      userId: getCurrentUserId(), // Use default user for master key
      apiKeyId: 'master',
    };
  }

  // Check against valid keys
  if (validAPIKeys.includes(apiKey)) {
    // Extract user ID from API key (format: user-{userId}-{hash})
    const userIdMatch = apiKey.match(/^user-([a-f0-9-]+)-/);
    const userId = userIdMatch ? userIdMatch[1] : getCurrentUserId();

    return {
      authenticated: true,
      userId,
      apiKeyId: apiKey.slice(0, 16), // First 16 chars as ID
    };
  }

  return {
    authenticated: false,
    error: 'Invalid API key',
  };
}

/**
 * Require API key authentication middleware
 */
export function requireAPIKey(
  handler: (req: NextRequest, context: { userId: string; apiKeyId: string }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = await validateAPIKey(request);

    if (!authResult.authenticated || !authResult.userId) {
      return new Response(
        JSON.stringify({ error: authResult.error || 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return handler(request, {
      userId: authResult.userId,
      apiKeyId: authResult.apiKeyId || 'unknown',
    });
  };
}

/**
 * Optional API key authentication (for endpoints that work with or without auth)
 */
export function optionalAPIKey(
  handler: (req: NextRequest, context: { userId: string; apiKeyId?: string }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = await validateAPIKey(request);

    if (authResult.authenticated && authResult.userId) {
      return handler(request, {
        userId: authResult.userId,
        apiKeyId: authResult.apiKeyId,
      });
    }

    // Fallback to default user
    return handler(request, {
      userId: getCurrentUserId(),
    });
  };
}

