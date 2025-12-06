/**
 * Template API Route (by ID or slug)
 * Get or update a specific template
 */

import { NextRequest, NextResponse } from 'next/server';
import { templateQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { requireAuth } from '@/lib/middleware';
import { z } from 'zod';

const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  structure: z.any().optional(),
  metadata: z.any().optional(),
});

/**
 * GET /api/templates/[id]
 * Get template by ID or slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by ID first
    let template = await templateQueries.findById(params.id);
    
    // If not found, try slug
    if (!template) {
      template = await templateQueries.findBySlug(params.id);
    }

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/templates/[id]
 * Update template (requires authentication)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication required
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  try {
    const body = await request.json();
    const validated = updateTemplateSchema.parse(body);

    // Try to find by ID first
    let existing = await templateQueries.findById(params.id);
    
    // If not found, try slug
    if (!existing) {
      existing = await templateQueries.findBySlug(params.id);
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update template
    const updated = await templateQueries.update(existing.id, validated);

    // Log event
    await eventQueries.create({
      type: 'template.updated',
      subsystem: 'ignition',
      payload: {
        templateId: updated.id,
        changes: validated,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

