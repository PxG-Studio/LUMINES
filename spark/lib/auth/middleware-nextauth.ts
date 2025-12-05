/**
 * NextAuth.js Integrated Middleware
 * 
 * Enhanced middleware that integrates with NextAuth.js sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logEvent, AuditEvent } from '../monitoring/audit';

export interface AuthContext {
  userId: string;
  sessionId: string;
  isAuthenticated: boolean;
  email?: string;
  role?: string;
}

/**
 * Extract user from NextAuth.js session
 */
export async function getUserFromNextAuthSession(
  req: NextRequest
): Promise<AuthContext | null> {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token && token.id) {
      return {
        userId: token.id as string,
        sessionId: token.sessionId as string || generateSessionId(),
        isAuthenticated: true,
        email: token.email as string,
        role: token.role as string,
      };
    }
  } catch (error) {
    console.error('NextAuth session check failed:', error);
  }

  return null;
}

/**
 * Enhanced getUserFromRequest with NextAuth.js support
 */
export async function getUserFromRequest(req: NextRequest): Promise<AuthContext> {
  // Try NextAuth.js session first
  const nextAuthSession = await getUserFromNextAuthSession(req);
  if (nextAuthSession) {
    return nextAuthSession;
  }

  // Fallback to existing methods
  const sessionCookie = req.cookies.get('next-auth.session-token')?.value ||
                       req.cookies.get('__Secure-next-auth.session-token')?.value;
  const authHeader = req.headers.get('authorization');
  const apiKey = req.headers.get('x-api-key');

  if (sessionCookie) {
    // NextAuth.js session cookie (encrypted)
    // The session is validated by getToken above
    return {
      userId: 'anonymous',
      sessionId: generateSessionId(),
      isAuthenticated: false,
    };
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // Try to decode JWT token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub || payload.id || token.slice(0, 16),
        sessionId: generateSessionId(),
        isAuthenticated: true,
        email: payload.email,
      };
    } catch {
      return {
        userId: token.slice(0, 16),
        sessionId: generateSessionId(),
        isAuthenticated: true,
      };
    }
  }

  if (apiKey) {
    // API key authentication
    await logEvent(
      AuditEvent.USER_LOGIN,
      {
        method: 'api_key',
        apiKeyPrefix: apiKey.slice(0, 8),
      }
    );

    return {
      userId: `apikey-${apiKey.slice(0, 8)}`,
      sessionId: generateSessionId(),
      isAuthenticated: true,
    };
  }

  return {
    userId: 'anonymous',
    sessionId: generateSessionId(),
    isAuthenticated: false,
  };
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

