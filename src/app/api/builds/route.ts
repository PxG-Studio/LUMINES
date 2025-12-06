/**
 * Builds API Route (IGNIS)
 * CRUD operations for build records
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { buildEvents } from '@/lib/events/publishers';
import { z } from 'zod';

// Validation schemas
const createBuildSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  target: z.string().default('webgl'),
  configuration: z.string().default('development'),
});

const updateBuildSchema = z.object({
  status: z.enum(['pending', 'building', 'completed', 'failed', 'cancelled']).optional(),
  progress: z.number().min(0).max(100).optional(),
  artifactUrl: z.string().url().optional(),
  artifactSize: z.number().optional(),
  buildLog: z.string().optional(),
  error: z.string().optional(),
});

/**
 * GET /api/builds
 * Get all builds (optionally filtered by projectId)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    const builds = await buildQueries.findAll(projectId || undefined);

    return NextResponse.json(builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/builds
 * Create a new build
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createBuildSchema.parse(body);

    // Create build
    const build = await buildQueries.create({
      project: { connect: { id: validated.projectId } },
      user: { connect: { id: validated.userId } },
      target: validated.target,
      configuration: validated.configuration,
      status: 'pending',
      progress: 0,
    });

    // Publish event
    await buildEvents.started({
      buildId: build.id,
      projectId: validated.projectId,
    });

    // Log event
    await eventQueries.create({
      type: 'build.started',
      subsystem: 'ignis',
      userId: validated.userId,
      projectId: validated.projectId,
      buildId: build.id,
      payload: {
        target: validated.target,
        configuration: validated.configuration,
      },
    });

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating build:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

