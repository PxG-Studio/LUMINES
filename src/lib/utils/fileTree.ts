import type { SlateFile } from '../database/types';

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
