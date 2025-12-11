/*
 * Deterministic BuildDB + CacheKeys mock for SLATE test suites.
 * Tests expect CacheKeys.* to be functions, not string enums.
 */

export const CacheKeys = {
  build: (id: string | number) => `build:${id}`,
  meta: (id: string | number) => `meta:${id}`,
  snapshot: (key: string) => `snap:${key}`,
};

export class BuildDbMock {
  private store = new Map<string, any>();

  /**
   * Sets a value in the DB using a deterministic string key.
   */
  set(key: string, value: any) {
    this.store.set(key, value);
    return { ok: true, written: true };
  }

  /**
   * Gets a value or returns default.
   */
  get(key: string) {
    return this.store.get(key) ?? null;
  }

  /**
   * Reads build bytecode.
   */
  getBuild(id: string | number) {
    return this.get(CacheKeys.build(id));
  }

  /**
   * Stores build bytecode.
   */
  setBuild(id: string | number, value: any) {
    return this.set(CacheKeys.build(id), value);
  }

  /**
   * Reads metadata.
   */
  getMeta(id: string | number) {
    return this.get(CacheKeys.meta(id));
  }

  /**
   * Writes metadata.
   */
  setMeta(id: string | number, value: any) {
    return this.set(CacheKeys.meta(id), value);
  }

  /**
   * Snapshot behavior used in integration tests.
   */
  snapshot(key: string, value: any) {
    return this.set(CacheKeys.snapshot(key), value);
  }

  getSnapshot(key: string) {
    return this.get(CacheKeys.snapshot(key));
  }
}

export const buildDbMock = new BuildDbMock();

