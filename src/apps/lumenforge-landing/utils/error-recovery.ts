/**
 * Error Recovery Utilities
 * EC-198, EC-199, EC-200: Error recovery strategies
 */
export interface RecoveryStrategy {
  name: string;
  attempt: () => Promise<boolean>;
  maxAttempts?: number;
}

export class ErrorRecovery {
  private strategies: RecoveryStrategy[] = [];

  addStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy);
  }

  async recover(_error: Error): Promise<boolean> {
    for (const strategy of this.strategies) {
      try {
        const success = await strategy.attempt();
        if (success) {
          console.log(`Recovery strategy "${strategy.name}" succeeded`);
          return true;
        }
      } catch (e) {
        console.warn(`Recovery strategy "${strategy.name}" failed:`, e);
      }
    }
    return false;
  }

  clearStrategies(): void {
    this.strategies = [];
  }
}

export const errorRecovery = new ErrorRecovery();

// Common recovery strategies
export const commonRecoveryStrategies = {
  reloadPage: (): RecoveryStrategy => ({
    name: 'reload_page',
    attempt: async () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
        return true;
      }
      return false;
    },
  }),

  clearCache: (): RecoveryStrategy => ({
    name: 'clear_cache',
    attempt: async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        return true;
      }
      return false;
    },
  }),

  retryRequest: (fn: () => Promise<any>, maxAttempts = 3): RecoveryStrategy => ({
    name: 'retry_request',
    attempt: async () => {
      for (let i = 0; i < maxAttempts; i++) {
        try {
          await fn();
          return true;
        } catch (e) {
          if (i === maxAttempts - 1) throw e;
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
      return false;
    },
    maxAttempts,
  }),
};

