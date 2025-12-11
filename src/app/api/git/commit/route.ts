/**
 * Git Commit API
 * 
 * Create a commit
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getGitManager } from '@/lib/version-control/git';

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const body = await request.json();
  const { projectId, message, files } = body;

  if (!projectId || !message) {
    return NextResponse.json(
      { error: 'projectId and message are required' },
      { status: 400 }
    );
  }

  try {
    const git = getGitManager();
    const commit = git.commit(projectId, message, userId, files || []);

    return NextResponse.json(commit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create commit' },
      { status: 500 }
    );
  }
});

