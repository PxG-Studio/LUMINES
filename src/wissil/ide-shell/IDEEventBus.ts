/**
 * IDE Event Bus
 * 
 * Enables cross-subsystem communication within the IDE
 * Similar to Unity's event system or VSCode's event emitter
 */

class IDEEventBus {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  once(event: string, callback: Function) {
    const wrapper = (data?: any) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  clear(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const ideEventBus = new IDEEventBus();

// Example usage:
// ideEventBus.on('sceneGraph:select', (node) => {
//   ideEventBus.emit('inspector:inspect', node);
//   ideEventBus.emit('blueprint:navigate', node.blueprintTag);
//   ideEventBus.emit('unity:select', node.id);
// });

