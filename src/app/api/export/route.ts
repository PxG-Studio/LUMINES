import { NextRequest, NextResponse } from "next/server";
import { generateUnityZip } from "@/lib/spark/export/zip-generator";
import { rateLimiters } from "@/lib/security/rate-limiter";
import { logRequest, logError } from "@/lib/spark/monitoring/request-logger";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Apply rate limiting
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

    // Validate input
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

    // Validate script name format (basic sanitization)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(scriptName.trim())) {
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

    const zipBlob = await generateUnityZip({ code, scriptName });
    const duration = Date.now() - startTime;

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
