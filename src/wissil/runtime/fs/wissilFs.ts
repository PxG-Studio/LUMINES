/**
 * Minimal in-memory WissilFS stub for tests.
 * Provides a tiny writable/readable virtual FS with snapshot/hydrate helpers.
 */

type SnapshotNode = {
  type: 'folder' | 'file';
  name: string;
  children?: SnapshotNode[];
  content?: string;
};

class InMemoryFS {
  private files = new Map<string, string>();
  private folders = new Set<string>(['']);

  private normalize(path: string): string {
    return path.replace(/^\/+/, '');
  }

  writeFile(path: string, content: string) {
    const clean = this.normalize(path);
    const parts = clean.split('/');
    // track folders
    let current = '';
    for (let i = 0; i < parts.length - 1; i++) {
      current = current ? `${current}/${parts[i]}` : parts[i];
      this.folders.add(current);
    }
    this.files.set(clean, content);
  }

  readFile(path: string): string | null {
    const clean = this.normalize(path);
    return this.files.has(clean) ? this.files.get(clean)! : null;
  }

  exists(path: string): boolean {
    const clean = this.normalize(path);
    return this.files.has(clean) || this.folders.has(clean);
  }

  deleteFile(path: string) {
    const clean = this.normalize(path);
    this.files.delete(clean);
  }

  deleteFolder(path: string) {
    const clean = this.normalize(path);
    // remove files inside folder
    for (const key of Array.from(this.files.keys())) {
      if (key === clean || key.startsWith(`${clean}/`)) {
        this.files.delete(key);
      }
    }
    for (const dir of Array.from(this.folders.values())) {
      if (dir === clean || dir.startsWith(`${clean}/`)) {
        this.folders.delete(dir);
      }
    }
  }

  clear() {
    this.files.clear();
    this.folders = new Set<string>(['']);
  }

  getSnapshot(): SnapshotNode {
    const root: SnapshotNode = { type: 'folder', name: '', children: [] };
    for (const [path, content] of this.files.entries()) {
      const parts = path.split('/');
      let node = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          node.children = node.children || [];
          node.children.push({ type: 'file', name: part, content });
        } else {
          node.children = node.children || [];
          let next = node.children.find((c) => c.type === 'folder' && c.name === part);
          if (!next) {
            next = { type: 'folder', name: part, children: [] };
            node.children.push(next);
          }
          node = next;
        }
      }
    }
    return root;
  }

  hydrate(snapshot: SnapshotNode) {
    this.clear();
    const walk = (node: SnapshotNode, prefix: string) => {
      if (node.type === 'file') {
        this.writeFile(prefix ? `${prefix}/${node.name}` : node.name, node.content || '');
        return;
      }
      const nextPrefix = node.name ? (prefix ? `${prefix}/${node.name}` : node.name) : prefix;
      if (node.children) {
        for (const child of node.children) {
          walk(child, nextPrefix);
        }
      }
    };
    walk(snapshot, '');
  }
}

const fsInstance = new InMemoryFS();

export const useWissilFS = {
  getState: () => fsInstance,
};

export type WissilFSState = ReturnType<typeof useWissilFS.getState>;

