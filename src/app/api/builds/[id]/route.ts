/**
 * Build API Route (by ID)
 * Get or update a specific build
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { buildEvents } from '@/lib/events/publishers';
import { z } from 'zod';

const updateBuildSchema = z.object({
  status: z.enum(['pending', 'building', 'completed', 'failed', 'cancelled']).optional(),
  progress: z.number().min(0).max(100).optional(),
  artifactUrl: z.string().url().optional(),
  artifactSize: z.number().optional(),
  buildLog: z.string().optional(),
  error: z.string().optional(),
});

/**
 * GET /api/builds/[id]
 * Get build by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const build = await buildQueries.findById(params.id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error('Error fetching build:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/builds/[id]
 * Update build status/progress
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateBuildSchema.parse(body);

    // Check if build exists
    const existing = await buildQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    // Update build
    const updated = await buildQueries.update(params.id, {
      ...validated,
      ...(validated.status === 'building' && { startedAt: new Date() }),
      ...(validated.status === 'completed' && { completedAt: new Date() }),
    });

    // Publish events based on status change
    if (validated.status === 'completed' && validated.artifactUrl) {
      await buildEvents.completed({
        buildId: params.id,
        projectId: existing.projectId,
        artifactUrl: validated.artifactUrl,
      });
    } else if (validated.status === 'failed') {
      await buildEvents.failed({
        buildId: params.id,
        projectId: existing.projectId,
        error: validated.error || 'Build failed',
      });
    } else if (validated.progress !== undefined) {
      await buildEvents.progress({
        buildId: params.id,
        progress: validated.progress,
        stage: 'building',
      });
    }

    // Log event
    await eventQueries.create({
      type: `build.${validated.status || 'updated'}`,
      subsystem: 'ignis',
      buildId: params.id,
      projectId: existing.projectId,
      userId: existing.userId,
      payload: validated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating build:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

