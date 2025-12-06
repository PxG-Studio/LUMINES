/**
 * User API Route (by ID)
 * Get, update, or delete a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { userQueries } from '@/lib/db/queries';
import { eventQueries } from '@/lib/db/queries';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

/**
 * GET /api/users/[id]
 * Get user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userQueries.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Update user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    // Check if user exists
    const existing = await userQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updated = await userQueries.update(params.id, validated);

    // Log event
    await eventQueries.create({
      type: 'user.updated',
      userId: params.id,
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

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Delete user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user exists
    const existing = await userQueries.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user (cascade will handle related records)
    // Note: Using Prisma directly for delete since we don't have delete in queries yet
    const { prisma } = await import('@/lib/db/client');
    await prisma.user.delete({ where: { id: params.id } });

    // Log event
    await eventQueries.create({
      type: 'user.deleted',
      userId: params.id,
      payload: { email: existing.email },
    });

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

