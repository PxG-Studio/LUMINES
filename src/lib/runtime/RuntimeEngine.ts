import { query, transaction } from '../database/client';
import { publish } from '../messaging/client';
import { requireAuth, requireProjectAccess } from '../auth/middleware';
import { CSharpValidator, ShaderValidator } from './validators';
import type { ValidationResult } from './validators';

export interface RuntimeResult {
  success: boolean;
  output: string;
  errors: Array<{ message: string; line?: number; column?: number }>;
  warnings: Array<{ message: string; line?: number; column?: number }>;
  executionTime?: number;
}

export interface RuntimeSession {
  id: string;
  user_id: string;
  project_id: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  logs: Array<{ message: string; level: string; timestamp: string }>;
  started_at: Date;
  ended_at?: Date;
  metadata?: Record<string, any>;
}

export interface RuntimeLog {
  message: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  timestamp: string;
  source?: string;
}

export class RuntimeEngine {
  static async validateCode(code: string, type: 'csharp' | 'shader'): Promise<RuntimeResult> {
    const startTime = Date.now();

    let validation: ValidationResult;
    if (type === 'csharp') {
      validation = CSharpValidator.validate(code);
    } else {
      validation = ShaderValidator.validate(code);
    }

    const executionTime = Date.now() - startTime;

    return {
      success: validation.valid,
      output: validation.valid
        ? `✓ ${type === 'csharp' ? 'C#' : 'Shader'} validation passed`
        : `✗ ${type === 'csharp' ? 'C#' : 'Shader'} validation failed`,
      errors: validation.errors,
      warnings: validation.warnings,
      executionTime,
    };
  }

  static async validateCSharp(code: string): Promise<RuntimeResult> {
    return this.validateCode(code, 'csharp');
  }

  static async validateShader(code: string): Promise<RuntimeResult> {
    return this.validateCode(code, 'shader');
  }

  static async createSession(projectId: string, metadata?: Record<string, any>): Promise<RuntimeSession> {
    await requireProjectAccess(projectId);
    const auth = await requireAuth();

    const result = await query<RuntimeSession>(
      `INSERT INTO slate_runtime_sessions
       (user_id, project_id, status, logs, metadata, started_at)
       VALUES ($1, $2, 'running', '[]'::jsonb, $3, NOW())
       RETURNING *`,
      [auth.userId, projectId, JSON.stringify(metadata || {})]
    );

    const session = result.rows[0];

    await publish('slate.runtime.started', {
      sessionId: session.id,
      projectId,
      userId: auth.userId,
      metadata,
      timestamp: new Date().toISOString(),
    });

    return session;
  }

  static async getSession(sessionId: string): Promise<RuntimeSession | null> {
    const auth = await requireAuth();

    const result = await query<RuntimeSession>(
      `SELECT * FROM slate_runtime_sessions
       WHERE id = $1 AND user_id = $2`,
      [sessionId, auth.userId]
    );

    return result.rows[0] || null;
  }

  static async addLog(sessionId: string, log: RuntimeLog): Promise<void> {
    const auth = await requireAuth();

    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Runtime session not found');
    }

    const logs = [...session.logs, log];

    await query(
      `UPDATE slate_runtime_sessions
       SET logs = $1
       WHERE id = $2`,
      [JSON.stringify(logs), sessionId]
    );

    await publish('slate.runtime.log', {
      sessionId,
      log,
      timestamp: new Date().toISOString(),
    });
  }

  static async pauseSession(sessionId: string): Promise<void> {
    const auth = await requireAuth();
    const session = await this.getSession(sessionId);

    if (!session) throw new Error('Runtime session not found');
    if (session.user_id !== auth.userId) throw new Error('Unauthorized');

    await query(
      `UPDATE slate_runtime_sessions SET status = 'paused' WHERE id = $1`,
      [sessionId]
    );

    await publish('slate.runtime.paused', {
      sessionId,
      projectId: session.project_id,
      userId: auth.userId,
      timestamp: new Date().toISOString(),
    });
  }

  static async resumeSession(sessionId: string): Promise<void> {
    const auth = await requireAuth();
    const session = await this.getSession(sessionId);

    if (!session) throw new Error('Runtime session not found');
    if (session.user_id !== auth.userId) throw new Error('Unauthorized');

    await query(
      `UPDATE slate_runtime_sessions SET status = 'running' WHERE id = $1`,
      [sessionId]
    );

    await publish('slate.runtime.resumed', {
      sessionId,
      projectId: session.project_id,
      userId: auth.userId,
      timestamp: new Date().toISOString(),
    });
  }

  static async stopSession(sessionId: string): Promise<void> {
    const auth = await requireAuth();
    const session = await this.getSession(sessionId);

    if (!session) throw new Error('Runtime session not found');
    if (session.user_id !== auth.userId) throw new Error('Unauthorized');

    await query(
      `UPDATE slate_runtime_sessions SET status = 'stopped', ended_at = NOW() WHERE id = $1`,
      [sessionId]
    );

    await publish('slate.runtime.stopped', {
      sessionId,
      projectId: session.project_id,
      userId: auth.userId,
      timestamp: new Date().toISOString(),
    });
  }

  static async getActiveSessions(projectId: string): Promise<RuntimeSession[]> {
    await requireProjectAccess(projectId);
    const auth = await requireAuth();

    const result = await query<RuntimeSession>(
      `SELECT * FROM slate_runtime_sessions
       WHERE project_id = $1
         AND user_id = $2
         AND status IN ('running', 'paused')
       ORDER BY started_at DESC`,
      [projectId, auth.userId]
    );

    return result.rows;
  }

  static async getSessionHistory(projectId: string, limit: number = 10): Promise<RuntimeSession[]> {
    await requireProjectAccess(projectId);
    const auth = await requireAuth();

    const result = await query<RuntimeSession>(
      `SELECT * FROM slate_runtime_sessions
       WHERE project_id = $1 AND user_id = $2
       ORDER BY started_at DESC
       LIMIT $3`,
      [projectId, auth.userId, limit]
    );

    return result.rows;
  }
}
