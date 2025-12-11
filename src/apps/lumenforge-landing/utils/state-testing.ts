/**
 * State Testing Utilities
 * EC-LAND-771 to EC-LAND-780: State testing
 */

/**
 * State Testing Manager
 * EC-LAND-771 to EC-LAND-780
 */
export class StateTesting {
  /**
   * Test state transitions
   * EC-LAND-772
   */
  static testTransition<T>(
    initialState: T,
    transitions: Array<{ action: string; update: (state: T) => T; expected?: T }>
  ): { passed: boolean; failures: Array<{ action: string; error: string }> } {
    const failures: Array<{ action: string; error: string }> = [];
    let currentState = initialState;

    transitions.forEach(({ action, update, expected }) => {
      try {
        const newState = update(currentState);

        if (expected && JSON.stringify(newState) !== JSON.stringify(expected)) {
          failures.push({
            action,
            error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(newState)}`,
          });
        }

        currentState = newState;
      } catch (error) {
        failures.push({
          action,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  /**
   * Test state validation
   * EC-LAND-773
   */
  static testValidation<T>(
    state: T,
    validator: (state: T) => boolean
  ): { passed: boolean; error?: string } {
    try {
      const isValid = validator(state);
      return {
        passed: isValid,
        error: isValid ? undefined : 'Validation failed',
      };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Validation error',
      };
    }
  }

  /**
   * Test state persistence
   * EC-LAND-774
   */
  static testPersistence<T>(
    key: string,
    state: T,
    persistFn: (key: string, state: T) => boolean,
    restoreFn: (key: string) => T | null
  ): { passed: boolean; error?: string } {
    try {
      // Persist state
      const persisted = persistFn(key, state);
      if (!persisted) {
        return {
          passed: false,
          error: 'Failed to persist state',
        };
      }

      // Restore state
      const restored = restoreFn(key);
      if (!restored) {
        return {
          passed: false,
          error: 'Failed to restore state',
        };
      }

      // Compare states
      if (JSON.stringify(state) !== JSON.stringify(restored)) {
        return {
          passed: false,
          error: 'Restored state does not match original state',
        };
      }

      return { passed: true };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Persistence error',
      };
    }
  }

  /**
   * Test state synchronization
   * EC-LAND-775
   */
  static testSynchronization<T>(
    localState: T,
    remoteState: T,
    syncFn: (local: T, remote: T) => T
  ): { passed: boolean; error?: string; syncedState?: T } {
    try {
      const syncedState = syncFn(localState, remoteState);
      return {
        passed: true,
        syncedState,
      };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Synchronization error',
      };
    }
  }

  /**
   * Test state cleanup
   * EC-LAND-776
   */
  static testCleanup(
    cleanupFn: () => void
  ): { passed: boolean; error?: string } {
    try {
      cleanupFn();
      return { passed: true };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Cleanup error',
      };
    }
  }

  /**
   * Test state performance
   * EC-LAND-777
   */
  static testPerformance<T>(
    stateFn: () => T,
    iterations: number = 1000
  ): { passed: boolean; averageTime: number; error?: string } {
    try {
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        stateFn();
        const end = performance.now();
        times.push(end - start);
      }

      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const passed = averageTime < 10; // 10ms threshold

      return {
        passed,
        averageTime,
        error: passed ? undefined : `Average time ${averageTime}ms exceeds threshold`,
      };
    } catch (error) {
      return {
        passed: false,
        averageTime: 0,
        error: error instanceof Error ? error.message : 'Performance test error',
      };
    }
  }

  /**
   * Test state edge cases
   * EC-LAND-778
   */
  static testEdgeCases<T>(
    stateFn: (input: any) => T,
    edgeCases: Array<{ input: any; expected?: T; shouldThrow?: boolean }>
  ): { passed: boolean; failures: Array<{ input: any; error: string }> } {
    const failures: Array<{ input: any; error: string }> = [];

    edgeCases.forEach(({ input, expected, shouldThrow }) => {
      try {
        const result = stateFn(input);

        if (shouldThrow) {
          failures.push({
            input,
            error: 'Expected error but got result',
          });
        } else if (expected && JSON.stringify(result) !== JSON.stringify(expected)) {
          failures.push({
            input,
            error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`,
          });
        }
      } catch (error) {
        if (!shouldThrow) {
          failures.push({
            input,
            error: error instanceof Error ? error.message : 'Unexpected error',
          });
        }
      }
    });

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  /**
   * Test state recovery
   * EC-LAND-779
   */
  static testRecovery<T>(
    corruptedState: T,
    recoveryFn: (state: T) => T,
    validator: (state: T) => boolean
  ): { passed: boolean; recoveredState?: T; error?: string } {
    try {
      const recoveredState = recoveryFn(corruptedState);
      const isValid = validator(recoveredState);

      return {
        passed: isValid,
        recoveredState,
        error: isValid ? undefined : 'Recovered state is invalid',
      };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : 'Recovery error',
      };
    }
  }

  /**
   * Test state workflows
   * EC-LAND-780
   */
  static testWorkflow<T>(
    initialState: T,
    workflow: Array<{ step: string; action: (state: T) => T; validator?: (state: T) => boolean }>
  ): { passed: boolean; failures: Array<{ step: string; error: string }> } {
    const failures: Array<{ step: string; error: string }> = [];
    let currentState = initialState;

    workflow.forEach(({ step, action, validator }) => {
      try {
        currentState = action(currentState);

        if (validator && !validator(currentState)) {
          failures.push({
            step,
            error: 'State validation failed',
          });
        }
      } catch (error) {
        failures.push({
          step,
          error: error instanceof Error ? error.message : 'Workflow error',
        });
      }
    });

    return {
      passed: failures.length === 0,
      failures,
    };
  }
}

