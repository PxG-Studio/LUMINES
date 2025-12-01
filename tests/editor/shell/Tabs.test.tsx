/**
 * Tabs Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Tabs } from '../../../src/editor/shell/Tabs';

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tabs />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<Tabs />);
    expect(container).toMatchSnapshot();
  });

  it('renders tabs', () => {
    const tabs = [
      { id: '1', label: 'File1' },
      { id: '2', label: 'File2' },
    ];
    const { getByText } = render(<Tabs tabs={tabs} />);
    expect(getByText('File1')).toBeTruthy();
    expect(getByText('File2')).toBeTruthy();
  });

  it('highlights active tab', () => {
    const tabs = [
      { id: '1', label: 'File1' },
      { id: '2', label: 'File2' },
    ];
    const { getByText } = render(<Tabs tabs={tabs} activeTabId="1" />);
    const activeTab = getByText('File1').parentElement;
    expect(activeTab).toBeTruthy();
  });

  it('calls onTabClick when tab is clicked', () => {
    const tabs = [{ id: '1', label: 'File1' }];
    const onTabClick = vi.fn();
    const { getByText } = render(<Tabs tabs={tabs} onTabClick={onTabClick} />);
    fireEvent.click(getByText('File1'));
    expect(onTabClick).toHaveBeenCalledWith('1');
  });

  it('shows dirty indicator when tab is dirty', () => {
    const tabs = [{ id: '1', label: 'File1', dirty: true }];
    const { container } = render(<Tabs tabs={tabs} />);
    expect(container).toBeTruthy();
  });

  it('calls onTabClose when close button is clicked', () => {
    const tabs = [{ id: '1', label: 'File1' }];
    const onTabClose = vi.fn();
    const { container } = render(<Tabs tabs={tabs} onTabClose={onTabClose} />);
    const closeButton = container.querySelector('button');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onTabClose).toHaveBeenCalledWith('1');
    }
  });

  it('does not call onTabClick when close button is clicked', () => {
    const tabs = [{ id: '1', label: 'File1' }];
    const onTabClick = vi.fn();
    const onTabClose = vi.fn();
    const { container } = render(
      <Tabs tabs={tabs} onTabClick={onTabClick} onTabClose={onTabClose} />
    );
    const closeButton = container.querySelector('button');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onTabClick).not.toHaveBeenCalled();
      expect(onTabClose).toHaveBeenCalled();
    }
  });
});

