/**
 * Mock Collaboration Fixture
 * 
 * Provides mocked multi-user collaboration for testing
 */

import { Page } from '@playwright/test';

export interface MockUser {
  id: string;
  name: string;
  cursor: { x: number; y: number };
}

export async function setupMockCollab(page: Page, users: MockUser[] = []) {
  await page.addInitScript(
    ({ users }) => {
      (window as any).WISSIL = {
        ...(window as any).WISSIL,
        collab: {
          users: users,
          myUserId: users[0]?.id || 'user1',
          onUserUpdate: (callback: Function) => {
            // Mock user updates
          },
          sendUpdate: (update: any) => {
            console.log('[Collab]', update);
          },
        },
      };
    },
    { users }
  );
}

export async function simulateUserCursor(
  page: Page,
  userId: string,
  position: { x: number; y: number }
) {
  await page.evaluate(
    ({ userId, position }) => {
      const event = new CustomEvent('collab-cursor-move', {
        detail: { userId, position },
      });
      window.dispatchEvent(event);
    },
    { userId, position }
  );
}

export async function simulateUserAction(
  page: Page,
  userId: string,
  action: string,
  payload: any
) {
  await page.evaluate(
    ({ userId, action, payload }) => {
      const event = new CustomEvent('collab-action', {
        detail: { userId, action, payload },
      });
      window.dispatchEvent(event);
    },
    { userId, action, payload }
  );
}

