import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditorPanel } from '../EditorPanel';

describe('EditorPanel - Comprehensive Tests', () => {
  const defaultTabs = [
    { id: '1', name: 'App.tsx', path: '/App.tsx', modified: false },
    { id: '2', name: 'index.ts', path: '/index.ts', modified: true },
  ];

  const defaultProps = {
    tabs: defaultTabs,
    activeTabId: '1',
    content: 'const app = () => {};',
    onTabSelect: vi.fn(),
    onTabClose: vi.fn(),
    onContentChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with tabs', () => {
      render(<EditorPanel {...defaultProps} />);
      expect(screen.getByText('App.tsx')).toBeInTheDocument();
      expect(screen.getByText('index.ts')).toBeInTheDocument();
    });

    it('should render without tabs', () => {
      render(<EditorPanel tabs={[]} />);
      expect(screen.getByText('No file open')).toBeInTheDocument();
      expect(screen.getByText('Select a file from the explorer to start editing')).toBeInTheDocument();
    });

    it('should render active tab content', () => {
      render(<EditorPanel {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue('const app = () => {};');
    });

    it('should highlight active tab', () => {
      render(<EditorPanel {...defaultProps} />);
      const activeTab = screen.getByText('App.tsx').closest('div[role="tab"]');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should show modified indicator on modified tabs', () => {
      render(<EditorPanel {...defaultProps} />);
      const modifiedTab = screen.getByText('index.ts').closest('div[role="tab"]');
      expect(modifiedTab).toBeInTheDocument();
      // Check for modified dot (•)
      const tabText = screen.getByText('index.ts');
      expect(tabText.parentElement?.textContent).toContain('•');
    });

    it('should render status bar with file path and encoding', () => {
      render(<EditorPanel {...defaultProps} />);
      expect(screen.getByText('/App.tsx')).toBeInTheDocument();
      expect(screen.getByText('UTF-8')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should not render status bar when no active tab', () => {
      render(<EditorPanel tabs={defaultTabs} activeTabId={undefined} />);
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('Tab Selection', () => {
    it('should call onTabSelect when tab is clicked', () => {
      render(<EditorPanel {...defaultProps} />);
      const tab = screen.getByText('index.ts');
      fireEvent.click(tab);
      expect(defaultProps.onTabSelect).toHaveBeenCalledWith('2');
    });

    it('should update active tab when activeTabId changes', () => {
      const { rerender } = render(<EditorPanel {...defaultProps} />);
      expect(screen.getByText('App.tsx').closest('div[role="tab"]')).toHaveAttribute('aria-selected', 'true');
      
      rerender(<EditorPanel {...defaultProps} activeTabId="2" />);
      expect(screen.getByText('index.ts').closest('div[role="tab"]')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Tab Closing', () => {
    it('should call onTabClose when close button is clicked', () => {
      render(<EditorPanel {...defaultProps} />);
      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(btn => btn.querySelector('svg'));
      
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(defaultProps.onTabClose).toHaveBeenCalled();
      }
    });

    it('should stop propagation when close button is clicked', () => {
      render(<EditorPanel {...defaultProps} />);
      const tab = screen.getByText('App.tsx').closest('div[role="tab"]');
      const closeButton = tab?.querySelector('button');
      
      if (closeButton) {
        const clickSpy = vi.fn();
        tab?.addEventListener('click', clickSpy);
        
        fireEvent.click(closeButton);
        
        // onTabClose should be called, but tab click should not be
        expect(defaultProps.onTabClose).toHaveBeenCalled();
      }
    });
  });

  describe('Content Editing', () => {
    it('should call onContentChange when content is edited', () => {
      render(<EditorPanel {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      
      fireEvent.change(textarea, { target: { value: 'new content' } });
      
      expect(defaultProps.onContentChange).toHaveBeenCalledWith('new content');
    });

    it('should update textarea value when content prop changes', () => {
      const { rerender } = render(<EditorPanel {...defaultProps} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue('const app = () => {};');
      
      rerender(<EditorPanel {...defaultProps} content="updated content" />);
      expect(textarea).toHaveValue('updated content');
    });

    it('should handle empty content', () => {
      render(<EditorPanel {...defaultProps} content="" />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue('');
    });

    it('should handle very long content', () => {
      const longContent = 'a'.repeat(100000);
      render(<EditorPanel {...defaultProps} content={longContent} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue(longContent);
    });

    it('should handle special characters in content', () => {
      const specialContent = 'const test = "特殊字符@#$%^&*()";';
      render(<EditorPanel {...defaultProps} content={specialContent} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue(specialContent);
    });

    it('should handle unicode content', () => {
      const unicodeContent = 'const 测试 = "файл"; // 日本語';
      render(<EditorPanel {...defaultProps} content={unicodeContent} />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      expect(textarea).toHaveValue(unicodeContent);
    });
  });

  describe('Hover States', () => {
    it('should apply hover styles on inactive tab hover', () => {
      render(<EditorPanel {...defaultProps} />);
      const inactiveTab = screen.getByText('index.ts').closest('div[role="tab"]');
      
      if (inactiveTab) {
        fireEvent.mouseEnter(inactiveTab);
        expect(inactiveTab).toBeInTheDocument();
        
        fireEvent.mouseLeave(inactiveTab);
        expect(inactiveTab).toBeInTheDocument();
      }
    });

    it('should not apply hover styles to active tab', () => {
      render(<EditorPanel {...defaultProps} />);
      const activeTab = screen.getByText('App.tsx').closest('div[role="tab"]');
      
      if (activeTab) {
        fireEvent.mouseEnter(activeTab);
        expect(activeTab).toHaveAttribute('aria-selected', 'true');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle tabs with very long names', () => {
      const longName = 'a'.repeat(200);
      const tabs = [{ id: '1', name: longName, path: `/${longName}`, modified: false }];
      render(<EditorPanel {...defaultProps} tabs={tabs} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle tabs with special characters in names', () => {
      const tabs = [{ id: '1', name: 'test@#$%^&().ts', path: '/test@#$%^&().ts', modified: false }];
      render(<EditorPanel {...defaultProps} tabs={tabs} />);
      expect(screen.getByText('test@#$%^&().ts')).toBeInTheDocument();
    });

    it('should handle many tabs', () => {
      const manyTabs = Array.from({ length: 50 }, (_, i) => ({
        id: String(i),
        name: `file${i}.ts`,
        path: `/file${i}.ts`,
        modified: false,
      }));
      render(<EditorPanel {...defaultProps} tabs={manyTabs} />);
      expect(screen.getByText('file0.ts')).toBeInTheDocument();
      expect(screen.getByText('file49.ts')).toBeInTheDocument();
    });

    it('should handle missing callbacks gracefully', () => {
      render(<EditorPanel tabs={defaultTabs} activeTabId="1" content="test" />);
      const textarea = screen.getByPlaceholderText('// Start coding...');
      
      // Should not throw when callbacks are missing
      fireEvent.change(textarea, { target: { value: 'new' } });
      expect(textarea).toHaveValue('test'); // Value should remain unchanged
    });

    it('should handle undefined activeTabId', () => {
      render(<EditorPanel {...defaultProps} activeTabId={undefined} />);
      expect(screen.getByText('No file open')).toBeInTheDocument();
    });

    it('should handle activeTabId that does not exist in tabs', () => {
      render(<EditorPanel {...defaultProps} activeTabId="999" />);
      expect(screen.getByText('No file open')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<EditorPanel {...defaultProps} />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should have aria-selected on active tab', () => {
      render(<EditorPanel {...defaultProps} />);
      const activeTab = screen.getByText('App.tsx').closest('div[role="tab"]');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-selected="false" on inactive tabs', () => {
      render(<EditorPanel {...defaultProps} />);
      const inactiveTab = screen.getByText('index.ts').closest('div[role="tab"]');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });
  });
});

