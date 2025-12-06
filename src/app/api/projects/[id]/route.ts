/**
 * Project API Route (by ID)
 * Get, update, or delete a specific project
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  metadata: z.any().optional(),
});

/**
 * GET /api/projects/[id]
 * Get project by ID with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await projectQueries.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]
 * Update project
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateProjectSchema.parse(body);

    // Check if project exists
    const existing = await projectQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update project
    const updated = await projectQueries.update(params.id, validated);

    // Log event
    await eventQueries.create({
      type: 'project.updated',
      subsystem: 'ignition',
      projectId: params.id,
      userId: existing.userId,
      payload: validated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if project exists
    const existing = await projectQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project (cascade will handle related records)
    await projectQueries.delete(params.id);

    // Log event
    await eventQueries.create({
      type: 'project.deleted',
      subsystem: 'ignition',
      projectId: params.id,
      userId: existing.userId,
      payload: { name: existing.name },
    });

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

