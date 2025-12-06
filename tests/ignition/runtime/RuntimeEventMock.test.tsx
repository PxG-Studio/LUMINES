/**
 * RuntimeEventMock Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { RuntimeEventMock } from '../../../src/ignition/runtime/RuntimeEventMock';

describe('RuntimeEventMock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<RuntimeEventMock />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<RuntimeEventMock />);
    expect(container).toMatchSnapshot();
  });

  it('displays event name', () => {
    const { getByText } = render(<RuntimeEventMock event="OnStart" />);
    expect(getByText(/OnStart/)).toBeTruthy();
  });

  it('displays event payload', () => {
    const payload = { sceneId: 'main' };
    const { getByText } = render(<RuntimeEventMock event="OnStart" payload={payload} />);
    expect(getByText(/sceneId/)).toBeTruthy();
  });

  it('triggers event on load', () => {
    const onEvent = vi.fn();
    render(<RuntimeEventMock event="OnStart" onEvent={onEvent} />);
    expect(onEvent).toHaveBeenCalled();
  });

  it('repeats events when repeat is true', async () => {
    const onEvent = vi.fn();
    render(<RuntimeEventMock event="OnUpdate" repeat={true} interval={100} onEvent={onEvent} />);
    
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(onEvent).toHaveBeenCalledTimes(2);
    });
  });

  it('updates trigger count', () => {
    const { getByText } = render(<RuntimeEventMock event="OnStart" repeat={true} interval={100} />);
    vi.advanceTimersByTime(200);
    expect(getByText(/Triggered/)).toBeTruthy();
  });
});

