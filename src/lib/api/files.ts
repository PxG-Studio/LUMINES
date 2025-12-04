import { query, queryReplica, transaction } from '../database/client';
import { getCached, invalidateCache } from '../cache/strategies';
import { CacheKeys, CacheTTL } from '../cache/keys';
import { publish } from '../messaging/client';
import { requireAuth } from '../auth/middleware';
import { NotFoundError, ValidationError } from '../errors/ErrorHandler';

export interface SlateFile {
  id: string;
  project_id: string;
  path: string;
  content: string | null;
  type: string | null;
  size: number;
  version: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  user_id?: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  file?: SlateFile;
}

function buildFileTree(files: SlateFile[]): FileTreeNode[] {
  const tree: FileTreeNode[] = [];
  const nodeMap = new Map<string, FileTreeNode>();

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!nodeMap.has(currentPath)) {
        const node: FileTreeNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          file: isFile ? file : undefined,
        };

        nodeMap.set(currentPath, node);

        if (index === 0) {
          tree.push(node);
        } else {
          const parentPath = parts.slice(0, index).join('/');
          const parent = nodeMap.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        }
      }
    });
  });

  return tree;
}

export async function getFileTree(projectId: string): Promise<FileTreeNode[]> {
  const auth = await requireAuth();
  const cacheKey = CacheKeys.projectFiles(projectId);

  return getCached<FileTreeNode[]>(
    cacheKey,
    async () => {
      const result = await queryReplica<SlateFile>(
        `SELECT * FROM slate_files
         WHERE project_id = $1 AND deleted_at IS NULL
         ORDER BY path`,
        [projectId]
      );
      return buildFileTree(result.rows);
    },
    CacheTTL.projectFiles
  );
}

export async function getFile(fileId: string): Promise<SlateFile> {
  const auth = await requireAuth();
  const cacheKey = CacheKeys.file(fileId);

  return getCached<SlateFile>(
    cacheKey,
    async () => {
      const result = await queryReplica<SlateFile>(
        `SELECT * FROM slate_files WHERE id = $1 AND deleted_at IS NULL`,
        [fileId]
      );
      if (result.rows.length === 0) throw new NotFoundError('File');
      return result.rows[0];
    },
    CacheTTL.file
  );
}

export async function saveFile(projectId: string, path: string, content: string, type?: string): Promise<SlateFile> {
  const auth = await requireAuth();
  if (!path || path.trim() === '') throw new ValidationError('File path is required', 'path');

  return transaction(async (client) => {
    const existing = await client.query<SlateFile>(
      `SELECT * FROM slate_files WHERE project_id = $1 AND path = $2 AND deleted_at IS NULL`,
      [projectId, path]
    );

    let file: SlateFile;
    if (existing.rows.length > 0) {
      const result = await client.query<SlateFile>(
        `UPDATE slate_files SET content = $1, type = $2, version = version + 1, size = $3, updated_at = NOW(), user_id = $4
         WHERE id = $5 RETURNING *`,
        [content, type || existing.rows[0].type, Buffer.byteLength(content, 'utf8'), auth.userId, existing.rows[0].id]
      );
      file = result.rows[0];
    } else {
      const result = await client.query<SlateFile>(
        `INSERT INTO slate_files (project_id, path, content, type, size, user_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [projectId, path, content, type || getFileTypeFromPath(path), Buffer.byteLength(content, 'utf8'), auth.userId]
      );
      file = result.rows[0];
    }

    await invalidateCache(CacheKeys.projectFiles(projectId));
    await publish('slate.file.saved', { fileId: file.id, projectId, path, userId: auth.userId, timestamp: new Date().toISOString() });
    return file;
  });
}

function getFileTypeFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    cs: 'csharp', shader: 'shader', txt: 'text', json: 'json', yaml: 'yaml', yml: 'yaml',
    xml: 'xml', md: 'markdown', prefab: 'prefab', unity: 'unity', asset: 'asset',
    mat: 'material', anim: 'animation', controller: 'animator',
  };
  return typeMap[ext || ''] || 'unknown';
}
