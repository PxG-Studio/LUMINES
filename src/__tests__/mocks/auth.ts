import { vi } from 'vitest';

export const mockRequireAuth = vi.fn();
export const mockRequireProjectAccess = vi.fn();
export const mockValidateToken = vi.fn();

vi.mock('../../lib/auth/middleware', () => ({
  requireAuth: mockRequireAuth,
  requireProjectAccess: mockRequireProjectAccess,
  validateToken: mockValidateToken,
}));

export const mockAuthUser = {
  userId: 'test-user-id',
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
};

export const resetAuthMocks = () => {
  mockRequireAuth.mockReset();
  mockRequireProjectAccess.mockReset();
  mockValidateToken.mockReset();
};
