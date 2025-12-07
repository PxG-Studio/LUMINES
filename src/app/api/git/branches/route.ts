/**
 * Git Branches API
 * 
 * List and manage branches
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getGitManager } from '@/lib/version-control/git';

export const GET = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const projectId = request.nextUrl.searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const git = getGitManager();
    const branches = git.getBranches(projectId);

    return NextResponse.json({ branches });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get branches' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const body = await request.json();
  const { projectId, branchName, fromBranch } = body;

  if (!projectId || !branchName) {
    return NextResponse.json(
      { error: 'projectId and branchName are required' },
      { status: 400 }
    );
  }

  try {
    const git = getGitManager();
    const branch = git.createBranch(projectId, branchName, fromBranch);

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create branch' },
      { status: 500 }
    );
  }
});

