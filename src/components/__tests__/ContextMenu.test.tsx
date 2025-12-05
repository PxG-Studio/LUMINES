import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from '../ContextMenu';

describe('ContextMenu', () => {
  const mockItems = [
    { label: 'Action 1', onClick: vi.fn() },
    { label: 'Action 2', onClick: vi.fn() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders menu items', () => {
    render(<ContextMenu items={mockItems} x={100} y={100} onClose={vi.fn()} />);

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('calls onClick when item clicked', () => {
    const onClose = vi.fn();

    render(<ContextMenu items={mockItems} x={100} y={100} onClose={onClose} />);

    fireEvent.click(screen.getByText('Action 1'));

    expect(mockItems[0].onClick).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('positions menu at correct coordinates', () => {
    const { container } = render(
      <ContextMenu items={mockItems} x={150} y={200} onClose={vi.fn()} />
    );

    const menu = container.firstChild as HTMLElement;
    expect(menu).toHaveStyle({ left: '150px', top: '200px' });
  });

  it('closes on escape key', () => {
    const onClose = vi.fn();

    render(<ContextMenu items={mockItems} x={100} y={100} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('closes on outside click', () => {
    const onClose = vi.fn();

    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ContextMenu items={mockItems} x={100} y={100} onClose={onClose} />
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on menu click', () => {
    const onClose = vi.fn();

    const { container } = render(
      <ContextMenu items={mockItems} x={100} y={100} onClose={onClose} />
    );

    const menu = container.firstChild as HTMLElement;
    fireEvent.mouseDown(menu);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders disabled items', () => {
    const items = [
      { label: 'Disabled', onClick: vi.fn(), disabled: true },
    ];

    render(<ContextMenu items={items} x={100} y={100} onClose={vi.fn()} />);

    const item = screen.getByText('Disabled').closest('button');
    expect(item).toBeDisabled();
  });

  it('does not call onClick for disabled items', () => {
    const onClick = vi.fn();
    const items = [{ label: 'Disabled', onClick, disabled: true }];

    render(<ContextMenu items={items} x={100} y={100} onClose={vi.fn()} />);

    const item = screen.getByText('Disabled');
    fireEvent.click(item);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders divider', () => {
    const items = [
      { label: 'Action 1', onClick: vi.fn() },
      { divider: true },
      { label: 'Action 2', onClick: vi.fn() },
    ];

    const { container } = render(
      <ContextMenu items={items} x={100} y={100} onClose={vi.fn()} />
    );

    const dividers = container.querySelectorAll('[role="separator"]');
    expect(dividers.length).toBe(1);
  });
});
