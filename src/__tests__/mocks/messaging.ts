import { vi } from 'vitest';

export const mockPublish = vi.fn();
export const mockSubscribe = vi.fn();
export const mockUnsubscribe = vi.fn();

vi.mock('../../lib/messaging/client', () => ({
  getNatsClient: () => ({
    publish: mockPublish,
    subscribe: mockSubscribe,
    request: vi.fn(),
    close: vi.fn(),
  }),
  initializeNats: vi.fn(),
}));

export const resetMessagingMocks = () => {
  mockPublish.mockReset();
  mockSubscribe.mockReset();
  mockUnsubscribe.mockReset();
};
