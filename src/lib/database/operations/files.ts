import { supabase } from '../client';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../types';

export async function createFile(file: SlateFileInsert): Promise<SlateFile> {
  const { data, error } = await supabase
    .from('slate_files')
    .insert(file)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFile(fileId: string): Promise<SlateFile | null> {
  const { data, error } = await supabase
    .from('slate_files')
    .select('*')
    .eq('id', fileId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFileByPath(
  projectId: string,
  path: string
): Promise<SlateFile | null> {
  const { data, error } = await supabase
    .from('slate_files')
    .select('*')
    .eq('project_id', projectId)
    .eq('path', path)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listFiles(projectId: string): Promise<SlateFile[]> {
  const { data, error } = await supabase
    .from('slate_files')
    .select('*')
    .eq('project_id', projectId)
    .order('path', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateFile(
  fileId: string,
  updates: SlateFileUpdate
): Promise<SlateFile> {
  const versionedUpdates = {
    ...updates,
    version: updates.content !== undefined ? (updates.version || 1) + 1 : updates.version,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('slate_files')
    .update(versionedUpdates)
    .eq('id', fileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFile(fileId: string): Promise<void> {
  const { error } = await supabase
    .from('slate_files')
    .delete()
    .eq('id', fileId);

  if (error) throw error;
}

export async function searchFiles(
  projectId: string,
  query: string
): Promise<SlateFile[]> {
  const { data, error } = await supabase
    .from('slate_files')
    .select('*')
    .eq('project_id', projectId)
    .or(`path.ilike.%${query}%,content.ilike.%${query}%`)
    .order('path', { ascending: true });

  if (error) throw error;
  return data || [];
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
