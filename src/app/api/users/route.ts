/**
 * Users API Route
 * CRUD operations for users
 */

import { NextRequest, NextResponse } from 'next/server';
import { userQueries, eventQueries } from '@/lib/db/queries';
import { requireAuth, rateLimit } from '@/lib/middleware';
import { parsePagination, createPaginatedResponse, addPaginationHeaders } from '@/lib/api/pagination';
import { parseFilters, parseSort, buildWhereClause, buildOrderBy, validateFilters } from '@/lib/api/filtering';
import { applyStandardHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  roles: z.array(z.string()).default(['user']),
  nocturnaId: z.string().optional(),
  jwtSubject: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

/**
 * GET /api/users
 * Get all users (with optional filtering)
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request);
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
    const email = searchParams.get('email');

    if (email) {
      const user = await userQueries.findByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    // TODO: Add pagination
    // For now, this would be too many users - should add filtering
    return NextResponse.json(
      { error: 'Please provide email parameter or implement pagination' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request);
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
    const validated = createUserSchema.parse(body);

    // Check if user already exists
    const existing = await userQueries.findByEmail(validated.email);
    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await userQueries.create(validated);

    // Log event
    await eventQueries.create({
      type: 'user.created',
      userId: user.id,
      payload: {
        email: user.email,
        roles: user.roles,
      },
    });

    const response = NextResponse.json(user, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating user:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

