/**
 * Zustand DevTools Integration
 * Enable Redux DevTools for Zustand stores in development
 */

import { StateCreator, StoreMutatorIdentifier } from 'zustand';

export interface DevtoolsOptions {
  name: string;
  enabled?: boolean;
  anonymousActionType?: string;
  trace?: boolean;
  traceLimit?: number;
}

/**
 * Create a devtools middleware for Zustand
 * Integrates with Redux DevTools Extension
 */
export function createDevtools<T>(
  options: DevtoolsOptions
) {
  return (config: StateCreator<T>): StateCreator<T> => (set, get, api) => {
    const { name, enabled = process.env.NODE_ENV === 'development' } = options;

    if (!enabled || typeof window === 'undefined') {
      return config(set, get, api);
    }

    // Check if Redux DevTools Extension is available
    const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    
    if (!devtools) {
      console.warn('Redux DevTools Extension not found');
      return config(set, get, api);
    }

    // Connect to devtools
    const devtoolsConnection = devtools.connect({
      name,
      features: {
        pause: true,
        export: true,
        import: 'custom',
        jump: true,
        skip: true,
        reorder: true,
        dispatch: true,
        test: true,
      },
    });

    // Send initial state
    devtoolsConnection.init(get());

    // Wrap set to send actions to devtools
    const devtoolsSet: typeof set = (...args) => {
      const prevState = get();
      set(...args);
      const nextState = get();

      // Determine action type
      let actionType = options.anonymousActionType || 'setState';
      
      // Try to extract action name from args
      if (typeof args[0] === 'function') {
        const fnString = args[0].toString();
        const match = fnString.match(/\w+:/);
        if (match) {
          actionType = match[0].slice(0, -1);
        }
      }

      // Send to devtools
      devtoolsConnection.send(
        { type: actionType },
        nextState
      );
    };

    // Listen to devtools actions (time travel, import, etc.)
    devtoolsConnection.subscribe((message: any) => {
      if (message.type === 'DISPATCH') {
        switch (message.payload.type) {
          case 'JUMP_TO_STATE':
          case 'JUMP_TO_ACTION':
            set(JSON.parse(message.state));
            break;
          case 'IMPORT_STATE':
            const { nextLiftedState } = message.payload;
            const { computedStates } = nextLiftedState;
            const lastState = computedStates[computedStates.length - 1].state;
            set(lastState);
            devtoolsConnection.init(lastState);
            break;
        }
      }
    });

    return config(devtoolsSet, get, api);
  };
}

/**
 * Log state changes to console (development helper)
 */
export function createLogger<T>(name: string) {
  return (config: StateCreator<T>): StateCreator<T> => (set, get, api) => {
    if (process.env.NODE_ENV !== 'development') {
      return config(set, get, api);
    }

    const loggerSet: typeof set = (...args) => {
      const prevState = get();
      console.group(`🔄 [${name}] State Update`);
      console.log('Prev:', prevState);
      
      set(...args);
      
      const nextState = get();
      console.log('Next:', nextState);
      console.groupEnd();
    };

    return config(loggerSet, get, api);
  };
}
