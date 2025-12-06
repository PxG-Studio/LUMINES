/**
 * Deployment API Route (by ID)
 * Get, update, or rollback a specific deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { deploymentQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { deploymentEvents } from '@/lib/events/publishers';
import { requireAuth } from '@/lib/middleware';
import { z } from 'zod';

const updateDeploymentSchema = z.object({
  status: z.enum(['pending', 'deploying', 'live', 'failed', 'rolled_back']).optional(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});

/**
 * GET /api/deployments/[id]
 * Get deployment by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const deployment = await deploymentQueries.findById(params.id);

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deployment);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/deployments/[id]
 * Update deployment status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const body = await request.json();
    const validated = updateDeploymentSchema.parse(body);

    // Check if deployment exists
    const existing = await deploymentQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    // Update deployment
    const updated = await deploymentQueries.update(params.id, {
      ...validated,
      ...(validated.status === 'live' && { deployedAt: new Date() }),
    });

    // Publish events based on status change
    if (validated.status === 'live' && validated.url) {
      await deploymentEvents.completed({
        deploymentId: params.id,
        projectId: existing.projectId,
        url: validated.url,
      });
    } else if (validated.status === 'failed') {
      await deploymentEvents.failed({
        deploymentId: params.id,
        projectId: existing.projectId,
        error: validated.error || 'Deployment failed',
      });
    }

    // Log event
    await eventQueries.create({
      type: `deployment.${validated.status || 'updated'}`,
      subsystem: 'waypoint',
      deploymentId: params.id,
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

    console.error('Error updating deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


