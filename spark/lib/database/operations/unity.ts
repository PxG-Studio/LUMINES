/**
 * Database Operations for Unity MCP Integration
 *
 * Stores scripts, previews, builds, and operation logs
 */

import { query } from "../postgres-client";

export interface UnityScript {
  id: string;
  session_id: string;
  script_name: string;
  script_path: string;
  script_content: string;
  created_at: Date;
}

export interface UnityPreview {
  id: string;
  session_id: string;
  scene_path?: string;
  game_object?: string;
  frame_ref: string;
  format: string;
  cache_key: string;
  created_at: Date;
}

export interface UnityBuildJob {
  id: string;
  job_id: string;
  session_id: string;
  target: string;
  status: string;
  progress?: number;
  error?: string;
  output_path?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UnityOperation {
  id: string;
  session_id: string;
  operation_type: string;
  operation_data: any;
  status: string;
  error?: string;
  duration_ms?: number;
  created_at: Date;
}

export async function storeGeneratedScript(data: {
  sessionId: string;
  scriptName: string;
  scriptPath: string;
  scriptContent: string;
}): Promise<UnityScript | null> {
  try {
    const result = await query(
      `INSERT INTO spark_generated_scripts (session_id, script_name, script_path, script_content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.sessionId, data.scriptName, data.scriptPath, data.scriptContent]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error storing generated script:", error);
    return null;
  }
}

export async function storePreview(data: {
  sessionId: string;
  scenePath?: string;
  gameObject?: string;
  frameRef: string;
  format: string;
  cacheKey: string;
}): Promise<UnityPreview | null> {
  try {
    const result = await query(
      `INSERT INTO spark_previews (session_id, scene_path, game_object, frame_ref, format, cache_key)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.sessionId,
        data.scenePath || null,
        data.gameObject || null,
        data.frameRef,
        data.format,
        data.cacheKey,
      ]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error storing preview:", error);
    return null;
  }
}

export async function createBuildJob(data: {
  jobId: string;
  sessionId: string;
  target: string;
  status: string;
}): Promise<UnityBuildJob | null> {
  try {
    const result = await query(
      `INSERT INTO spark_build_jobs (job_id, session_id, target, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.jobId, data.sessionId, data.target, data.status]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error creating build job:", error);
    return null;
  }
}

export async function updateBuildJob(
  jobId: string,
  data: {
    status?: string;
    progress?: number;
    error?: string;
    outputPath?: string;
  }
): Promise<UnityBuildJob | null> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.progress !== undefined) {
      fields.push(`progress = $${paramIndex++}`);
      values.push(data.progress);
    }
    if (data.error !== undefined) {
      fields.push(`error = $${paramIndex++}`);
      values.push(data.error);
    }
    if (data.outputPath !== undefined) {
      fields.push(`output_path = $${paramIndex++}`);
      values.push(data.outputPath);
    }

    if (fields.length === 0) return null;

    values.push(jobId);
    fields.push(`updated_at = NOW()`);

    const result = await query(
      `UPDATE spark_build_jobs
       SET ${fields.join(", ")}
       WHERE job_id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating build job:", error);
    return null;
  }
}

export async function getBuildJob(jobId: string): Promise<UnityBuildJob | null> {
  try {
    const result = await query(
      `SELECT * FROM spark_build_jobs WHERE job_id = $1`,
      [jobId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting build job:", error);
    return null;
  }
}

export async function logOperation(data: {
  sessionId: string;
  operationType: string;
  operationData: any;
  status: string;
  error?: string;
  durationMs?: number;
}): Promise<UnityOperation | null> {
  try {
    const result = await query(
      `INSERT INTO spark_operations (session_id, operation_type, operation_data, status, error, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.sessionId,
        data.operationType,
        JSON.stringify(data.operationData),
        data.status,
        data.error || null,
        data.durationMs || null,
      ]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error logging operation:", error);
    return null;
  }
}

export async function getSessionOperations(
  sessionId: string,
  limit = 50
): Promise<UnityOperation[]> {
  try {
    const result = await query(
      `SELECT * FROM spark_operations
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [sessionId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting session operations:", error);
    return [];
  }
}

export async function getPreviewByCache(
  cacheKey: string
): Promise<UnityPreview | null> {
  try {
    const result = await query(
      `SELECT * FROM spark_previews
       WHERE cache_key = $1
       AND created_at > NOW() - INTERVAL '5 minutes'
       ORDER BY created_at DESC
       LIMIT 1`,
      [cacheKey]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting preview by cache:", error);
    return null;
  }
}
