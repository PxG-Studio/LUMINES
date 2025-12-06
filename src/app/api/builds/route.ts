/**
 * Builds API Route (IGNIS)
 * CRUD operations for build records
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { buildEvents } from '@/lib/events/publishers';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders } from '@/lib/api/headers';
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

    // If projectId is provided, use simple query (backward compatible)
    if (projectId && !searchParams.has('page') && !searchParams.has('sort')) {
      const builds = await buildQueries.findByProjectId(projectId);
      const response = NextResponse.json(builds);
      return applyStandardHeaders(response);
    }

    // Advanced query with pagination, filtering, and sorting
    const pagination = parsePagination(request);
    const filters = parseFilters(request);
    const sort = parseSort(request);

    // Add projectId to filters if provided
    if (projectId) {
      filters.projectId = projectId;
    }

    // Validate filters
    const allowedFields = ['projectId', 'userId', 'status', 'target', 'configuration', 'createdAt', 'updatedAt', 'startedAt', 'completedAt'];
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
    const total = await prisma.build.count({ where });

    // Get paginated results
    const builds = await prisma.build.findMany({
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

    const paginatedResult = createPaginatedResponse(builds, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching builds:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
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

    const response = NextResponse.json(build, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating build:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

