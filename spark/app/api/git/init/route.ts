/**
 * Git Init API
 * 
 * Initialize Git repository for a project
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getGitManager } from '@/lib/version-control/git';

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const body = await request.json();
  const { projectId } = body;

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const git = getGitManager();
    git.init(projectId);

    return NextResponse.json({
      success: true,
      message: 'Repository initialized',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize repository' },
      { status: 500 }
    );
  }
});

