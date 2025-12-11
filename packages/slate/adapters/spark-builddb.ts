/**
 * Temporary in-memory Build DB adapter until real SPARK build ops are wired.
 */
export class SparkBuildDbAdapter {
  private store = new Map<string | number, any>();

  async get(id: string | number): Promise<any> {
    return this.store.get(id) ?? null;
  }

  async set(id: string | number, value: any): Promise<{ ok: boolean }> {
    this.store.set(id, value);
    return { ok: true };
  }

  async list(_projectId: string): Promise<any[]> {
    return Array.from(this.store.values());
  }
}

export const sparkBuildDbAdapter = new SparkBuildDbAdapter();

