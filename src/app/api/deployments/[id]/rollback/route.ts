/**
 * Deployment Rollback Endpoint
 * POST /api/deployments/[id]/rollback
 */

import { NextRequest, NextResponse } from 'next/server';
import { deploymentQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { deploymentEvents } from '@/lib/events/publishers';
import { requireAuth, requireRole } from '@/lib/middleware';
import { logger } from '@/lib/monitoring/logger';
import { applyStandardHeaders } from '@/lib/api/headers';

/**
 * POST /api/deployments/[id]/rollback
 * Rollback deployment to previous version
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required (admin only)
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  // Check admin role
  const roleResult = requireRole(authResult.request, ['admin']);
  if (roleResult.error) {
    return NextResponse.json(
      { error: roleResult.error.message },
      { status: roleResult.error.status }
    );
  }

  try {
    // Get deployment
    const deployment = await deploymentQueries.findById(params.id);
    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    // Find previous successful deployment
    const allDeployments = await deploymentQueries.findByProjectId(deployment.projectId);
    const previousDeployment = allDeployments
      .filter(d => d.id !== params.id && d.status === 'live' && d.createdAt < deployment.createdAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (!previousDeployment) {
      return NextResponse.json(
        { error: 'No previous deployment found to rollback to' },
        { status: 404 }
      );
    }

    // Mark current deployment as rolled back
    await deploymentQueries.update(params.id, {
      status: 'rolled_back',
    });

    // Create new deployment pointing to previous build
    const rollbackDeployment = await deploymentQueries.create({
      project: { connect: { id: deployment.projectId } },
      user: { connect: { id: deployment.userId } },
      build: previousDeployment.buildId ? { connect: { id: previousDeployment.buildId } } : undefined,
      environment: deployment.environment,
      version: `rollback-${previousDeployment.version}`,
      status: 'pending',
    });

    // Log events to database
    await eventQueries.create({
      type: 'deployment.rolled_back',
      subsystem: 'waypoint',
      deploymentId: params.id,
      projectId: deployment.projectId,
      userId: deployment.userId,
      payload: {
        rolledBackTo: previousDeployment.id,
        rollbackVersion: rollbackDeployment.version,
      },
    });

    // Publish rollback event
    await deploymentEvents.rolledBack({
      deploymentId: params.id,
      projectId: deployment.projectId,
      userId: deployment.userId,
      previousVersion: previousDeployment.version,
      newStatus: rollbackDeployment.status,
    });

    logger.info('Deployment rollback successful', {
      deploymentId: params.id,
      rollbackDeploymentId: rollbackDeployment.id,
      previousVersion: previousDeployment.version,
    });

    const response = NextResponse.json({
      success: true,
      message: `Deployment ${params.id} rolled back successfully`,
      rollbackDeployment: {
        id: rollbackDeployment.id,
        version: rollbackDeployment.version,
        status: rollbackDeployment.status,
      },
      previousDeployment: {
        id: previousDeployment.id,
        version: previousDeployment.version,
      },
    });

    return applyStandardHeaders(response, { cache: 'no-store' });
  } catch (error) {
    console.error('Error rolling back deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

