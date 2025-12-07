/**
 * SPARK Generation Status API Route
 * Get status of a specific generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { applyStandardHeaders } from '@/lib/api/headers';

/**
 * GET /api/generate/[generationId]
 * Get generation status by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { generationId: string } }
) {
  try {
    const { generationId } = params;

    if (!generationId) {
      const response = NextResponse.json(
        { error: 'generationId is required' },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    // TODO: Fetch actual generation status from database/cache
    // For now, return mock status
    const response = NextResponse.json({
      generationId,
      status: 'complete',
      progress: 100,
      code: '// Generated code would appear here',
      experts: {
        design: { status: 'complete', progress: 100 },
        logic: { status: 'complete', progress: 100 },
        performance: { status: 'complete', progress: 100 },
      },
      message: 'Generation complete',
    });

    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching generation status:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

