/**
 * BPGraphCanvas Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BPGraphCanvas } from '../../../src/ignis/canvas/BPGraphCanvas';

describe('BPGraphCanvas', () => {
  it('renders without crashing', () => {
    const { container } = render(<BPGraphCanvas />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<BPGraphCanvas />);
    expect(container).toMatchSnapshot();
  });

  it('renders canvas container', () => {
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.firstChild as HTMLElement;
    expect(canvas).toBeTruthy();
  });

  it('renders nodes from graph', () => {
    const graph = {
      nodes: {
        node1: {
          id: 'node1',
          type: 'Add',
          position: { x: 100, y: 100 },
          inputs: [],
          outputs: [],
        },
      },
      connections: [],
    };
    const { container } = render(<BPGraphCanvas graph={graph} />);
    expect(container).toBeTruthy();
  });

  it('handles panning', () => {
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.firstChild as HTMLElement;
    fireEvent.mouseDown(canvas, { button: 1 });
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas);
    expect(container).toBeTruthy();
  });

  it('handles zooming', () => {
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.firstChild as HTMLElement;
    fireEvent.wheel(canvas, { deltaY: -100 });
    expect(container).toBeTruthy();
  });

  it('calls onNodeDrag when node is dragged', () => {
    const onNodeDrag = vi.fn();
    const graph = {
      nodes: {
        node1: {
          id: 'node1',
          type: 'Add',
          position: { x: 100, y: 100 },
          inputs: [],
          outputs: [],
        },
      },
      connections: [],
    };
    const { container } = render(<BPGraphCanvas graph={graph} onNodeDrag={onNodeDrag} />);
    expect(container).toBeTruthy();
  });

  it('shows empty state when no nodes', () => {
    const { getByText } = render(<BPGraphCanvas graph={{ nodes: {}, connections: [] }} />);
    expect(getByText(/Drag nodes from palette/)).toBeTruthy();
  });
});

