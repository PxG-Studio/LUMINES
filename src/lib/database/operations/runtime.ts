import { query, queryReplica } from '../client';
import { getCached, setCached } from '../../cache/strategies';
import { CacheKeys, CacheTTL } from '../../cache/keys';
import { publishRuntimeEvent } from '../../messaging/events';
import type {
  RuntimeSession,
  RuntimeSessionInsert,
  RuntimeSessionUpdate,
  RuntimeLog,
} from '../../runtime/types';

export async function createRuntimeSession(
  session: RuntimeSessionInsert
): Promise<RuntimeSession> {
  const result = await query<RuntimeSession>(
    `INSERT INTO slate_runtime_sessions (project_id, user_id, runtime_type, container_config, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      session.project_id,
      session.user_id,
      session.runtime_type,
      JSON.stringify(session.container_config),
      JSON.stringify(session.metadata || {}),
    ]
  );

  const newSession = result.rows[0];

  await setCached(CacheKeys.runtimeSession(newSession.id), newSession, CacheTTL.runtimeSession);

  await publishRuntimeEvent({
    type: 'started',
    sessionId: newSession.id,
    projectId: session.project_id,
    timestamp: Date.now(),
    data: newSession,
  }).catch((err) => console.error('Failed to publish runtime started event:', err));

  return newSession;
}

export async function getRuntimeSession(sessionId: string): Promise<RuntimeSession | null> {
  return getCached(
    CacheKeys.runtimeSession(sessionId),
    async () => {
      const result = await query<RuntimeSession>(
        `SELECT * FROM slate_runtime_sessions WHERE id = $1 AND deleted_at IS NULL`,
        [sessionId]
      );
      return result.rows[0] || null;
    },
    CacheTTL.runtimeSession
  );
}

export async function listRuntimeSessions(projectId: string): Promise<RuntimeSession[]> {
  return getCached(
    CacheKeys.runtimeSessionList(projectId),
    async () => {
      const result = await queryReplica<RuntimeSession>(
        `SELECT * FROM slate_runtime_sessions
         WHERE project_id = $1 AND deleted_at IS NULL
         ORDER BY created_at DESC`,
        [projectId]
      );
      return result.rows;
    },
    CacheTTL.runtimeSessionList
  );
}

export async function updateRuntimeSession(
  sessionId: string,
  updates: RuntimeSessionUpdate
): Promise<RuntimeSession> {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.status !== undefined) {
    updateFields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }
  if (updates.container_id !== undefined) {
    updateFields.push(`container_id = $${paramIndex++}`);
    values.push(updates.container_id);
  }
  if (updates.started_at !== undefined) {
    updateFields.push(`started_at = $${paramIndex++}`);
    values.push(updates.started_at);
  }
  if (updates.stopped_at !== undefined) {
    updateFields.push(`stopped_at = $${paramIndex++}`);
    values.push(updates.stopped_at);
  }
  if (updates.error_message !== undefined) {
    updateFields.push(`error_message = $${paramIndex++}`);
    values.push(updates.error_message);
  }
  if (updates.metadata !== undefined) {
    updateFields.push(`metadata = $${paramIndex++}`);
    values.push(JSON.stringify(updates.metadata));
  }

  if (updateFields.length === 0) {
    const session = await getRuntimeSession(sessionId);
    if (!session) throw new Error('Runtime session not found');
    return session;
  }

  values.push(sessionId);
  const result = await query<RuntimeSession>(
    `UPDATE slate_runtime_sessions
     SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Runtime session not found');
  }

  const updated = result.rows[0];

  await setCached(CacheKeys.runtimeSession(sessionId), updated, CacheTTL.runtimeSession);

  if (updates.status) {
    await publishRuntimeEvent({
      type: 'status',
      sessionId,
      projectId: updated.project_id,
      timestamp: Date.now(),
      data: { status: updates.status },
    }).catch((err) => console.error('Failed to publish runtime status event:', err));
  }

  return updated;
}

export async function deleteRuntimeSession(sessionId: string): Promise<void> {
  const session = await getRuntimeSession(sessionId);

  await query(
    `UPDATE slate_runtime_sessions SET deleted_at = NOW() WHERE id = $1`,
    [sessionId]
  );

  await setCached(CacheKeys.runtimeSession(sessionId), null, 0);

  if (session) {
    await publishRuntimeEvent({
      type: 'stopped',
      sessionId,
      projectId: session.project_id,
      timestamp: Date.now(),
    }).catch((err) => console.error('Failed to publish runtime stopped event:', err));
  }
}

export async function addRuntimeLog(
  sessionId: string,
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  metadata?: Record<string, any>
): Promise<RuntimeLog> {
  const result = await query<RuntimeLog>(
    `INSERT INTO slate_runtime_logs (session_id, level, message, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sessionId, level, message, JSON.stringify(metadata || {})]
  );

  const log = result.rows[0];

  await publishRuntimeEvent({
    type: 'log',
    sessionId,
    projectId: '',
    timestamp: Date.now(),
    data: log,
  }).catch((err) => console.error('Failed to publish runtime log event:', err));

  return log;
}

export async function getRuntimeLogs(
  sessionId: string,
  limit = 100,
  offset = 0
): Promise<RuntimeLog[]> {
  const result = await queryReplica<RuntimeLog>(
    `SELECT * FROM slate_runtime_logs
     WHERE session_id = $1
     ORDER BY timestamp DESC
     LIMIT $2 OFFSET $3`,
    [sessionId, limit, offset]
  );

  return result.rows;
}

export async function getActiveRuntimeSessions(userId: string): Promise<RuntimeSession[]> {
  const result = await queryReplica<RuntimeSession>(
    `SELECT * FROM slate_runtime_sessions
     WHERE user_id = $1
     AND status IN ('creating', 'starting', 'running')
     AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}
