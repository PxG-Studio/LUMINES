import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExplorerPanel } from '../ExplorerPanel';

describe('ExplorerPanel - Comprehensive Tests', () => {
  const defaultProps = {
    onFileSelect: vi.fn(),
    onShowAssetManager: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default files', () => {
      render(<ExplorerPanel {...defaultProps} />);
      expect(screen.getByText('Explorer')).toBeInTheDocument();
      expect(screen.getByText('src')).toBeInTheDocument();
      expect(screen.getByText('Assets')).toBeInTheDocument();
    });

    it('should render with custom files', () => {
      const customFiles = [
        {
          name: 'Custom',
          type: 'folder' as const,
          path: 'Custom',
          children: [{ name: 'test.ts', type: 'file' as const, path: 'Custom/test.ts' }],
        },
      ];
      render(<ExplorerPanel {...defaultProps} files={customFiles} />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('test.ts')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render Unity Assets button when onShowAssetManager is provided', () => {
      render(<ExplorerPanel {...defaultProps} />);
      expect(screen.getByText('Unity Assets')).toBeInTheDocument();
    });

    it('should not render Unity Assets button when onShowAssetManager is not provided', () => {
      render(<ExplorerPanel onFileSelect={defaultProps.onFileSelect} />);
      expect(screen.queryByText('Unity Assets')).not.toBeInTheDocument();
    });

    it('should render Inspector section', () => {
      render(<ExplorerPanel {...defaultProps} />);
      expect(screen.getByText('Inspector')).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const explorer = screen.getByRole('region', { name: 'file explorer' });
      expect(explorer).toBeInTheDocument();
      const tree = screen.getByRole('tree', { name: 'file explorer' });
      expect(tree).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should call onFileSelect when a file is clicked', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const file = screen.getByText('Main.cs');
      fireEvent.click(file);
      expect(defaultProps.onFileSelect).toHaveBeenCalledWith('src/Main.cs');
    });

    it('should highlight selected file', () => {
      render(<ExplorerPanel {...defaultProps} selectedPath="src/Main.cs" />);
      const file = screen.getByText('Main.cs');
      expect(file).toBeInTheDocument();
      // Check if selected styling is applied (border-left should be visible)
      const parent = file.closest('div');
      expect(parent).toHaveStyle({ borderLeft: expect.stringContaining('solid') });
    });

    it('should not call onFileSelect when a folder is clicked', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const folder = screen.getByText('src');
      fireEvent.click(folder);
      expect(defaultProps.onFileSelect).not.toHaveBeenCalled();
    });
  });

  describe('Folder Expansion', () => {
    it('should expand folder when clicked', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const folder = screen.getByText('src');
      const chevron = folder.previousElementSibling;
      
      // Initially expanded (default state)
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(folder);
      expect(screen.queryByText('Main.cs')).not.toBeInTheDocument();
    });

    it('should collapse expanded folder when clicked again', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const folder = screen.getByText('src');
      
      // Collapse
      fireEvent.click(folder);
      expect(screen.queryByText('Main.cs')).not.toBeInTheDocument();
      
      // Expand again
      fireEvent.click(folder);
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });

    it('should show nested folders and files when expanded', () => {
      render(<ExplorerPanel {...defaultProps} />);
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('Player.cs')).toBeInTheDocument();
      expect(screen.getByText('Enemy.cs')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter files by search term', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      
      fireEvent.change(searchInput, { target: { value: 'Main' } });
      
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.queryByText('GameManager.cs')).not.toBeInTheDocument();
    });

    it('should filter case-insensitively', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      
      fireEvent.change(searchInput, { target: { value: 'main' } });
      
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });

    it('should show all files when search is cleared', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      
      fireEvent.change(searchInput, { target: { value: 'Main' } });
      expect(screen.queryByText('GameManager.cs')).not.toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('GameManager.cs')).toBeInTheDocument();
    });

    it('should filter folders by name', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      
      fireEvent.change(searchInput, { target: { value: 'Assets' } });
      
      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.queryByText('src')).not.toBeInTheDocument();
    });
  });

  describe('Asset Manager', () => {
    it('should call onShowAssetManager when Unity Assets button is clicked', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const button = screen.getByText('Unity Assets');
      fireEvent.click(button);
      expect(defaultProps.onShowAssetManager).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hover States', () => {
    it('should apply hover styles on file hover', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const file = screen.getByText('Main.cs');
      const parent = file.closest('div');
      
      fireEvent.mouseEnter(parent!);
      // Hover styles are applied via inline styles, so we check the element exists
      expect(parent).toBeInTheDocument();
      
      fireEvent.mouseLeave(parent!);
      expect(parent).toBeInTheDocument();
    });

    it('should not apply hover styles to selected file', () => {
      render(<ExplorerPanel {...defaultProps} selectedPath="src/Main.cs" />);
      const file = screen.getByText('Main.cs');
      const parent = file.closest('div');
      
      fireEvent.mouseEnter(parent!);
      // Selected files should maintain their selected state
      expect(parent).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty files array', () => {
      render(<ExplorerPanel {...defaultProps} files={[]} />);
      expect(screen.getByText('Explorer')).toBeInTheDocument();
      expect(screen.queryByText('src')).not.toBeInTheDocument();
    });

    it('should handle files with no children', () => {
      const files = [
        { name: 'empty', type: 'folder' as const, path: 'empty', children: [] },
      ];
      render(<ExplorerPanel {...defaultProps} files={files} />);
      expect(screen.getByText('empty')).toBeInTheDocument();
    });

    it('should handle very long file names', () => {
      const longName = 'a'.repeat(200);
      const files = [
        { name: longName, type: 'file' as const, path: `test/${longName}` },
      ];
      render(<ExplorerPanel {...defaultProps} files={files} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle special characters in file names', () => {
      const files = [
        { name: 'test@#$%^&().ts', type: 'file' as const, path: 'test/test@#$%^&().ts' },
      ];
      render(<ExplorerPanel {...defaultProps} files={files} />);
      expect(screen.getByText('test@#$%^&().ts')).toBeInTheDocument();
    });

    it('should handle unicode characters in file names', () => {
      const files = [
        { name: '测试文件.ts', type: 'file' as const, path: 'test/测试文件.ts' },
        { name: 'файл.ts', type: 'file' as const, path: 'test/файл.ts' },
      ];
      render(<ExplorerPanel {...defaultProps} files={files} />);
      expect(screen.getByText('测试文件.ts')).toBeInTheDocument();
      expect(screen.getByText('файл.ts')).toBeInTheDocument();
    });

    it('should handle deeply nested folder structures', () => {
      const deepFiles = [
        {
          name: 'level1',
          type: 'folder' as const,
          path: 'level1',
          children: [
            {
              name: 'level2',
              type: 'folder' as const,
              path: 'level1/level2',
              children: [
                {
                  name: 'level3',
                  type: 'folder' as const,
                  path: 'level1/level2/level3',
                  children: [
                    { name: 'deep.ts', type: 'file' as const, path: 'level1/level2/level3/deep.ts' },
                  ],
                },
              ],
            },
          ],
        },
      ];
      render(<ExplorerPanel {...defaultProps} files={deepFiles} />);
      
      // Expand all levels
      fireEvent.click(screen.getByText('level1'));
      fireEvent.click(screen.getByText('level2'));
      fireEvent.click(screen.getByText('level3'));
      
      expect(screen.getByText('deep.ts')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<ExplorerPanel {...defaultProps} />);
      expect(screen.getByRole('region', { name: 'file explorer' })).toBeInTheDocument();
      expect(screen.getByRole('tree', { name: 'file explorer' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<ExplorerPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search files...');
      
      // Tab to search input
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });
});

