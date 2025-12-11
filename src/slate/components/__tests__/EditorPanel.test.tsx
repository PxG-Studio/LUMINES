import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorPanel } from '../EditorPanel';

describe('EditorPanel', () => {
  const mockTabs = [
    { id: 'tab-1', name: 'Test.cs', path: 'src/Test.cs' },
    { id: 'tab-2', name: 'Helper.js', path: 'src/Helper.js' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Rendering', () => {
    it('renders all tabs', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('Test.cs')).toBeInTheDocument();
      expect(screen.getByText('Helper.js')).toBeInTheDocument();
    });

    it('highlights active tab', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      const activeTab = screen.getByText('Test.cs').closest('div[role="tab"]');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
      expect(activeTab).toHaveStyle({ borderBottom: expect.stringContaining('2px solid') });
    });

    it('does not highlight inactive tabs', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      const inactiveTab = screen.getByText('Helper.js').closest('div[role="tab"]');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });

    it('shows modified indicator for modified tabs', () => {
      const modifiedTabs = [
        { id: 'tab-1', name: 'Test.cs', path: 'src/Test.cs', modified: true },
      ];

      render(
        <EditorPanel
          tabs={modifiedTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('•')).toBeInTheDocument();
    });

    it('handles empty tabs array', () => {
      render(<EditorPanel tabs={[]} />);

      expect(screen.getByText('No file open')).toBeInTheDocument();
      expect(screen.getByText('Select a file from the explorer to start editing')).toBeInTheDocument();
    });
  });

  describe('Tab Interactions', () => {
    it('calls onTabSelect when tab is clicked', () => {
      const onTabSelect = vi.fn();

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          onTabSelect={onTabSelect}
        />
      );

      const tab2 = screen.getByText('Helper.js');
      fireEvent.click(tab2);

      expect(onTabSelect).toHaveBeenCalledWith('tab-2');
    });

    it('calls onTabClose when close button is clicked', () => {
      const onTabClose = vi.fn();

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          onTabClose={onTabClose}
        />
      );

      const closeButtons = screen.getAllByRole('button');
      const firstCloseButton = closeButtons.find(btn =>
        btn.querySelector('svg')?.classList.contains('lucide-x')
      );

      fireEvent.click(firstCloseButton!);

      expect(onTabClose).toHaveBeenCalledWith('tab-1');
    });

    it('does not call onTabSelect when close button is clicked', () => {
      const onTabSelect = vi.fn();
      const onTabClose = vi.fn();

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          onTabSelect={onTabSelect}
          onTabClose={onTabClose}
        />
      );

      const closeButtons = screen.getAllByRole('button');
      const firstCloseButton = closeButtons.find(btn =>
        btn.querySelector('svg')?.classList.contains('lucide-x')
      );

      fireEvent.click(firstCloseButton!);

      expect(onTabClose).toHaveBeenCalled();
      expect(onTabSelect).not.toHaveBeenCalled();
    });

    it('handles tab switch', () => {
      const onTabSelect = vi.fn();

      const { rerender } = render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          onTabSelect={onTabSelect}
        />
      );

      const tab2 = screen.getByText('Helper.js').closest('div[role="tab"]');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      rerender(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-2"
          onTabSelect={onTabSelect}
        />
      );

      const newTab2 = screen.getByText('Helper.js').closest('div[role="tab"]');
      expect(newTab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Editor Content', () => {
    it('displays editor when tab is active', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toBeInTheDocument();
    });

    it('displays content in editor', () => {
      const content = 'using UnityEngine;\n\npublic class Test {}';

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          content={content}
        />
      );

      const textarea = screen.getByPlaceholderText('// Start coding...') as HTMLTextAreaElement;
      expect(textarea.value).toBe(content);
    });

    it('calls onContentChange when content is edited', () => {
      const onContentChange = vi.fn();

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          content=""
          onContentChange={onContentChange}
        />
      );

      const textarea = screen.getByPlaceholderText('// Start coding...');
      fireEvent.change(textarea, { target: { value: 'new content' } });

      expect(onContentChange).toHaveBeenCalledWith('new content');
    });

    it('shows empty state when no tab is active', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
        />
      );

      expect(screen.getByText('No file open')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('// Start coding...')).not.toBeInTheDocument();
    });

    it('updates content when switching tabs', () => {
      const { rerender } = render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          content="content1"
        />
      );

      let textarea = screen.getByPlaceholderText('// Start coding...') as HTMLTextAreaElement;
      expect(textarea.value).toBe('content1');

      rerender(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-2"
          content="content2"
        />
      );

      textarea = screen.getByPlaceholderText('// Start coding...') as HTMLTextAreaElement;
      expect(textarea.value).toBe('content2');
    });
  });

  describe('Status Bar', () => {
    it('displays file path in status bar', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('src/Test.cs')).toBeInTheDocument();
    });

    it('displays encoding in status bar', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('UTF-8')).toBeInTheDocument();
    });

    it('displays save button in status bar', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('hides status bar when no tab is active', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
        />
      );

      expect(screen.queryByText('UTF-8')).not.toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long file names', () => {
      const longTabs = [
        {
          id: 'tab-1',
          name: 'VeryLongFileNameThatShouldBeDisplayedCorrectly.cs',
          path: 'src/VeryLongFileNameThatShouldBeDisplayedCorrectly.cs'
        },
      ];

      render(
        <EditorPanel
          tabs={longTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('VeryLongFileNameThatShouldBeDisplayedCorrectly.cs')).toBeInTheDocument();
    });

    it('handles special characters in file names', () => {
      const specialTabs = [
        { id: 'tab-1', name: 'Test (1).cs', path: 'src/Test (1).cs' },
      ];

      render(
        <EditorPanel
          tabs={specialTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('Test (1).cs')).toBeInTheDocument();
    });

    it('handles large content', () => {
      const largeContent = 'a'.repeat(100000);

      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
          content={largeContent}
        />
      );

      const textarea = screen.getByPlaceholderText('// Start coding...') as HTMLTextAreaElement;
      expect(textarea.value.length).toBe(100000);
    });

    it('handles tab with no path', () => {
      const noPathTabs = [
        { id: 'tab-1', name: 'Untitled', path: '' },
      ];

      render(
        <EditorPanel
          tabs={noPathTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByText('Untitled')).toBeInTheDocument();
    });

    it('handles multiple tabs with same name', () => {
      const sameNameTabs = [
        { id: 'tab-1', name: 'Test.cs', path: 'src/Test.cs' },
        { id: 'tab-2', name: 'Test.cs', path: 'assets/Test.cs' },
      ];

      render(
        <EditorPanel
          tabs={sameNameTabs}
          activeTabId="tab-1"
        />
      );

      const tabs = screen.getAllByText('Test.cs');
      expect(tabs.length).toBe(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(2);
    });

    it('sets aria-selected correctly', () => {
      render(
        <EditorPanel
          tabs={mockTabs}
          activeTabId="tab-1"
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });
  });
});
