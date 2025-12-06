/**
 * Undo/Rollback System for Unity MCP Patches
 *
 * Maintains a local stack of applied patches for one-tap revert
 */

interface PatchOperation {
  id: string;
  timestamp: number;
  type: "generate_script" | "apply_patch" | "modify_asset";
  path: string;
  before?: string;
  after?: string;
  patch?: string;
  metadata?: Record<string, any>;
}

class PatchStack {
  private stack: PatchOperation[] = [];
  private maxSize: number;
  private sessionId: string;

  constructor(sessionId: string, maxSize = 50) {
    this.sessionId = sessionId;
    this.maxSize = maxSize;
    this.loadFromStorage();
  }

  /**
   * Push a new patch operation onto the stack
   */
  push(op: Omit<PatchOperation, "id" | "timestamp">): string {
    const id = `patch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const operation: PatchOperation = {
      ...op,
      id,
      timestamp: Date.now(),
    };

    this.stack.push(operation);

    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }

    this.saveToStorage();
    return id;
  }

  /**
   * Pop the most recent patch operation
   */
  pop(): PatchOperation | null {
    const op = this.stack.pop();
    if (op) {
      this.saveToStorage();
    }
    return op || null;
  }

  /**
   * Peek at the most recent operation without removing it
   */
  peek(): PatchOperation | null {
    return this.stack[this.stack.length - 1] || null;
  }

  /**
   * Get all operations
   */
  getAll(): PatchOperation[] {
    return [...this.stack];
  }

  /**
   * Get operation by ID
   */
  getById(id: string): PatchOperation | null {
    return this.stack.find((op) => op.id === id) || null;
  }

  /**
   * Rollback to a specific operation (removes all after it)
   */
  rollbackTo(id: string): PatchOperation[] {
    const idx = this.stack.findIndex((op) => op.id === id);
    if (idx < 0) return [];

    const removed = this.stack.splice(idx + 1);
    this.saveToStorage();
    return removed;
  }

  /**
   * Clear the entire stack
   */
  clear(): void {
    this.stack = [];
    this.saveToStorage();
  }

  /**
   * Get stack size
   */
  size(): number {
    return this.stack.length;
  }

  /**
   * Check if stack is empty
   */
  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  /**
   * Get operations by path
   */
  getByPath(path: string): PatchOperation[] {
    return this.stack.filter((op) => op.path === path);
  }

  /**
   * Get operations within time range
   */
  getByTimeRange(startMs: number, endMs: number): PatchOperation[] {
    return this.stack.filter(
      (op) => op.timestamp >= startMs && op.timestamp <= endMs
    );
  }

  /**
   * Save stack to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const key = `patch-stack-${this.sessionId}`;
      localStorage.setItem(key, JSON.stringify(this.stack));
    } catch (error) {
      console.error("Failed to save patch stack:", error);
    }
  }

  /**
   * Load stack from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const key = `patch-stack-${this.sessionId}`;
      const data = localStorage.getItem(key);
      if (data) {
        this.stack = JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to load patch stack:", error);
      this.stack = [];
    }
  }

  /**
   * Export stack as JSON
   */
  exportJson(): string {
    return JSON.stringify(this.stack, null, 2);
  }

  /**
   * Import stack from JSON
   */
  importJson(json: string): void {
    try {
      const ops = JSON.parse(json);
      if (Array.isArray(ops)) {
        this.stack = ops;
        this.saveToStorage();
      }
    } catch (error) {
      console.error("Failed to import patch stack:", error);
    }
  }
}

const stacks = new Map<string, PatchStack>();

export function getPatchStack(sessionId: string): PatchStack {
  if (!stacks.has(sessionId)) {
    stacks.set(sessionId, new PatchStack(sessionId));
  }
  return stacks.get(sessionId)!;
}

export function clearPatchStack(sessionId: string): void {
  const stack = stacks.get(sessionId);
  if (stack) {
    stack.clear();
  }
  stacks.delete(sessionId);
}
