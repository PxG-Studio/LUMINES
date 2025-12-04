import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorHandler } from '../../lib/errors/ErrorHandler';

describe('Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles database errors', async () => {
    const dbError = new Error('Connection timeout');
    dbError.name = 'DatabaseError';

    const result = await ErrorHandler.handleError(dbError);

    expect(result.logged).toBe(true);
    expect(result.message).toContain('database');
  });

  it('handles authentication errors', async () => {
    const authError = new Error('Unauthorized');
    authError.name = 'AuthenticationError';

    const result = await ErrorHandler.handleError(authError);

    expect(result.logged).toBe(true);
    expect(result.message).toContain('auth');
  });

  it('handles validation errors', async () => {
    const validationError = new Error('Invalid input');
    validationError.name = 'ValidationError';

    const result = await ErrorHandler.handleError(validationError);

    expect(result.logged).toBe(true);
    expect(ErrorHandler.isRecoverable(validationError)).toBe(true);
  });

  it('provides user-friendly messages', () => {
    const errors = [
      { error: new Error('ECONNREFUSED'), expected: /connection/i },
      { error: new Error('ETIMEDOUT'), expected: /timeout/i },
      { error: new Error('Not found'), expected: /not found/i },
      { error: new Error('Unauthorized'), expected: /permission/i },
    ];

    errors.forEach(({ error, expected }) => {
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toMatch(expected);
    });
  });

  it('determines recoverability', () => {
    const recoverableErrors = [
      new Error('Validation failed'),
      new Error('Invalid input'),
      new Error('Not found'),
    ];

    const unrecoverableErrors = [
      new Error('FATAL: out of memory'),
      new Error('Database corruption'),
      new Error('Critical system error'),
    ];

    recoverableErrors.forEach((error) => {
      expect(ErrorHandler.isRecoverable(error)).toBe(true);
    });

    unrecoverableErrors.forEach((error) => {
      expect(ErrorHandler.isRecoverable(error)).toBe(false);
    });
  });

  it('logs errors with context', async () => {
    const error = new Error('Test error');
    const context = {
      userId: 'user-1',
      action: 'file-save',
      metadata: { fileId: 'file-1' },
    };

    const result = await ErrorHandler.handleError(error, context);

    expect(result.logged).toBe(true);
  });

  it('handles nested errors', async () => {
    const innerError = new Error('Inner error');
    const outerError = new Error('Outer error');
    (outerError as any).cause = innerError;

    const result = await ErrorHandler.handleError(outerError);

    expect(result.logged).toBe(true);
  });
});
