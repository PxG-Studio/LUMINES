/**
 * API v1 Generate Endpoint
 * 
 * Public API endpoint for code generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getEngineRegistry } from '@/lib/engines/registry';
import { getRateLimiter, DEFAULT_RATE_LIMITS } from '@/lib/rate-limiting/limiter';
import { getAnalyticsTracker } from '@/lib/analytics/tracker';
import { getCostTracker } from '@/lib/analytics/cost-tracker';

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const startTime = Date.now();

  // Check rate limit
  const limiter = getRateLimiter();
  const limitResult = limiter.checkLimit(`generation:${userId}`, DEFAULT_RATE_LIMITS.generation);

  if (!limitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: limitResult.retryAfter,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': DEFAULT_RATE_LIMITS.generation.maxRequests.toString(),
          'X-RateLimit-Remaining': limitResult.remaining.toString(),
          'Retry-After': limitResult.retryAfter?.toString() || '60',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { prompt, engine, provider, claudeModel, openaiModel } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!engine) {
      return NextResponse.json({ error: 'Engine is required' }, { status: 400 });
    }

    const registry = getEngineRegistry();
    const adapter = registry.get(engine);

    if (!adapter) {
      return NextResponse.json(
        { error: `Unsupported engine: ${engine}` },
        { status: 400 }
      );
    }

    const result = await adapter.generate(prompt, {
      provider: provider || 'claude',
      claudeModel,
      openaiModel,
    });

    const generationTime = Date.now() - startTime;

    // Track analytics
    const tracker = getAnalyticsTracker();
    tracker.trackGeneration(
      engine,
      provider || 'claude',
      result.tokensUsed || 0,
      generationTime,
      result.success,
      userId
    );

    // Track cost
    if (result.success && result.inputTokens && result.outputTokens) {
      const costTracker = getCostTracker();
      costTracker.recordGeneration(
        (provider || 'claude') as 'claude' | 'openai',
        claudeModel || openaiModel || 'default',
        result.inputTokens,
        result.outputTokens,
        engine
      );
    }

    limiter.recordRequest(`generation:${userId}`, result.success);

    if (result.success) {
      return NextResponse.json({
        success: true,
        code: result.code,
        scriptName: result.scriptName,
        tokensUsed: result.tokensUsed,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        generationTime,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const tracker = getAnalyticsTracker();
    tracker.trackError(error instanceof Error ? error : new Error('Unknown error'), {}, userId);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
});

