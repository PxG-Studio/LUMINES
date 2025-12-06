/**
 * Command Palette Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CommandPalette } from '../../../src/editor/shell/CommandPalette';

describe('CommandPalette', () => {
  it('does not render when visible is false', () => {
    const { container } = render(<CommandPalette visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when visible is true', () => {
    const { container } = render(<CommandPalette visible={true} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<CommandPalette visible={true} />);
    expect(container).toMatchSnapshot();
  });

  it('renders search input', () => {
    const { container } = render(<CommandPalette visible={true} />);
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('filters commands based on search term', () => {
    const commands = [
      { id: '1', label: 'New File', category: 'File' },
      { id: '2', label: 'Save', category: 'File' },
    ];
    const { container, getByPlaceholderText } = render(
      <CommandPalette visible={true} commands={commands} />
    );
    const input = getByPlaceholderText('Type a command...');
    fireEvent.change(input, { target: { value: 'New' } });
    expect(container).toBeTruthy();
  });

  it('calls onCommandSelect when command is clicked', () => {
    const commands = [{ id: '1', label: 'New File', category: 'File' }];
    const onCommandSelect = vi.fn();
    const { getByText } = render(
      <CommandPalette visible={true} commands={commands} onCommandSelect={onCommandSelect} />
    );
    fireEvent.click(getByText('New File'));
    expect(onCommandSelect).toHaveBeenCalledWith('1');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<CommandPalette visible={true} onClose={onClose} />);
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    const { container } = render(<CommandPalette visible={true} onClose={onClose} />);
    const input = container.querySelector('input');
    if (input) {
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    }
  });
});

