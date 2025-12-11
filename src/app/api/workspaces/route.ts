/**
 * Workspaces API Route (SLATE)
 * CRUD operations for workspaces
 */

import { NextRequest, NextResponse } from 'next/server';
import { applyStandardHeaders } from '@/lib/api/headers';
import { z } from 'zod';

// Validation schema
const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().optional(),
  userId: z.string().optional(),
});

/**
 * GET /api/workspaces
 * Get all workspaces (optionally filtered by userId)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // TODO: Fetch from database
    // For now, return mock data
    const workspaces = [
      {
        id: 'personal',
        name: 'Personal Studio',
        description: 'Your personal game projects and assets',
        projects: 5,
        members: 1,
        storage: '2.4 GB',
        userId: userId || 'user-1',
      },
      {
        id: 'team-alpha',
        name: 'Alpha Game Studio',
        description: 'Collaborative studio for Alpha game project',
        projects: 12,
        members: 8,
        storage: '8.7 GB',
        userId: userId || 'user-1',
      },
    ];

    const response = NextResponse.json(workspaces);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createWorkspaceSchema.parse(body);

    // TODO: Create in database
    // For now, return mock response
    const workspace = {
      id: crypto.randomUUID(),
      name: validated.name,
      description: validated.description || '',
      projects: 0,
      members: 1,
      storage: '0 GB',
      userId: validated.userId || 'user-1',
      createdAt: new Date().toISOString(),
    };

    const response = NextResponse.json(workspace, { status: 201 });
    return applyStandardHeaders(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
      return applyStandardHeaders(response);
    }

    console.error('Error creating workspace:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

