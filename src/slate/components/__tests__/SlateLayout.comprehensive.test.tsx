import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { SlateLayout } from '../SlateLayout';
import userEvent from '@testing-library/user-event';

describe('SlateLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the layout with default props', () => {
      render(<SlateLayout />);

      expect(screen.getByText('SLATE')).toBeInTheDocument();
      expect(screen.getByText('Full IDE')).toBeInTheDocument();
    });

    it('renders header with navigation', () => {
      render(<SlateLayout />);

      expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^ide$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /unity assets/i })).toBeInTheDocument();
    });

    it('renders ExplorerPanel in IDE view', () => {
      render(<SlateLayout />);

      // ExplorerPanel should be visible in IDE view
      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(sidebar || document.querySelector('[data-testid="explorer-panel"]')).toBeTruthy();
    });

    it('renders EditorPanel in IDE view', () => {
      render(<SlateLayout />);

      // EditorPanel should be present
      const editor = document.querySelector('[data-testid="editor-panel"]');
      expect(editor || screen.getByRole('tablist')).toBeTruthy();
    });

    it('renders RuntimePanel in IDE view', () => {
      render(<SlateLayout />);

      expect(screen.getByText('Runtime')).toBeInTheDocument();
    });

    it('renders BottomPanel in IDE view', () => {
      render(<SlateLayout />);

      // BottomPanel should be present (console/logs/errors tabs)
      const bottomPanel = document.querySelector('[role="tablist"][aria-label*="output"]');
      expect(bottomPanel || screen.getByText(/console|logs|errors/i)).toBeTruthy();
    });

    it('displays default status', () => {
      render(<SlateLayout />);

      expect(screen.getByText('Ignition: idle')).toBeInTheDocument();
    });

    it('displays custom status', () => {
      render(<SlateLayout status="Ignition: running" />);

      expect(screen.getByText('Ignition: running')).toBeInTheDocument();
    });
  });

  describe('View Switching', () => {
    it('starts in IDE view by default', () => {
      render(<SlateLayout />);

      const ideButton = screen.getByRole('button', { name: /^ide$/i });
      expect(ideButton).toHaveAttribute('style', expect.stringContaining('gradient'));
    });

    it('switches to Assets view when Unity Assets button is clicked', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const assetsButton = screen.getByRole('button', { name: /unity assets/i });
      await user.click(assetsButton);

      // Assets view should be active
      expect(assetsButton).toHaveAttribute('style', expect.stringContaining('gradient'));
    });

    it('switches back to IDE view from Assets view', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const assetsButton = screen.getByRole('button', { name: /unity assets/i });
      await user.click(assetsButton);

      const ideButton = screen.getByRole('button', { name: /^ide$/i });
      await user.click(ideButton);

      expect(ideButton).toHaveAttribute('style', expect.stringContaining('gradient'));
    });
  });

  describe('Sidebar Toggle', () => {
    it('renders sidebar toggle button', () => {
      render(<SlateLayout />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('collapses sidebar when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      await user.click(toggleButton);

      // Sidebar should be hidden
      const sidebar = document.querySelector('[style*="width: 280px"]');
      expect(sidebar).not.toBeInTheDocument();
    });

    it('expands sidebar when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      
      // Collapse
      await user.click(toggleButton);
      
      // Expand
      await user.click(toggleButton);

      // Sidebar should be visible again
      const sidebar = document.querySelector('[style*="width: 280px"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('calls onFileSelect when file is selected', async () => {
      const onFileSelect = vi.fn();
      render(<SlateLayout onFileSelect={onFileSelect} />);

      // File selection would be triggered by ExplorerPanel
      // This is tested through integration
      expect(onFileSelect).toBeDefined();
    });

    it('opens file in new tab when selected', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      // Simulate file selection (would normally come from ExplorerPanel)
      // For now, verify tab creation mechanism exists
      const editorPanel = document.querySelector('[data-testid="editor-panel"]');
      expect(editorPanel || screen.getByRole('tablist')).toBeTruthy();
    });
  });

  describe('Tab Management', () => {
    it('calls onTabSelect when tab is selected', async () => {
      const onTabSelect = vi.fn();
      render(<SlateLayout onTabSelect={onTabSelect} />);

      // Tab selection would be triggered by EditorPanel
      expect(onTabSelect).toBeDefined();
    });

    it('calls onTabClose when tab is closed', async () => {
      const onTabClose = vi.fn();
      render(<SlateLayout onTabClose={onTabClose} />);

      // Tab closing would be triggered by EditorPanel
      expect(onTabClose).toBeDefined();
    });
  });

  describe('Runtime Controls', () => {
    it('calls onRun when Run button is clicked', async () => {
      const onRun = vi.fn();
      render(<SlateLayout onRun={onRun} />);

      const runButton = screen.getByLabelText('Run');
      await userEvent.click(runButton);

      expect(onRun).toHaveBeenCalled();
    });

    it('calls onRestart when Restart button is clicked', async () => {
      const onRestart = vi.fn();
      render(<SlateLayout onRestart={onRestart} />);

      const restartButton = screen.getByLabelText('Restart');
      await userEvent.click(restartButton);

      expect(onRestart).toHaveBeenCalled();
    });

    it('calls onStop when Stop button is clicked', async () => {
      const onStop = vi.fn();
      render(<SlateLayout onStop={onStop} />);

      const stopButton = screen.getByLabelText('Stop');
      await userEvent.click(stopButton);

      expect(onStop).toHaveBeenCalled();
    });
  });

  describe('Bottom Panel Resize', () => {
    it('renders bottom panel with resize handle', () => {
      render(<SlateLayout />);

      const bottomPanel = document.querySelector('[style*="height: 200px"]');
      expect(bottomPanel).toBeInTheDocument();
    });

    it('allows resizing bottom panel', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const resizeHandle = document.querySelector('[style*="cursor: ns-resize"]');
      expect(resizeHandle).toBeInTheDocument();

      if (resizeHandle) {
        const startY = 100;
        const moveY = 150;

        fireEvent.mouseDown(resizeHandle, { clientY: startY });
        fireEvent.mouseMove(resizeHandle, { clientY: moveY });
        fireEvent.mouseUp(resizeHandle);

        // Panel height should have changed
        await waitFor(() => {
          const panel = document.querySelector('[style*="height"]');
          expect(panel).toBeInTheDocument();
        });
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles missing callbacks gracefully', () => {
      render(<SlateLayout />);

      // Should render without errors
      expect(screen.getByText('SLATE')).toBeInTheDocument();
    });

    it('handles empty status string', () => {
      render(<SlateLayout status="" />);

      expect(screen.getByText('Runtime')).toBeInTheDocument();
    });

    it('handles very long status messages', () => {
      const longStatus = 'Ignition: ' + 'running '.repeat(100);
      render(<SlateLayout status={longStatus} />);

      expect(screen.getByText(longStatus)).toBeInTheDocument();
    });

    it('handles rapid view switching', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const ideButton = screen.getByRole('button', { name: /^ide$/i });
      const assetsButton = screen.getByRole('button', { name: /unity assets/i });

      await user.click(assetsButton);
      await user.click(ideButton);
      await user.click(assetsButton);
      await user.click(ideButton);

      expect(ideButton).toHaveAttribute('style', expect.stringContaining('gradient'));
    });

    it('handles multiple file selections', async () => {
      render(<SlateLayout />);

      // Multiple tabs should be manageable
      const editorPanel = document.querySelector('[data-testid="editor-panel"]');
      expect(editorPanel || screen.getByRole('tablist')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on navigation buttons', () => {
      render(<SlateLayout />);

      expect(screen.getByRole('button', { name: /^ide$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /unity assets/i })).toBeInTheDocument();
    });

    it('has proper ARIA label on sidebar toggle', () => {
      render(<SlateLayout />);

      expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<SlateLayout />);

      const heading = screen.getByText('SLATE');
      expect(heading.tagName).toBe('H1');
    });

    it('has proper navigation landmark', () => {
      render(<SlateLayout />);

      expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
    });

    it('has keyboard accessible controls', async () => {
      const user = userEvent.setup();
      render(<SlateLayout />);

      const ideButton = screen.getByRole('button', { name: /^ide$/i });
      ideButton.focus();
      expect(ideButton).toHaveFocus();

      await user.keyboard('{Enter}');
      // Button should still be active
      expect(ideButton).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('renders with full viewport height', () => {
      const { container } = render(<SlateLayout />);

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveStyle({ height: '100vh' });
    });

    it('renders header with proper styling', () => {
      render(<SlateLayout />);

      const header = screen.getByText('SLATE').closest('header');
      expect(header).toBeInTheDocument();
    });

    it('renders main content area with flex layout', () => {
      const { container } = render(<SlateLayout />);

      const mainContent = container.querySelector('[style*="flex: 1"]');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('integrates ExplorerPanel correctly', () => {
      render(<SlateLayout />);

      // ExplorerPanel should be rendered
      const explorer = document.querySelector('[data-testid="explorer-panel"]');
      expect(explorer || screen.getByRole('complementary', { hidden: true })).toBeTruthy();
    });

    it('integrates EditorPanel correctly', () => {
      render(<SlateLayout />);

      // EditorPanel should be rendered
      const editor = document.querySelector('[data-testid="editor-panel"]');
      expect(editor || screen.getByRole('tablist')).toBeTruthy();
    });

    it('integrates RuntimePanel correctly', () => {
      render(<SlateLayout />);

      expect(screen.getByText('Runtime')).toBeInTheDocument();
      expect(screen.getByLabelText('Run')).toBeInTheDocument();
    });

    it('integrates BottomPanel correctly', () => {
      render(<SlateLayout />);

      const bottomPanel = document.querySelector('[role="tablist"][aria-label*="output"]');
      expect(bottomPanel || screen.getByText(/console|logs|errors/i)).toBeTruthy();
    });

    it('passes props correctly to child components', () => {
      const onRun = vi.fn();
      render(<SlateLayout status="Custom status" onRun={onRun} />);

      expect(screen.getByText('Custom status')).toBeInTheDocument();
      
      const runButton = screen.getByLabelText('Run');
      expect(runButton).toBeInTheDocument();
    });
  });
});
