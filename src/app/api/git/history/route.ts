/**
 * Git History API
 * 
 * Get commit history
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getGitManager } from '@/lib/version-control/git';

export const GET = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const projectId = request.nextUrl.searchParams.get('projectId');
  const limit = request.nextUrl.searchParams.get('limit');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const git = getGitManager();
    const history = git.getHistory(projectId, limit ? parseInt(limit) : undefined);

    return NextResponse.json({ commits: history });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get history' },
      { status: 500 }
    );
  }
});

