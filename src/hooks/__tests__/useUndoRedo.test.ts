import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../useUndoRedo';

describe('useUndoRedo', () => {
  it('initializes with initial state', () => {
    const { result } = renderHook(() => useUndoRedo('initial'));

    expect(result.current.state).toBe('initial');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('adds to history on set', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
    });

    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('undoes to previous state', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
      result.current.set('c');
    });

    expect(result.current.state).toBe('c');

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it('redoes to next state', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
      result.current.set('c');
      result.current.undo();
    });

    expect(result.current.state).toBe('b');

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe('c');
    expect(result.current.canRedo).toBe(false);
  });

  it('clears future on new set after undo', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
      result.current.set('c');
      result.current.undo();
      result.current.set('d');
    });

    expect(result.current.state).toBe('d');
    expect(result.current.canRedo).toBe(false);
  });

  it('respects max history limit', () => {
    const { result } = renderHook(() => useUndoRedo('a', 3));

    act(() => {
      result.current.set('b');
      result.current.set('c');
      result.current.set('d');
      result.current.set('e');
    });

    act(() => {
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });

    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(false);
  });

  it('does nothing on undo when at beginning', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe('a');
  });

  it('does nothing on redo when at end', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
      result.current.redo();
    });

    expect(result.current.state).toBe('b');
  });

  it('resets history', () => {
    const { result } = renderHook(() => useUndoRedo('a'));

    act(() => {
      result.current.set('b');
      result.current.set('c');
      result.current.reset('x');
    });

    expect(result.current.state).toBe('x');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('handles multiple undo/redo cycles', () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.set(3);
      result.current.undo();
      result.current.undo();
      result.current.redo();
      result.current.set(4);
    });

    expect(result.current.state).toBe(4);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });
});
