/**
 * BlueprintInspector Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BlueprintInspector } from '../../../src/ignis/inspector/BlueprintInspector';

describe('BlueprintInspector', () => {
  it('renders without crashing', () => {
    const { container } = render(<BlueprintInspector />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<BlueprintInspector />);
    expect(container).toMatchSnapshot();
  });

  it('shows empty state when no node selected', () => {
    const { getByText } = render(<BlueprintInspector />);
    expect(getByText(/Select a node/)).toBeTruthy();
  });

  it('displays selected node type', () => {
    const selectedNode = {
      id: 'node1',
      type: 'Add',
      props: { a: 5, b: 3 },
    };
    const { getByText } = render(<BlueprintInspector selectedNode={selectedNode} />);
    expect(getByText('Add')).toBeTruthy();
  });

  it('displays node properties', () => {
    const selectedNode = {
      id: 'node1',
      type: 'Add',
      props: { a: 5, b: 3 },
    };
    const { getByText } = render(<BlueprintInspector selectedNode={selectedNode} />);
    expect(getByText('a')).toBeTruthy();
    expect(getByText('b')).toBeTruthy();
  });
});

