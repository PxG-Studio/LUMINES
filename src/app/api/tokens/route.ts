/**
 * Design Tokens API Route (SLATE)
 * CRUD operations for design tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { tokenQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { tokenEvents } from '@/lib/events/publishers';
import { TokenCache } from '@/lib/cache/services/TokenCache';
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

    let tokens;
    if (category) {
      // Try cache first
      const cached = await TokenCache.getTokens(category);
      if (cached) {
        return NextResponse.json(cached);
      }

      // Fetch from database
      tokens = await tokenQueries.findByCategory(category);

      // Cache result
      await TokenCache.cacheTokens(category, tokens);
    } else {
      tokens = await tokenQueries.findAll();
    }

    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    return NextResponse.json(token, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating/updating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

