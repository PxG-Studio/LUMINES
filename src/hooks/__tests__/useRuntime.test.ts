import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRuntime } from '../useRuntime';

const mockCreateSession = vi.fn();
const mockStopSession = vi.fn();
const mockGetSession = vi.fn();
const mockAddLog = vi.fn();

vi.mock('../../lib/runtime/client', () => ({
  createSession: mockCreateSession,
  stopSession: mockStopSession,
  getSession: mockGetSession,
  addLog: mockAddLog,
}));

describe('useRuntime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no active session', () => {
    const { result } = renderHook(() => useRuntime('project-1'));

    expect(result.current.session).toBeNull();
    expect(result.current.isRunning).toBe(false);
  });

  it('starts runtime session', async () => {
    const mockSession = {
      id: 'session-1',
      project_id: 'project-1',
      status: 'running',
      logs: [],
    };
    mockCreateSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useRuntime('project-1'));

    await act(async () => {
      await result.current.startSession();
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.isRunning).toBe(true);
    expect(mockCreateSession).toHaveBeenCalledWith('project-1', expect.any(String));
  });

  it('stops runtime session', async () => {
    const mockSession = { id: 'session-1', project_id: 'project-1', status: 'running', logs: [] };
    mockCreateSession.mockResolvedValue(mockSession);
    mockStopSession.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRuntime('project-1'));

    await act(async () => {
      await result.current.startSession();
    });

    expect(result.current.isRunning).toBe(true);

    await act(async () => {
      await result.current.stopSession();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.session).toBeNull();
    expect(mockStopSession).toHaveBeenCalledWith('session-1');
  });

  it('handles session start error', async () => {
    const error = new Error('Failed to start session');
    mockCreateSession.mockRejectedValue(error);

    const { result } = renderHook(() => useRuntime('project-1'));

    await expect(
      act(async () => {
        await result.current.startSession();
      })
    ).rejects.toThrow('Failed to start session');

    expect(result.current.isRunning).toBe(false);
  });

  it('adds log to session', async () => {
    const mockSession = { id: 'session-1', project_id: 'project-1', status: 'running', logs: [] };
    mockCreateSession.mockResolvedValue(mockSession);
    mockAddLog.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRuntime('project-1'));

    await act(async () => {
      await result.current.startSession();
    });

    await act(async () => {
      await result.current.addLog('Test log', 'info');
    });

    expect(mockAddLog).toHaveBeenCalledWith('session-1', 'Test log', 'info');
  });

  it('prevents adding log when no session active', async () => {
    const { result } = renderHook(() => useRuntime('project-1'));

    await expect(
      act(async () => {
        await result.current.addLog('Test log', 'info');
      })
    ).rejects.toThrow();
  });

  it('refreshes session status', async () => {
    const mockSession = { id: 'session-1', project_id: 'project-1', status: 'running', logs: [] };
    const updatedSession = { ...mockSession, logs: [{ message: 'New log', level: 'info' }] };

    mockCreateSession.mockResolvedValue(mockSession);
    mockGetSession.mockResolvedValue(updatedSession);

    const { result } = renderHook(() => useRuntime('project-1'));

    await act(async () => {
      await result.current.startSession();
    });

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(mockGetSession).toHaveBeenCalledWith('session-1');
    expect(result.current.session?.logs.length).toBe(1);
  });

  it('cleans up session on unmount', async () => {
    const mockSession = { id: 'session-1', project_id: 'project-1', status: 'running', logs: [] };
    mockCreateSession.mockResolvedValue(mockSession);
    mockStopSession.mockResolvedValue(undefined);

    const { result, unmount } = renderHook(() => useRuntime('project-1'));

    await act(async () => {
      await result.current.startSession();
    });

    unmount();

    expect(mockStopSession).toHaveBeenCalledWith('session-1');
  });
});
