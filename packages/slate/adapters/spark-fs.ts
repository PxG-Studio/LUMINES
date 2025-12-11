/**
 * Temporary in-memory SPARK FS adapter.
 * Swap to real SPARK FS service when available.
 */
export class SparkFsAdapter {
  private store = new Map<string, string>();

  async read(path: string): Promise<string | undefined> {
    return this.store.get(path);
  }

  async write(path: string, content: any): Promise<{ ok: boolean }> {
    this.store.set(path, typeof content === 'string' ? content : String(content ?? ''));
    return { ok: true };
  }

  async exists(path: string): Promise<boolean> {
    return this.store.has(path);
  }

  async list(dir: string): Promise<string[]> {
    const prefix = dir.endsWith('/') ? dir : `${dir}/`;
    return Array.from(this.store.keys()).filter((p) => p.startsWith(prefix));
  }
}

export const sparkFsAdapter = new SparkFsAdapter();

