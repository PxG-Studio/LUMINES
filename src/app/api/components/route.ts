/**
 * Components API Route (SPARK)
 * CRUD operations for AI-generated components
 */

import { NextRequest, NextResponse } from 'next/server';
import { componentQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { componentEvents } from '@/lib/events/publishers';
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

    const components = await componentQueries.findAll(projectId || undefined);

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating component:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

