/**
 * Collaboration Sessions API
 * 
 * Manage collaboration sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getCollaborationManager } from '@/lib/collaboration/realtime';

export const POST = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const body = await request.json();
  const { projectId } = body;

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  const manager = getCollaborationManager();
  const session = manager.createSession(projectId, userId);

  return NextResponse.json(session, { status: 201 });
});

export const GET = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  const token = request.nextUrl.searchParams.get('token');

  const manager = getCollaborationManager();

  if (token) {
    const session = manager.getSessionByToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid share token' }, { status: 404 });
    }
    return NextResponse.json(session);
  }

  if (sessionId) {
    const session = manager.getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    // Check if user is participant
    const isParticipant = session.participants.some((p) => p.userId === userId);
    if (!isParticipant && session.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json(session);
  }

  return NextResponse.json({ error: 'sessionId or token required' }, { status: 400 });
});

