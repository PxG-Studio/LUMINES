import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows tooltip on hover after delay', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  it('cancels show on quick mouse leave', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    vi.advanceTimersByTime(100);

    fireEvent.mouseLeave(button);

    vi.advanceTimersByTime(400);

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('respects custom delay', async () => {
    render(
      <Tooltip content="Tooltip text" delay={1000}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    vi.advanceTimersByTime(500);
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('positions tooltip correctly', async () => {
    render(
      <Tooltip content="Tooltip text" placement="top">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip text');
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    unmount();

    vi.advanceTimersByTime(500);

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });
});
