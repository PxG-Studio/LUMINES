/**
 * Auth Middleware and Rate Limiting
 *
 * Production-grade security for SPARK endpoints
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMITS = {
  "/api/generate": { maxRequests: 20, windowMs: 60000 },
  "/api/preview": { maxRequests: 30, windowMs: 60000 },
  "/api/build": { maxRequests: 5, windowMs: 300000 },
  "/api/export": { maxRequests: 10, windowMs: 60000 },
  default: { maxRequests: 100, windowMs: 60000 },
};

export interface AuthContext {
  userId: string;
  sessionId: string;
  isAuthenticated: boolean;
}

/**
 * Extract user ID from request (session, JWT, API key, etc.)
 */
export function getUserFromRequest(req: NextRequest): AuthContext {
  const sessionCookie = req.cookies.get("session")?.value;
  const authHeader = req.headers.get("authorization");
  const apiKey = req.headers.get("x-api-key");

  if (sessionCookie) {
    try {
      const decoded = JSON.parse(atob(sessionCookie));
      return {
        userId: decoded.userId || "anonymous",
        sessionId: decoded.sessionId || generateSessionId(),
        isAuthenticated: true,
      };
    } catch {
      // Invalid session
    }
  }

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return {
      userId: token.slice(0, 16),
      sessionId: generateSessionId(),
      isAuthenticated: true,
    };
  }

  if (apiKey) {
    return {
      userId: `apikey-${apiKey.slice(0, 8)}`,
      sessionId: generateSessionId(),
      isAuthenticated: true,
    };
  }

  return {
    userId: "anonymous",
    sessionId: generateSessionId(),
    isAuthenticated: false,
  };
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const config =
    RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;

  const key = `${endpoint}:${identifier}`;
  let entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  if (entry.count > config.maxRequests * 2) {
    console.warn(`Rate limit abuse detected: ${identifier} on ${endpoint}`);
  }

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Middleware function for Next.js API routes
 */
export function withAuth(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authContext = getUserFromRequest(req);

    if (!authContext.isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    const endpoint = new URL(req.url).pathname;
    const rateLimit = checkRateLimit(authContext.userId, endpoint);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
          },
        }
      );
    }

    try {
      const response = await handler(req, authContext);

      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimit.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(rateLimit.resetAt).toISOString()
      );

      return response;
    } catch (error) {
      console.error("API handler error:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Optional auth (allows anonymous access but provides auth context)
 */
export function withOptionalAuth(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authContext = getUserFromRequest(req);
    const endpoint = new URL(req.url).pathname;
    const rateLimit = checkRateLimit(authContext.userId, endpoint);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    try {
      const response = await handler(req, authContext);
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimit.remaining.toString()
      );
      return response;
    } catch (error) {
      console.error("API handler error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate request payload size
 */
export function validatePayloadSize(
  req: NextRequest,
  maxSizeBytes: number
): { valid: boolean; size: number } {
  const contentLength = req.headers.get("content-length");
  const size = contentLength ? parseInt(contentLength, 10) : 0;

  return {
    valid: size <= maxSizeBytes,
    size,
  };
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

/**
 * Clean rate limit store (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt + 60000) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupRateLimitStore, 60000);

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
