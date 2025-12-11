import { query, queryReplica, transaction } from '../client';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../types';

export async function createFile(file: SlateFileInsert): Promise<SlateFile> {
  const size = file.content ? Buffer.byteLength(file.content, 'utf8') : 0;

  const result = await query<SlateFile>(
    `INSERT INTO slate_files (project_id, path, content, type, size, encoding)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      file.project_id,
      file.path,
      file.content || null,
      file.type || null,
      size,
      file.encoding || 'utf-8',
    ]
  );

  return result.rows[0];
}

export async function getFile(fileId: string): Promise<SlateFile | null> {
  const result = await query<SlateFile>(
    `SELECT * FROM slate_files WHERE id = $1 AND deleted_at IS NULL`,
    [fileId]
  );

  return result.rows[0] || null;
}

export async function getFileByPath(
  projectId: string,
  path: string
): Promise<SlateFile | null> {
  const result = await query<SlateFile>(
    `SELECT * FROM slate_files
     WHERE project_id = $1 AND path = $2 AND deleted_at IS NULL`,
    [projectId, path]
  );

  return result.rows[0] || null;
}

export async function listFiles(projectId: string): Promise<SlateFile[]> {
  const result = await queryReplica<SlateFile>(
    `SELECT * FROM slate_files
     WHERE project_id = $1 AND deleted_at IS NULL
     ORDER BY path ASC`,
    [projectId]
  );

  return result.rows;
}

export async function updateFile(
  fileId: string,
  updates: SlateFileUpdate
): Promise<SlateFile> {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.content !== undefined) {
    updateFields.push(`content = $${paramIndex++}`);
    values.push(updates.content);
    updateFields.push(`version = version + 1`);
    updateFields.push(`size = $${paramIndex++}`);
    values.push(Buffer.byteLength(updates.content, 'utf8'));
  }
  if (updates.path !== undefined) {
    updateFields.push(`path = $${paramIndex++}`);
    values.push(updates.path);
  }
  if (updates.type !== undefined) {
    updateFields.push(`type = $${paramIndex++}`);
    values.push(updates.type);
  }

  if (updateFields.length === 0) {
    const file = await getFile(fileId);
    if (!file) throw new Error('File not found');
    return file;
  }

  values.push(fileId);
  const result = await query<SlateFile>(
    `UPDATE slate_files
     SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  return result.rows[0];
}

export async function deleteFile(fileId: string): Promise<void> {
  await query(
    `UPDATE slate_files SET deleted_at = NOW() WHERE id = $1`,
    [fileId]
  );
}

export async function searchFiles(
  projectId: string,
  searchQuery: string
): Promise<SlateFile[]> {
  const result = await queryReplica<SlateFile>(
    `SELECT * FROM slate_files
     WHERE project_id = $1
       AND deleted_at IS NULL
       AND (
         path ILIKE $2
         OR content ILIKE $2
       )
     ORDER BY path ASC`,
    [projectId, `%${searchQuery}%`]
  );

  return result.rows;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  fileData?: SlateFile;
}

export function buildFileTree(files: SlateFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const folderMap = new Map<string, FileTreeNode>();

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentPath = '';
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (isFile) {
        currentLevel.push({
          id: file.id,
          name: part,
          path: currentPath,
          type: 'file',
          fileData: file,
        });
      } else {
        let folder = folderMap.get(currentPath);
        if (!folder) {
          folder = {
            id: `folder-${currentPath}`,
            name: part,
            path: currentPath,
            type: 'folder',
            children: [],
          };
          folderMap.set(currentPath, folder);
          currentLevel.push(folder);
        }
        currentLevel = folder.children!;
      }
    });
  });

  return root;
}
