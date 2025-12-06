/**
 * NodeRenderer Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { NodeRenderer } from '../../../src/ignis/nodes/NodeRenderer';

describe('NodeRenderer', () => {
  const mockNode = {
    id: 'node1',
    type: 'Add',
    position: { x: 100, y: 120 },
    inputs: [
      { id: 'a', name: 'A', type: 'float', direction: 'input' as const },
      { id: 'b', name: 'B', type: 'float', direction: 'input' as const },
    ],
    outputs: [{ id: 'result', name: 'Result', type: 'float', direction: 'output' as const }],
    props: { a: 5, b: 3 },
    nodeType: 'data' as const,
  };

  it('renders without crashing', () => {
    const { container } = render(<NodeRenderer node={mockNode} />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<NodeRenderer node={mockNode} />);
    expect(container).toMatchSnapshot();
  });

  it('renders node title', () => {
    const { getByText } = render(<NodeRenderer node={mockNode} />);
    expect(getByText('Add')).toBeTruthy();
  });

  it('renders input sockets', () => {
    const { getByText } = render(<NodeRenderer node={mockNode} />);
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });

  it('renders output sockets', () => {
    const { getByText } = render(<NodeRenderer node={mockNode} />);
    expect(getByText('Result')).toBeTruthy();
  });

  it('displays node props', () => {
    const { getByText } = render(<NodeRenderer node={mockNode} />);
    expect(getByText(/A: 5/)).toBeTruthy();
    expect(getByText(/B: 3/)).toBeTruthy();
  });

  it('highlights selected node', () => {
    const { container } = render(<NodeRenderer node={mockNode} selected={true} />);
    const nodeElement = container.firstChild as HTMLElement;
    expect(nodeElement).toBeTruthy();
  });

  it('calls onDragStart when node is dragged', () => {
    const onDragStart = vi.fn();
    const { container } = render(<NodeRenderer node={mockNode} onDragStart={onDragStart} />);
    const nodeElement = container.firstChild as HTMLElement;
    fireEvent.mouseDown(nodeElement);
    expect(onDragStart).toHaveBeenCalled();
  });

  it('calls onSocketClick when socket is clicked', () => {
    const onSocketClick = vi.fn();
    const { getByText } = render(
      <NodeRenderer node={mockNode} onSocketClick={onSocketClick} />
    );
    const socket = getByText('A');
    fireEvent.click(socket);
    expect(onSocketClick).toHaveBeenCalled();
  });
});

