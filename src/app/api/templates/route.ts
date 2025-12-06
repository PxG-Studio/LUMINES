/**
 * Templates API Route (IGNITION)
 * CRUD operations for project templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { templateQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { requireAuth, rateLimit } from '@/lib/middleware';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders, addCacheHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  engine: z.string().default('unity'),
  category: z.string().optional(),
  structure: z.any(), // JSON structure for file tree
  metadata: z.any().optional(),
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  structure: z.any().optional(),
  metadata: z.any().optional(),
});

/**
 * GET /api/templates
 * Get all templates (optionally filtered by engine)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const engine = searchParams.get('engine');

    // Simple engine filter (backward compatible)
    if (engine && !searchParams.has('page') && !searchParams.has('sort')) {
      const templates = await templateQueries.findAll(engine);
      const response = NextResponse.json(templates);
      addCacheHeaders(response, 3600, true); // Cache templates for 1 hour
      return applyStandardHeaders(response, { noCache: false, cacheMaxAge: 3600 });
    }

    // Advanced query with pagination, filtering, and sorting
    const pagination = parsePagination(request);
    const filters = parseFilters(request);
    const sort = parseSort(request);

    // Add engine to filters if provided
    if (engine) {
      filters.engine = engine;
    }

    // Validate filters
    const allowedFields = ['engine', 'category', 'name', 'slug', 'createdAt', 'updatedAt'];
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
    const total = await prisma.template.count({ where });

    // Get paginated results
    const templates = await prisma.template.findMany({
      where,
      orderBy,
      skip: pagination.offset,
      take: pagination.limit,
    });

    const paginatedResult = createPaginatedResponse(templates, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    addCacheHeaders(response, 3600, true); // Cache templates for 1 hour
    return applyStandardHeaders(response, { noCache: false, cacheMaxAge: 3600 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

/**
 * POST /api/templates
 * Create a new template (requires authentication)
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
    const validated = createTemplateSchema.parse(body);

    // Check if slug already exists
    const existing = await templateQueries.findBySlug(validated.slug);
    if (existing) {
      return NextResponse.json(
        { error: 'Template with this slug already exists' },
        { status: 409 }
      );
    }

    // Create template
    const template = await templateQueries.create({
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      engine: validated.engine,
      category: validated.category,
      structure: validated.structure,
      metadata: validated.metadata,
    });

    // Log event
    await eventQueries.create({
      type: 'template.created',
      subsystem: 'ignition',
      payload: {
        templateId: template.id,
        name: template.name,
        engine: template.engine,
      },
    });

    const response = NextResponse.json(template, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating template:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

