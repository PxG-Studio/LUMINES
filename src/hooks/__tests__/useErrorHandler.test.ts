import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';

const mockHandleError = vi.fn();
const mockGetUserMessage = vi.fn();

vi.mock('../../lib/errors/ErrorHandler', () => ({
  ErrorHandler: {
    handleError: mockHandleError,
    getUserMessage: mockGetUserMessage,
    isRecoverable: vi.fn(() => false),
  },
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMessage.mockReturnValue('Error occurred');
  });

  it('initializes with empty toasts', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.toasts).toEqual([]);
  });

  it('shows error toast on showError', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    await act(async () => {
      await result.current.showError(error);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error occurred');
    expect(mockHandleError).toHaveBeenCalledWith(error);
  });

  it('shows success toast', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showSuccess('Operation successful');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Operation successful');
  });

  it('shows warning toast', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showWarning('Warning message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('warning');
    expect(result.current.toasts[0].message).toBe('Warning message');
  });

  it('dismisses toast by id', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showSuccess('Test 1');
      result.current.showSuccess('Test 2');
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      result.current.dismissToast(result.current.toasts[0].id);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test 2');
  });

  it('handles multiple toasts', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showError(new Error('Error 1'));
      result.current.showSuccess('Success 1');
      result.current.showWarning('Warning 1');
    });

    expect(result.current.toasts).toHaveLength(3);
  });

  it('generates unique toast ids', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showSuccess('Test 1');
      result.current.showSuccess('Test 2');
    });

    const ids = result.current.toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('includes timestamp in toasts', () => {
    const { result } = renderHook(() => useErrorHandler());
    const before = Date.now();

    act(() => {
      result.current.showSuccess('Test');
    });

    const after = Date.now();
    const timestamp = result.current.toasts[0].timestamp;

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});
