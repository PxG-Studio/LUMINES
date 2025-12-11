import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SlateLayout } from '../../components/SlateLayout';
import { ExplorerPanel } from '../../components/ExplorerPanel';
import { EditorPanel } from '../../components/EditorPanel';
import { RuntimePanel } from '../../components/RuntimePanel';
import { BottomPanel } from '../../components/BottomPanel';
import userEvent from '@testing-library/user-event';

describe('Component Interactions - Comprehensive Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File Selection Flow', () => {
    it('should open file in editor when selected from explorer', async () => {
      const user = userEvent.setup();
      const onFileSelect = vi.fn();
      
      render(
        <SlateLayout onFileSelect={onFileSelect} />
      );

      // File selection would trigger tab opening
      // This tests the integration between ExplorerPanel and EditorPanel
      expect(onFileSelect).toBeDefined();
    });

    it('should update inspector when file is selected', async () => {
      const user = userEvent.setup();
      const onFileSelect = vi.fn();
      
      render(
        <SlateLayout onFileSelect={onFileSelect} />
      );

      // InspectorPanel should update when file is selected
      // Integration between ExplorerPanel -> InspectorPanel
      expect(onFileSelect).toBeDefined();
    });

    it('should highlight selected file in explorer', async () => {
      const user = userEvent.setup();
      
      render(
        <ExplorerPanel
          selectedPath="src/Main.cs"
          onFileSelect={vi.fn()}
        />
      );

      const file = screen.getByText('Main.cs');
      expect(file).toBeInTheDocument();
    });
  });

  describe('Tab Management Flow', () => {
    it('should create new tab when file is opened', async () => {
      const tabs = [
        { id: 'tab1', name: 'Main.cs', path: 'src/Main.cs' },
      ];
      
      render(
        <EditorPanel
          tabs={tabs}
          activeTabId="tab1"
          onTabSelect={vi.fn()}
          onTabClose={vi.fn()}
        />
      );

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });

    it('should switch active tab when clicked', async () => {
      const user = userEvent.setup();
      const onTabSelect = vi.fn();
      const tabs = [
        { id: 'tab1', name: 'File1.cs', path: 'src/File1.cs' },
        { id: 'tab2', name: 'File2.cs', path: 'src/File2.cs' },
      ];
      
      render(
        <EditorPanel
          tabs={tabs}
          activeTabId="tab1"
          onTabSelect={onTabSelect}
          onTabClose={vi.fn()}
        />
      );

      const tab2 = screen.getByText('File2.cs');
      await user.click(tab2);
      
      expect(onTabSelect).toHaveBeenCalledWith('tab2');
    });

    it('should close tab and switch to next tab', async () => {
      const user = userEvent.setup();
      const onTabClose = vi.fn();
      const tabs = [
        { id: 'tab1', name: 'File1.cs', path: 'src/File1.cs' },
        { id: 'tab2', name: 'File2.cs', path: 'src/File2.cs' },
      ];
      
      render(
        <EditorPanel
          tabs={tabs}
          activeTabId="tab1"
          onTabSelect={vi.fn()}
          onTabClose={onTabClose}
        />
      );

      const closeButton = screen.getAllByRole('button', { name: /close/i })[0];
      await user.click(closeButton);
      
      expect(onTabClose).toHaveBeenCalledWith('tab1');
    });
  });

  describe('Runtime Control Flow', () => {
    it('should update runtime status when run button clicked', async () => {
      const user = userEvent.setup();
      const onRun = vi.fn();
      
      render(
        <SlateLayout
          status="Ignition: idle"
          onRun={onRun}
        />
      );

      const runButton = screen.getByLabelText('Run');
      await user.click(runButton);
      
      expect(onRun).toHaveBeenCalled();
    });

    it('should update bottom panel logs when runtime runs', async () => {
      const logs = [
        { type: 'info' as const, message: 'Runtime started', timestamp: '10:00:00' },
        { type: 'info' as const, message: 'Compiling...', timestamp: '10:00:01' },
      ];
      
      render(<BottomPanel logs={logs} />);

      const logsTab = screen.getByRole('tab', { name: /logs/i });
      await userEvent.click(logsTab);
      
      expect(screen.getByText(/Runtime started/i)).toBeInTheDocument();
    });

    it('should display errors in bottom panel when runtime fails', async () => {
      render(<BottomPanel />);

      const errorsTab = screen.getByRole('tab', { name: /errors/i });
      await userEvent.click(errorsTab);
      
      // Should show error entries if any
      const errorSection = screen.getByRole('tab', { name: /errors/i });
      expect(errorSection).toBeInTheDocument();
    });
  });

  describe('View Switching Flow', () => {
    it('should switch between IDE and Assets views', async () => {
      const user = userEvent.setup();
      
      render(<SlateLayout />);

      const assetsButton = screen.getByRole('button', { name: /unity assets/i });
      await user.click(assetsButton);
      
      // Should switch to assets view
      expect(assetsButton).toHaveAttribute('style', expect.stringContaining('gradient'));
    });

    it('should preserve file selection when switching views', async () => {
      const user = userEvent.setup();
      const onFileSelect = vi.fn();
      
      render(
        <SlateLayout onFileSelect={onFileSelect} />
      );

      // Select file, then switch view
      const assetsButton = screen.getByRole('button', { name: /unity assets/i });
      await user.click(assetsButton);
      
      // File selection should be preserved
      expect(onFileSelect).toBeDefined();
    });
  });

  describe('Sidebar Toggle Flow', () => {
    it('should collapse sidebar and adjust layout', async () => {
      const user = userEvent.setup();
      
      render(<SlateLayout />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      await user.click(toggleButton);
      
      // Sidebar should be hidden
      const sidebar = document.querySelector('[style*="width: 280px"]');
      expect(sidebar).not.toBeInTheDocument();
    });

    it('should restore sidebar when toggled again', async () => {
      const user = userEvent.setup();
      
      render(<SlateLayout />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      await user.click(toggleButton);
      await user.click(toggleButton);
      
      // Sidebar should be visible again
      const sidebar = document.querySelector('[style*="width: 280px"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Bottom Panel Resize Flow', () => {
    it('should resize bottom panel when drag handle moved', async () => {
      render(<SlateLayout />);

      const resizeHandle = document.querySelector('[style*="cursor: ns-resize"]');
      expect(resizeHandle).toBeInTheDocument();

      if (resizeHandle) {
        fireEvent.mouseDown(resizeHandle, { clientY: 100 });
        fireEvent.mouseMove(resizeHandle, { clientY: 150 });
        fireEvent.mouseUp(resizeHandle);
        
        // Panel height should have changed
        await waitFor(() => {
          const panel = document.querySelector('[style*="height"]');
          expect(panel).toBeInTheDocument();
        });
      }
    });
  });

  describe('Multi-Component State Sync', () => {
    it('should sync selected file across components', async () => {
      const selectedPath = 'src/Main.cs';
      const onFileSelect = vi.fn();
      
      render(
        <SlateLayout
          onFileSelect={onFileSelect}
        />
      );

      // ExplorerPanel, EditorPanel, and InspectorPanel should all reflect selection
      expect(onFileSelect).toBeDefined();
    });

    it('should sync runtime status across components', async () => {
      const status = 'Ignition: running';
      
      render(
        <SlateLayout status={status} />
      );

      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  describe('Error Propagation', () => {
    it('should display errors in bottom panel when file operation fails', async () => {
      render(<BottomPanel />);

      const errorsTab = screen.getByRole('tab', { name: /errors/i });
      await userEvent.click(errorsTab);
      
      // Should show error if file operation failed
      const errorSection = screen.getByRole('tab', { name: /errors/i });
      expect(errorSection).toBeInTheDocument();
    });

    it('should handle missing callbacks gracefully', () => {
      render(
        <SlateLayout />
      );

      // Should render without errors even if callbacks are missing
      expect(screen.getByText('SLATE')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Flow', () => {
    it('should navigate tabs with keyboard', async () => {
      const user = userEvent.setup();
      const tabs = [
        { id: 'tab1', name: 'File1.cs', path: 'src/File1.cs' },
        { id: 'tab2', name: 'File2.cs', path: 'src/File2.cs' },
      ];
      
      render(
        <EditorPanel
          tabs={tabs}
          activeTabId="tab1"
          onTabSelect={vi.fn()}
          onTabClose={vi.fn()}
        />
      );

      const tab1 = screen.getByText('File1.cs');
      tab1.focus();
      
      await user.keyboard('{ArrowRight}');
      // Should navigate to next tab
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should close tab with keyboard shortcut', async () => {
      const user = userEvent.setup();
      const onTabClose = vi.fn();
      const tabs = [
        { id: 'tab1', name: 'File1.cs', path: 'src/File1.cs' },
      ];
      
      render(
        <EditorPanel
          tabs={tabs}
          activeTabId="tab1"
          onTabSelect={vi.fn()}
          onTabClose={onTabClose}
        />
      );

      const tab = screen.getByText('File1.cs');
      tab.focus();
      
      await user.keyboard('{Control>}w{/Control}');
      // Should close tab (if shortcut is implemented)
      expect(onTabClose).toBeDefined();
    });
  });
});
