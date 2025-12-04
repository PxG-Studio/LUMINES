import { query, queryReplica } from '../client';
import { getCached, setCached } from '../../cache/strategies';
import { CacheKeys, CacheTTL } from '../../cache/keys';
import { publishBuildEvent } from '../../messaging/events';
import type { BuildJob, BuildJobInsert, BuildJobUpdate } from '../../runtime/types';

export async function createBuildJob(job: BuildJobInsert): Promise<BuildJob> {
  const result = await query<BuildJob>(
    `INSERT INTO slate_build_jobs (project_id, user_id, build_type, target_platform, source_commit, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      job.project_id,
      job.user_id,
      job.build_type,
      job.target_platform,
      job.source_commit || null,
      JSON.stringify(job.metadata || {}),
    ]
  );

  const newJob = result.rows[0];

  await setCached(CacheKeys.buildJob(newJob.id), newJob, CacheTTL.buildJob);

  await publishBuildEvent({
    type: 'started',
    projectId: job.project_id,
    timestamp: Date.now(),
    data: newJob,
  }).catch((err) => console.error('Failed to publish build started event:', err));

  return newJob;
}

export async function getBuildJob(jobId: string): Promise<BuildJob | null> {
  return getCached(
    CacheKeys.buildJob(jobId),
    async () => {
      const result = await query<BuildJob>(
        `SELECT * FROM slate_build_jobs WHERE id = $1 AND deleted_at IS NULL`,
        [jobId]
      );
      return result.rows[0] || null;
    },
    CacheTTL.buildJob
  );
}

export async function listBuildJobs(projectId: string): Promise<BuildJob[]> {
  return getCached(
    CacheKeys.buildJobList(projectId),
    async () => {
      const result = await queryReplica<BuildJob>(
        `SELECT * FROM slate_build_jobs
         WHERE project_id = $1 AND deleted_at IS NULL
         ORDER BY created_at DESC`,
        [projectId]
      );
      return result.rows;
    },
    CacheTTL.buildJobList
  );
}

export async function updateBuildJob(
  jobId: string,
  updates: BuildJobUpdate
): Promise<BuildJob> {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.status !== undefined) {
    updateFields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }
  if (updates.progress !== undefined) {
    updateFields.push(`progress = $${paramIndex++}`);
    values.push(updates.progress);
  }
  if (updates.output_path !== undefined) {
    updateFields.push(`output_path = $${paramIndex++}`);
    values.push(updates.output_path);
  }
  if (updates.error_message !== undefined) {
    updateFields.push(`error_message = $${paramIndex++}`);
    values.push(updates.error_message);
  }
  if (updates.started_at !== undefined) {
    updateFields.push(`started_at = $${paramIndex++}`);
    values.push(updates.started_at);
  }
  if (updates.completed_at !== undefined) {
    updateFields.push(`completed_at = $${paramIndex++}`);
    values.push(updates.completed_at);
  }
  if (updates.metadata !== undefined) {
    updateFields.push(`metadata = $${paramIndex++}`);
    values.push(JSON.stringify(updates.metadata));
  }

  if (updateFields.length === 0) {
    const job = await getBuildJob(jobId);
    if (!job) throw new Error('Build job not found');
    return job;
  }

  values.push(jobId);
  const result = await query<BuildJob>(
    `UPDATE slate_build_jobs
     SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Build job not found');
  }

  const updated = result.rows[0];

  await setCached(CacheKeys.buildJob(jobId), updated, CacheTTL.buildJob);

  if (updates.progress !== undefined) {
    await publishBuildEvent({
      type: 'progress',
      projectId: updated.project_id,
      timestamp: Date.now(),
      data: { jobId, progress: updates.progress },
    }).catch((err) => console.error('Failed to publish build progress event:', err));
  }

  if (updates.status === 'completed') {
    await publishBuildEvent({
      type: 'completed',
      projectId: updated.project_id,
      timestamp: Date.now(),
      data: updated,
    }).catch((err) => console.error('Failed to publish build completed event:', err));
  }

  if (updates.status === 'failed') {
    await publishBuildEvent({
      type: 'failed',
      projectId: updated.project_id,
      timestamp: Date.now(),
      data: { jobId, error: updates.error_message },
    }).catch((err) => console.error('Failed to publish build failed event:', err));
  }

  return updated;
}

export async function deleteBuildJob(jobId: string): Promise<void> {
  await query(`UPDATE slate_build_jobs SET deleted_at = NOW() WHERE id = $1`, [jobId]);

  await setCached(CacheKeys.buildJob(jobId), null, 0);
}

export async function getActiveBuildJobs(userId: string): Promise<BuildJob[]> {
  const result = await queryReplica<BuildJob>(
    `SELECT * FROM slate_build_jobs
     WHERE user_id = $1
     AND status IN ('queued', 'building')
     AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function getRecentBuildJobs(
  projectId: string,
  limit = 10
): Promise<BuildJob[]> {
  const result = await queryReplica<BuildJob>(
    `SELECT * FROM slate_build_jobs
     WHERE project_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT $2`,
    [projectId, limit]
  );

  return result.rows;
}

export async function getBuildStatistics(projectId: string): Promise<{
  total: number;
  completed: number;
  failed: number;
  averageDuration: number;
}> {
  const result = await queryReplica<any>(
    `SELECT
       COUNT(*) as total,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
       AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as average_duration
     FROM slate_build_jobs
     WHERE project_id = $1
     AND deleted_at IS NULL
     AND completed_at IS NOT NULL`,
    [projectId]
  );

  const stats = result.rows[0];

  return {
    total: parseInt(stats.total) || 0,
    completed: parseInt(stats.completed) || 0,
    failed: parseInt(stats.failed) || 0,
    averageDuration: parseFloat(stats.average_duration) || 0,
  };
}
