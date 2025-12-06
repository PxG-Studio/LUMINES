/**
 * Deployments API Route (WAYPOINT)
 * CRUD operations for deployment records
 */

import { NextRequest, NextResponse } from 'next/server';
import { deploymentQueries, projectQueries, buildQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { deploymentEvents } from '@/lib/events/publishers';
import { requireAuth, rateLimit } from '@/lib/middleware';
import { z } from 'zod';

// Validation schemas
const createDeploymentSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  buildId: z.string().optional(),
  environment: z.enum(['staging', 'production']).default('staging'),
  version: z.string().min(1),
});

const updateDeploymentSchema = z.object({
  status: z.enum(['pending', 'deploying', 'live', 'failed', 'rolled_back']).optional(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});

/**
 * GET /api/deployments
 * Get all deployments (optionally filtered by projectId or userId)
 */
export async function GET(request: NextRequest) {
  // Authentication required
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  // Rate limiting
  const rateLimitResult = await rateLimit(request, authResult.request.user?.id);
  if (rateLimitResult.error) {
    return NextResponse.json(
      { error: rateLimitResult.error.message },
      {
        status: rateLimitResult.error.status,
        headers: rateLimitResult.error.headers,
      }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    let deployments;
    if (projectId) {
      deployments = await deploymentQueries.findByProjectId(projectId);
    } else if (userId) {
      deployments = await deploymentQueries.findByUserId(userId);
    } else {
      deployments = await deploymentQueries.findAll();
    }

    return NextResponse.json(deployments);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deployments
 * Create a new deployment
 */
export async function POST(request: NextRequest) {
  // Authentication required
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  // Rate limiting
  const rateLimitResult = await rateLimit(request, authResult.request.user?.id);
  if (rateLimitResult.error) {
    return NextResponse.json(
      { error: rateLimitResult.error.message },
      {
        status: rateLimitResult.error.status,
        headers: rateLimitResult.error.headers,
      }
    );
  }

  try {
    const body = await request.json();
    const validated = createDeploymentSchema.parse(body);

    // Verify project exists
    const project = await projectQueries.findById(validated.projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify build exists if provided
    if (validated.buildId) {
      const build = await buildQueries.findById(validated.buildId);
      if (!build) {
        return NextResponse.json(
          { error: 'Build not found' },
          { status: 404 }
        );
      }
    }

    // Create deployment
    const deployment = await deploymentQueries.create({
      project: { connect: { id: validated.projectId } },
      user: { connect: { id: validated.userId } },
      build: validated.buildId ? { connect: { id: validated.buildId } } : undefined,
      environment: validated.environment,
      version: validated.version,
      status: 'pending',
    });

    // Publish event
    await deploymentEvents.started({
      deploymentId: deployment.id,
      projectId: validated.projectId,
    });

    // Log event
    await eventQueries.create({
      type: 'deployment.started',
      subsystem: 'waypoint',
      userId: validated.userId,
      projectId: validated.projectId,
      deploymentId: deployment.id,
      payload: {
        environment: validated.environment,
        version: validated.version,
      },
    });

    return NextResponse.json(deployment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

