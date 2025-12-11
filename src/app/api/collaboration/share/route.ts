/**
 * Share Link API
 * 
 * Generate and manage share links
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getCollaborationManager } from '@/lib/collaboration/realtime';

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const body = await request.json();
  const { sessionId, permissions } = body;

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const manager = getCollaborationManager();
  const session = manager.getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.ownerId !== userId) {
    return NextResponse.json({ error: 'Only session owner can generate share links' }, { status: 403 });
  }

  const shareLink = manager.generateShareLink(sessionId, permissions || 'view');

  return NextResponse.json({
    shareLink,
    token: session.shareToken,
    permissions: permissions || 'view',
  });
});

