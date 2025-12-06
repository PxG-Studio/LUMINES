/**
 * Project Components API Route
 * Get all components for a specific project
 */

import { NextRequest, NextResponse } from 'next/server';
import { componentQueries, projectQueries } from '@/lib/db/queries';

/**
 * GET /api/projects/[id]/components
 * Get all components for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify project exists
    const project = await projectQueries.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get components for project
    const components = await componentQueries.findByProjectId(params.id);

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching project components:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

