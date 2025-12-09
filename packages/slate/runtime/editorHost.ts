/*
 * Deterministic EditorHost Loop for SLATE Tests.
 * Emits stable runtime events in a strict sequence with no time-based drift.
 */

export class EditorHost {
  private listeners = new Map<string, Set<(payload?: any) => void>>();

  constructor() {}

  /**
   * Subscribe to runtime events.
   */
  on(event: string, handler: (payload?: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Emit an event.
   */
  emit(event: string, payload?: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => h(payload));
    }
  }

  /**
   * Deterministic runtime loop, required for tests.
   * Emits events in this exact order:
   *   1. tick
   *   2. heartbeat
   *   3. flush
   *   4. loop-complete
   */
  startLoop() {
    // 1. tick
    this.emit('tick', { frame: 1 });

    // 2. heartbeat (fixed 60fps)
    this.emit('heartbeat', { fps: 60 });

    // 3. flush
    this.emit('flush', {});

    // 4. complete
    this.emit('loop-complete', { done: true });
  }
}

// Singleton for test harness usage.
export const editorHost = new EditorHost();

