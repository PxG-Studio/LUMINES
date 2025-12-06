/**
 * Deployments API Route (WAYPOINT)
 * CRUD operations for deployment records
 */

import { NextRequest, NextResponse } from 'next/server';
import { deploymentQueries, projectQueries, buildQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { deploymentEvents } from '@/lib/events/publishers';
import { requireAuth, rateLimit } from '@/lib/middleware';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders } from '@/lib/api/headers';
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

    // Simple queries (backward compatible)
    if (projectId && !searchParams.has('page') && !searchParams.has('sort')) {
      const deployments = await deploymentQueries.findByProjectId(projectId);
      const response = NextResponse.json(deployments);
      return applyStandardHeaders(response);
    }
    if (userId && !searchParams.has('page') && !searchParams.has('sort')) {
      const deployments = await deploymentQueries.findByUserId(userId);
      const response = NextResponse.json(deployments);
      return applyStandardHeaders(response);
    }

    // Advanced query with pagination, filtering, and sorting
    const pagination = parsePagination(request);
    const filters = parseFilters(request);
    const sort = parseSort(request);

    // Add projectId/userId to filters if provided
    if (projectId) {
      filters.projectId = projectId;
    }
    if (userId) {
      filters.userId = userId;
    }

    // Validate filters
    const allowedFields = ['projectId', 'userId', 'status', 'environment', 'version', 'createdAt', 'updatedAt', 'deployedAt'];
    const filterValidation = validateFilters(filters, allowedFields);
    if (!filterValidation.valid) {
      const response = NextResponse.json(
        { error: 'Invalid filter parameters', details: filterValidation.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    // Build where clause
    const where = buildWhereClause(filters);
    const orderBy = buildOrderBy(sort, { field: 'createdAt', direction: 'desc' });

    // Get total count
    const { prisma } = await import('@/lib/db/client');
    const total = await prisma.deployment.count({ where });

    // Get paginated results
    const deployments = await prisma.deployment.findMany({
      where,
      orderBy,
      skip: pagination.offset,
      take: pagination.limit,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const paginatedResult = createPaginatedResponse(deployments, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
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

    const response = NextResponse.json(deployment, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating deployment:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

