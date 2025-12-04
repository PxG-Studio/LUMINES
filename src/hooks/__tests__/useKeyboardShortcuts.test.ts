import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls action on matching shortcut', () => {
    const action = vi.fn();
    const shortcuts = [
      {
        key: 's',
        ctrl: true,
        action,
        description: 'Save',
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('handles meta key (cmd on Mac)', () => {
    const action = vi.fn();
    const shortcuts = [
      {
        key: 's',
        ctrl: true,
        action,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      metaKey: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('handles shift modifier', () => {
    const action = vi.fn();
    const shortcuts = [
      {
        key: 'S',
        ctrl: true,
        shift: true,
        action,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'S',
      ctrlKey: true,
      shiftKey: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('handles alt modifier', () => {
    const action = vi.fn();
    const shortcuts = [
      {
        key: 'f',
        alt: true,
        action,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'f',
      altKey: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('does not call action if modifiers do not match', () => {
    const action = vi.fn();
    const shortcuts = [
      {
        key: 's',
        ctrl: true,
        action,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: false,
    });

    window.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();
  });

  it('handles multiple shortcuts', () => {
    const action1 = vi.fn();
    const action2 = vi.fn();
    const shortcuts = [
      { key: 's', ctrl: true, action: action1 },
      { key: 'n', ctrl: true, action: action2 },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event1 = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });
    window.dispatchEvent(event1);

    const event2 = new KeyboardEvent('keydown', {
      key: 'n',
      ctrlKey: true,
    });
    window.dispatchEvent(event2);

    expect(action1).toHaveBeenCalled();
    expect(action2).toHaveBeenCalled();
  });

  it('is case-insensitive for keys', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 's', ctrl: true, action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'S',
      ctrlKey: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 's', ctrl: true, action },
    ];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    unmount();

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });

    window.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();
  });
});
