/**
 * Components API Route (SPARK)
 * CRUD operations for AI-generated components
 */

import { NextRequest, NextResponse } from 'next/server';
import { componentQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { componentEvents } from '@/lib/events/publishers';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schemas
const createComponentSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  content: z.string(),
  language: z.string().default('csharp'),
  userId: z.string(),
  projectId: z.string().optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
  experts: z.array(z.string()).optional(),
  generationId: z.string().optional(),
});

/**
 * GET /api/components
 * Get all components (optionally filtered by projectId)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    // If projectId is provided, use simple query (backward compatible)
    if (projectId && !searchParams.has('page') && !searchParams.has('sort')) {
      const components = await componentQueries.findByProjectId(projectId);
      const response = NextResponse.json(components);
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
    const allowedFields = ['projectId', 'userId', 'name', 'type', 'language', 'createdAt', 'updatedAt'];
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
    const total = await prisma.component.count({ where });

    // Get paginated results
    const components = await prisma.component.findMany({
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
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const paginatedResult = createPaginatedResponse(components, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching components:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

/**
 * POST /api/components
 * Create a new component (SPARK generation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createComponentSchema.parse(body);

    // Create component
    const component = await componentQueries.create({
      name: validated.name,
      type: validated.type,
      content: validated.content,
      language: validated.language,
      user: { connect: { id: validated.userId } },
      project: validated.projectId
        ? { connect: { id: validated.projectId } }
        : undefined,
      prompt: validated.prompt,
      model: validated.model,
      experts: validated.experts || [],
      generationId: validated.generationId,
    });

    // Publish event
    await componentEvents.created({
      componentId: component.id,
      projectId: component.projectId || '',
      component: {
        name: component.name,
        type: component.type,
      },
    });

    // Log event
    await eventQueries.create({
      type: 'component.created',
      subsystem: 'spark',
      userId: validated.userId,
      projectId: validated.projectId,
      componentId: component.id,
      payload: {
        name: component.name,
        type: component.type,
        generationId: validated.generationId,
      },
    });

    const response = NextResponse.json(component, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating component:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

