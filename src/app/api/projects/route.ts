/**
 * Projects API Route
 * CRUD operations for projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectQueries, eventQueries } from '@/lib/db/queries';
import { requireAuth, rateLimit } from '@/lib/middleware';
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

    const projects = await projectQueries.findAll(userId || undefined);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

