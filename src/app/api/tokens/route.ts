/**
 * Design Tokens API Route (SLATE)
 * CRUD operations for design tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { tokenQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { tokenEvents } from '@/lib/events/publishers';
import { TokenCache } from '@/lib/cache/services/TokenCache';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders, addCacheHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schemas
const createTokenSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  value: z.string(),
  group: z.string().optional(),
  description: z.string().optional(),
});

/**
 * GET /api/tokens
 * Get all tokens (optionally filtered by category)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    // Simple category lookup (cached)
    if (category && !searchParams.has('page') && !searchParams.has('sort')) {
      // Try cache first
      const cached = await TokenCache.getTokens(category);
      if (cached) {
        const response = NextResponse.json(cached);
        addCacheHeaders(response, 3600, true); // Cache for 1 hour
        return applyStandardHeaders(response, { noCache: false, cacheMaxAge: 3600 });
      }

      // Fetch from database
      const tokens = await tokenQueries.findByCategory(category);

      // Cache result
      await TokenCache.cacheTokens(category, tokens);

      const response = NextResponse.json(tokens);
      addCacheHeaders(response, 3600, true); // Cache for 1 hour
      return applyStandardHeaders(response, { noCache: false, cacheMaxAge: 3600 });
    }

    // Advanced query with pagination, filtering, and sorting
    const pagination = parsePagination(request);
    const filters = parseFilters(request);
    const sort = parseSort(request);

    // Add category to filters if provided
    if (category) {
      filters.category = category;
    }

    // Validate filters
    const allowedFields = ['category', 'group', 'name', 'createdAt', 'updatedAt'];
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
    const orderBy = buildOrderBy(sort, { field: 'category', direction: 'asc' });

    // Get total count
    const { prisma } = await import('@/lib/db/client');
    const total = await prisma.designToken.count({ where });

    // Get paginated results
    const tokens = await prisma.designToken.findMany({
      where,
      orderBy,
      skip: pagination.offset,
      take: pagination.limit,
    });

    const paginatedResult = createPaginatedResponse(tokens, total, pagination);
    const response = NextResponse.json(paginatedResult);
    addPaginationHeaders(response, pagination, total);
    addCacheHeaders(response, 3600, true); // Cache for 1 hour
    return applyStandardHeaders(response, { noCache: false, cacheMaxAge: 3600 });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

/**
 * POST /api/tokens
 * Create or update a design token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTokenSchema.parse(body);

    // Upsert token (create or update)
    const token = await tokenQueries.upsert(
      validated.name,
      validated.category,
      {
        name: validated.name,
        category: validated.category,
        value: validated.value,
        group: validated.group,
        description: validated.description,
      }
    );

    // Invalidate cache
    await TokenCache.invalidate(validated.category);

    // Publish event
    await tokenEvents.updated({
      category: validated.category,
      tokens: await tokenQueries.findByCategory(validated.category),
    });

    // Log event
    await eventQueries.create({
      type: 'token.updated',
      subsystem: 'slate',
      payload: {
        name: token.name,
        category: token.category,
      },
    });

    const response = NextResponse.json(token, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating/updating token:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

