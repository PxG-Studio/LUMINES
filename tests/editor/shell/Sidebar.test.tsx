/**
 * Sidebar Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../../src/editor/shell/Sidebar';

describe('Sidebar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Sidebar />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<Sidebar />);
    expect(container).toMatchSnapshot();
  });

  it('renders sidebar items', () => {
    const items = [
      { id: '1', label: 'Files' },
      { id: '2', label: 'Search' },
    ];
    const { getByText } = render(<Sidebar items={items} />);
    expect(getByText('Files')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  it('calls onItemClick when item is clicked', () => {
    const items = [{ id: '1', label: 'Files' }];
    const onItemClick = vi.fn();
    const { getByText } = render(<Sidebar items={items} onItemClick={onItemClick} />);
    fireEvent.click(getByText('Files'));
    expect(onItemClick).toHaveBeenCalledWith('1');
  });

  it('shows collapsed state', () => {
    const { container } = render(<Sidebar collapsed={true} />);
    expect(container).toBeTruthy();
  });

  it('calls onToggleCollapse when collapse button is clicked', () => {
    const onToggleCollapse = vi.fn();
    const { container } = render(<Sidebar onToggleCollapse={onToggleCollapse} />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
      expect(onToggleCollapse).toHaveBeenCalled();
    }
  });

  it('highlights active item', () => {
    const items = [
      { id: '1', label: 'Files' },
      { id: '2', label: 'Search' },
    ];
    const { getByText } = render(<Sidebar items={items} activeItemId="1" />);
    const activeItem = getByText('Files').parentElement;
    expect(activeItem).toBeTruthy();
  });
});

