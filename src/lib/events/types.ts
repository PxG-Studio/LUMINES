/**
 * Event Bus Types
 */

export interface EventBus {
  publish: (subject: string, data: any) => Promise<void>;
  subscribe: (subject: string, handler: (data: any) => void) => Promise<void>;
  close: () => Promise<void>;
}

