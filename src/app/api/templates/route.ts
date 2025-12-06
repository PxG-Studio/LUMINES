/**
 * Templates API Route (IGNITION)
 * CRUD operations for project templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { templateQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { requireAuth, rateLimit } from '@/lib/middleware';
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

    const templates = await templateQueries.findAll(engine || undefined);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

