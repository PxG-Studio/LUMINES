import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders error toast', () => {
    const toast = {
      id: '1',
      type: 'error' as const,
      message: 'Error message',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={vi.fn()} />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders success toast', () => {
    const toast = {
      id: '2',
      type: 'success' as const,
      message: 'Success message',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={vi.fn()} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders warning toast', () => {
    const toast = {
      id: '3',
      type: 'warning' as const,
      message: 'Warning message',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={vi.fn()} />);

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('calls onDismiss when close button clicked', () => {
    const onDismiss = vi.fn();
    const toast = {
      id: '4',
      type: 'error' as const,
      message: 'Test',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onDismiss).toHaveBeenCalledWith('4');
  });

  it('auto-dismisses after duration', async () => {
    const onDismiss = vi.fn();
    const toast = {
      id: '5',
      type: 'success' as const,
      message: 'Auto dismiss',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={onDismiss} duration={3000} />);

    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledWith('5');
    });
  });

  it('does not auto-dismiss when duration is null', async () => {
    const onDismiss = vi.fn();
    const toast = {
      id: '6',
      type: 'error' as const,
      message: 'No auto dismiss',
      timestamp: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={onDismiss} duration={null} />);

    vi.advanceTimersByTime(10000);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('clears timeout when unmounted', () => {
    const onDismiss = vi.fn();
    const toast = {
      id: '7',
      type: 'success' as const,
      message: 'Test',
      timestamp: Date.now(),
    };

    const { unmount } = render(<Toast toast={toast} onDismiss={onDismiss} duration={3000} />);

    unmount();
    vi.advanceTimersByTime(3000);

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
