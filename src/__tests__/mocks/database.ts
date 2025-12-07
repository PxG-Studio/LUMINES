import { vi } from 'vitest';

export const mockQuery = vi.fn();
export const mockQueryReplica = vi.fn();
export const mockTransaction = vi.fn();

export const mockPool = {
  query: mockQuery,
  connect: vi.fn(),
  end: vi.fn(),
};

export const mockReplicaPool = {
  query: mockQueryReplica,
  connect: vi.fn(),
  end: vi.fn(),
};

export const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

vi.mock('../../lib/database/client', () => ({
  query: mockQuery,
  queryReplica: mockQueryReplica,
  transaction: mockTransaction,
  getPool: () => mockPool,
  getReplicaPool: () => mockReplicaPool,
}));

export const resetDatabaseMocks = () => {
  mockQuery.mockReset();
  mockQueryReplica.mockReset();
  mockTransaction.mockReset();
  mockClient.query.mockReset();
  mockClient.release.mockReset();
};
