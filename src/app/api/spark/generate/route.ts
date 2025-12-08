/**
 * SPARK Generation API Endpoint
 * 
 * REST API endpoint for generating Unity C# scripts
 * Supports API key authentication and per-user rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateUnityScript } from '@/app/spark/actions/generate';
import { optionalAPIKey } from '@/lib/spark/auth/api-key-auth';
import { userRateLimitMiddleware, recordUserRequest } from '@/lib/spark/rate-limiting/user-limiter';
import { logRequest, logError } from '@/lib/spark/monitoring/request-logger';
import { incrementCounter, recordHistogram } from '@/lib/spark/monitoring/metrics';

export const POST = optionalAPIKey(async (
  request: NextRequest,
  context: { userId: string; apiKeyId?: string }
): Promise<Response> => {
  const startTime = Date.now();

  // Apply per-user rate limiting
  const rateLimitResponse = await userRateLimitMiddleware(request, 'generation');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { prompt, provider, claudeModel, openaiModel } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate script
    const result = await generateUnityScript(prompt, {
      provider,
      claudeModel,
      openaiModel,
      userId: context.userId,
    });

    const duration = Date.now() - startTime;

    // Record successful request
    await recordUserRequest(request, 'generation', result.success);

    // Track metrics
    incrementCounter('api_generate_total', 1, {
      status: result.success ? 'success' : 'error',
      provider: result.success ? provider || 'claude' : 'unknown',
    });
    recordHistogram('api_generate_duration_ms', duration);

    // Log request
    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/spark/generate',
      statusCode: result.success ? 200 : 400,
      duration,
      userId: context.userId,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || 'Generation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Record failed request
    await recordUserRequest(request, 'generation', false);

    // Track error metrics
    incrementCounter('api_generate_total', 1, { status: 'error' });
    recordHistogram('api_generate_duration_ms', duration);

    // Log error
    logError(error instanceof Error ? error : new Error(errorMessage), {
      path: '/api/spark/generate',
      method: 'POST',
      userId: context.userId,
    });

    logRequest({
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/spark/generate',
      statusCode: 500,
      duration,
      error: errorMessage,
      userId: context.userId,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

