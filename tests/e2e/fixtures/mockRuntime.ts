/**
 * Mock Runtime Fixture
 * 
 * Provides mocked Unity runtime for testing
 */

import { Page } from '@playwright/test';

export async function setupMockRuntime(page: Page) {
  await page.addInitScript(() => {
    // Mock Unity WebGL runtime
    (window as any).unityInstance = {
      SendMessage: (gameObject: string, method: string, ...args: any[]) => {
        console.log('[Mock Unity]', gameObject, method, args);
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('unity-message', {
          detail: { gameObject, method, args },
        }));
      },
    };
    
    // Mock runtime events
    (window as any).WISSIL = {
      ...(window as any).WISSIL,
      runtime: {
        sendEvent: (event: string, payload: any) => {
          console.log('[Runtime]', event, payload);
        },
        onEvent: (callback: Function) => {
          // Simulate events
          setTimeout(() => {
            callback({ type: 'OnStart', payload: {} });
          }, 100);
        },
      },
    };
  });
}

export async function triggerRuntimeEvent(
  page: Page,
  eventType: string,
  payload: any = {}
) {
  await page.evaluate(
    ({ eventType, payload }) => {
      window.dispatchEvent(
        new CustomEvent('runtime-event', {
          detail: { type: eventType, payload },
        })
      );
    },
    { eventType, payload }
  );
}

