/**
 * Projects API Route
 * CRUD operations for projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectQueries, eventQueries } from '@/lib/db/queries';
import { requireAuth, rateLimit } from '@/lib/middleware';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  engine: z.string().default('unity'),
  platform: z.string().default('webgl'),
  userId: z.string(),
  templateId: z.string().optional(),
});

/**
 * GET /api/projects
 * Get all projects (optionally filtered by userId)
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
    const userId = searchParams.get('userId');

    // If userId is provided, use simple query (backward compatible)
    if (userId && !searchParams.has('page') && !searchParams.has('sort')) {
      const projects = await projectQueries.findAll(userId);
      const response = NextResponse.json(projects);
      return applyStandardHeaders(response);
    }

    // Advanced query with pagination, filtering, and sorting
    const pagination = parsePagination(request);
    const filters = parseFilters(request);
    const sort = parseSort(request);

    // Add userId to filters if provided
    if (userId) {
      filters.userId = userId;
    }

    // Validate filters
    const allowedFields = ['userId', 'name', 'slug', 'engine', 'platform', 'createdAt', 'updatedAt'];
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
    const orderBy = buildOrderBy(sort, { field: 'updatedAt', direction: 'desc' });

    // Get total count
    const { prisma } = await import('@/lib/db/client');
    const total = await prisma.project.count({ where });

    // Get paginated results
    const projects = await prisma.project.findMany({
      where,
      orderBy,
      skip: pagination.offset,
      take: pagination.limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            components: true,
            builds: true,
            deployments: true,
          },
        },
      },
    });

    const paginatedResult = createPaginatedResponse(projects, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching projects:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

/**
 * POST /api/projects
 * Create a new project
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
    const validated = createProjectSchema.parse(body);

    // Check if slug already exists
    const existing = await projectQueries.findBySlug(validated.slug);
    if (existing) {
      return NextResponse.json(
        { error: 'Project with this slug already exists' },
        { status: 409 }
      );
    }

    // Create project
    const project = await projectQueries.create({
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      engine: validated.engine,
      platform: validated.platform,
      user: { connect: { id: validated.userId } },
      template: validated.templateId
        ? { connect: { id: validated.templateId } }
        : undefined,
    });

    // Log event
    await eventQueries.create({
      type: 'project.created',
      subsystem: 'ignition',
      userId: validated.userId,
      projectId: project.id,
      payload: {
        name: project.name,
        engine: project.engine,
      },
    });

    const response = NextResponse.json(project, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating project:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

