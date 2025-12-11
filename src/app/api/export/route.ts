import { NextRequest, NextResponse } from "next/server";
import { generateUnityZip } from "@/lib/spark/export/zip-generator";
import { rateLimiters } from "@/lib/security/rate-limiter";
import { logRequest, logError } from "@/lib/spark/monitoring/request-logger";
import { sanitizeInput } from "@/lib/spark/security/input-sanitizer";
import { incrementCounter, recordHistogram } from "@/lib/spark/monitoring/metrics";
import { userRateLimitMiddleware, recordUserRequest } from "@/lib/spark/rate-limiting/user-limiter";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Apply per-user rate limiting
  const userRateLimitResponse = await userRateLimitMiddleware(request, 'export');
  if (userRateLimitResponse) {
    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/export',
      statusCode: 429,
      duration: Date.now() - startTime,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
    return userRateLimitResponse;
  }

  // Also apply global rate limiting as fallback
  const rateLimitResponse = await rateLimiters.standard.middleware(request);
  if (rateLimitResponse) {
    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/export',
      statusCode: 429,
      duration: Date.now() - startTime,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
    return rateLimitResponse;
  }

  try {
    const { code, scriptName } = await request.json();

    // Validate and sanitize input
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      logRequest({
        timestamp: new Date().toISOString(),
        method: 'POST',
        path: '/api/export',
        statusCode: 400,
        duration: Date.now() - startTime,
        error: 'Invalid or empty code',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { error: "Invalid or empty code" },
        { status: 400 }
      );
    }

    if (!scriptName || typeof scriptName !== 'string' || scriptName.trim().length === 0) {
      logRequest({
        timestamp: new Date().toISOString(),
        method: 'POST',
        path: '/api/export',
        statusCode: 400,
        duration: Date.now() - startTime,
        error: 'Invalid or empty scriptName',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { error: "Invalid or empty scriptName" },
        { status: 400 }
      );
    }

    // Sanitize script name
    const sanitizedNameResult = sanitizeInput(scriptName);
    if (sanitizedNameResult.blocked || !sanitizedNameResult.sanitized) {
      logRequest({
        timestamp: new Date().toISOString(),
        method: 'POST',
        path: '/api/export',
        statusCode: 400,
        duration: Date.now() - startTime,
        error: 'Invalid script name (blocked by sanitization)',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { error: "Script name contains invalid characters" },
        { status: 400 }
      );
    }

    // Validate script name format (basic sanitization)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(sanitizedNameResult.sanitized.trim())) {
      logRequest({
        timestamp: new Date().toISOString(),
        method: 'POST',
        path: '/api/export',
        statusCode: 400,
        duration: Date.now() - startTime,
        error: 'Invalid script name format',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { error: "Script name must be a valid C# identifier" },
        { status: 400 }
      );
    }

    const zipBlob = await generateUnityZip({ 
      code, 
      scriptName: sanitizedNameResult.sanitized.trim() 
    });
    const duration = Date.now() - startTime;

    // Record successful request for rate limiting
    await recordUserRequest(request, 'export', true);

    // Track metrics
    incrementCounter('api_export_total', 1, { status: 'success' });
    recordHistogram('api_export_duration_ms', duration);

    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/export',
      statusCode: 200,
      duration,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${scriptName}.zip"`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Record failed request for rate limiting
    await recordUserRequest(request, 'export', false);
    
    // Track error metrics
    incrementCounter('api_export_total', 1, { status: 'error' });
    recordHistogram('api_export_duration_ms', duration);
    
    logError(error instanceof Error ? error : new Error(errorMessage), {
      path: '/api/export',
      method: 'POST',
    });

    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/export',
      statusCode: 500,
      duration,
      error: errorMessage,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
