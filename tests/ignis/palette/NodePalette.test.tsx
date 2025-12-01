/**
 * NodePalette Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { NodePalette } from '../../../src/ignis/palette/NodePalette';

describe('NodePalette', () => {
  it('renders without crashing', () => {
    const { container } = render(<NodePalette />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<NodePalette />);
    expect(container).toMatchSnapshot();
  });

  it('renders node categories', () => {
    const { getByText } = render(<NodePalette />);
    expect(getByText(/Math/i)).toBeTruthy();
  });

  it('renders node items', () => {
    const nodes = [
      { type: 'Add', title: 'Add', category: 'Math' },
      { type: 'Branch', title: 'Branch', category: 'Flow' },
    ];
    const { getByText } = render(<NodePalette nodes={nodes} />);
    expect(getByText('Add')).toBeTruthy();
    expect(getByText('Branch')).toBeTruthy();
  });

  it('filters nodes based on search term', () => {
    const nodes = [
      { type: 'Add', title: 'Add', category: 'Math' },
      { type: 'Branch', title: 'Branch', category: 'Flow' },
    ];
    const { getByPlaceholderText, queryByText } = render(<NodePalette nodes={nodes} />);
    const input = getByPlaceholderText('Search nodes...');
    fireEvent.change(input, { target: { value: 'Add' } });
    expect(queryByText('Add')).toBeTruthy();
    expect(queryByText('Branch')).toBeFalsy();
  });

  it('calls onNodeSelect when node is clicked', () => {
    const nodes = [{ type: 'Add', title: 'Add', category: 'Math' }];
    const onNodeSelect = vi.fn();
    const { getByText } = render(<NodePalette nodes={nodes} onNodeSelect={onNodeSelect} />);
    fireEvent.click(getByText('Add'));
    expect(onNodeSelect).toHaveBeenCalledWith('Add');
  });
});

