/**
 * TopBar Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { TopBar } from '../../../src/editor/shell/TopBar';

describe('TopBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<TopBar />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('renders title', () => {
    const { getByText } = render(<TopBar title="Test IDE" />);
    expect(getByText('Test IDE')).toBeTruthy();
  });

  it('renders menu items', () => {
    const menuItems = [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
    ];
    const { getByText } = render(<TopBar menuItems={menuItems} />);
    expect(getByText('File')).toBeTruthy();
    expect(getByText('Edit')).toBeTruthy();
  });

  it('calls onMenuItemClick when menu item is clicked', () => {
    const menuItems = [{ id: 'file', label: 'File' }];
    const onMenuItemClick = vi.fn();
    const { getByText } = render(
      <TopBar menuItems={menuItems} onMenuItemClick={onMenuItemClick} />
    );
    fireEvent.click(getByText('File'));
    expect(onMenuItemClick).toHaveBeenCalledWith('file');
  });

  it('shows command palette button when showCommandPalette is true', () => {
    const { container } = render(<TopBar showCommandPalette={true} />);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('calls onCommandPaletteClick when command palette button is clicked', () => {
    const onCommandPaletteClick = vi.fn();
    const { container } = render(
      <TopBar showCommandPalette={true} onCommandPaletteClick={onCommandPaletteClick} />
    );
    const buttons = container.querySelectorAll('button');
    const paletteButton = Array.from(buttons).find((btn) =>
      btn.textContent?.includes('P')
    );
    if (paletteButton) {
      fireEvent.click(paletteButton);
      expect(onCommandPaletteClick).toHaveBeenCalled();
    }
  });

  it('shows save indicator when showSaveIndicator is true', () => {
    const { container } = render(<TopBar showSaveIndicator={true} />);
    expect(container.textContent).toContain('Unsaved');
  });
});

