import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

vi.mock('../lib/database/client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
  transaction: vi.fn(),
  getPrimaryPool: vi.fn(),
  getReplicaPool: vi.fn(),
}));

vi.mock('../lib/cache/client', () => ({
  getActiveRedisClient: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(() => []),
  })),
}));

vi.mock('../lib/messaging/client', () => ({
  publish: vi.fn(),
  subscribe: vi.fn(),
  getNatsClient: vi.fn(),
}));
