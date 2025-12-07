import { query, queryReplica } from '../client';
import { getCached, setCached, invalidateProjectCache } from '../../cache/strategies';
import { CacheKeys, CacheTTL } from '../../cache/keys';
import { publishProjectEvent } from '../../messaging/events';
import type { SlateProject, SlateProjectInsert, SlateProjectUpdate } from '../types';

export async function createProject(project: SlateProjectInsert): Promise<SlateProject> {
  const result = await query<SlateProject>(
    `INSERT INTO slate_projects (user_id, name, description, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      project.user_id,
      project.name,
      project.description || null,
      JSON.stringify(project.metadata || {}),
    ]
  );

  const newProject = result.rows[0];

  await setCached(CacheKeys.project(newProject.id), newProject, CacheTTL.project);
  await setCached(CacheKeys.projectList(project.user_id), null, 0);

  await publishProjectEvent({
    type: 'created',
    projectId: newProject.id,
    userId: project.user_id,
    timestamp: Date.now(),
    data: newProject,
  }).catch((err) => console.error('Failed to publish project created event:', err));

  return newProject;
}

export async function getProject(projectId: string): Promise<SlateProject | null> {
  return getCached(
    CacheKeys.project(projectId),
    async () => {
      const result = await query<SlateProject>(
        `SELECT * FROM slate_projects WHERE id = $1 AND deleted_at IS NULL`,
        [projectId]
      );
      return result.rows[0] || null;
    },
    CacheTTL.project
  );
}

export async function listProjects(userId: string): Promise<SlateProject[]> {
  return getCached(
    CacheKeys.projectList(userId),
    async () => {
      const result = await queryReplica<SlateProject>(
        `SELECT * FROM slate_projects
         WHERE user_id = $1 AND deleted_at IS NULL
         ORDER BY updated_at DESC`,
        [userId]
      );
      return result.rows;
    },
    CacheTTL.projectList
  );
}

export async function updateProject(
  projectId: string,
  updates: SlateProjectUpdate
): Promise<SlateProject> {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }
  if (updates.metadata !== undefined) {
    updateFields.push(`metadata = $${paramIndex++}`);
    values.push(JSON.stringify(updates.metadata));
  }

  if (updateFields.length === 0) {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    return project;
  }

  values.push(projectId);
  const result = await query<SlateProject>(
    `UPDATE slate_projects
     SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  const updated = result.rows[0];

  await invalidateProjectCache(projectId);
  await setCached(CacheKeys.project(projectId), updated, CacheTTL.project);

  await publishProjectEvent({
    type: 'updated',
    projectId: updated.id,
    userId: updated.user_id,
    timestamp: Date.now(),
    data: updated,
  }).catch((err) => console.error('Failed to publish project updated event:', err));

  return updated;
}

export async function deleteProject(projectId: string): Promise<void> {
  const project = await getProject(projectId);

  await query(
    `UPDATE slate_projects SET deleted_at = NOW() WHERE id = $1`,
    [projectId]
  );

  await invalidateProjectCache(projectId);

  if (project) {
    await publishProjectEvent({
      type: 'deleted',
      projectId,
      userId: project.user_id,
      timestamp: Date.now(),
    }).catch((err) => console.error('Failed to publish project deleted event:', err));
  }
}
