import { query, transaction } from '../database/client';
import { publish } from '../messaging/client';
import { requireAuth } from '../auth/middleware';
import { NotFoundError } from '../errors/ErrorHandler';

export interface RuntimeResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
}

export interface RuntimeSession {
  id: string;
  user_id: string;
  project_id: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  logs: Array<{ message: string; level: string; timestamp: string }>;
  started_at: Date;
  ended_at?: Date;
}

export class RuntimeEngine {
  static async validateCSharp(code: string): Promise<RuntimeResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const braceCount = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
    if (braceCount !== 0) {
      errors.push(`Mismatched braces: ${Math.abs(braceCount)} ${braceCount > 0 ? 'closing' : 'opening'} brace(s) missing`);
    }

    if (code.includes('Debug.Log') && !code.includes('using UnityEngine')) {
      warnings.push('Debug.Log used but UnityEngine not imported');
    }

    return {
      success: errors.length === 0,
      output: errors.length === 0 ? 'Code validation passed' : 'Validation failed',
      errors,
      warnings,
    };
  }

  static async createSession(projectId: string): Promise<RuntimeSession> {
    const auth = await requireAuth();
    const result = await query<RuntimeSession>(
      `INSERT INTO slate_runtime_sessions (user_id, project_id, status, logs, started_at)
       VALUES ($1, $2, 'running', '[]'::jsonb, NOW()) RETURNING *`,
      [auth.userId, projectId]
    );

    const session = result.rows[0];
    await publish('slate.runtime.started', {
      sessionId: session.id,
      projectId,
      userId: auth.userId,
      timestamp: new Date().toISOString(),
    });

    return session;
  }

  static async stopSession(sessionId: string): Promise<void> {
    const auth = await requireAuth();
    const session = await query<RuntimeSession>(
      `SELECT project_id, user_id FROM slate_runtime_sessions WHERE id = $1`,
      [sessionId]
    );

    if (session.rows.length === 0) throw new NotFoundError('Runtime session');
    if (session.rows[0].user_id !== auth.userId) throw new Error('Unauthorized');

    await query(`UPDATE slate_runtime_sessions SET status = 'stopped', ended_at = NOW() WHERE id = $1`, [sessionId]);
    await publish('slate.runtime.stopped', {
      sessionId,
      projectId: session.rows[0].project_id,
      userId: auth.userId,
      timestamp: new Date().toISOString(),
    });
  }
}
