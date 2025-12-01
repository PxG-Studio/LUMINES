/**
 * FileTree Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { FileTree } from '../../../src/editor/filesystem/FileTree';

describe('FileTree', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileTree />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FileTree />);
    expect(container).toMatchSnapshot();
  });

  it('renders files and folders', () => {
    const files = [
      { name: 'Blueprints', type: 'folder' as const, children: [] },
      { name: 'file.json', type: 'file' as const },
    ];
    const { getByText } = render(<FileTree files={files} />);
    expect(getByText('Blueprints')).toBeTruthy();
    expect(getByText('file.json')).toBeTruthy();
  });

  it('expands folder on click', () => {
    const files = [
      {
        name: 'Blueprints',
        type: 'folder' as const,
        path: '/Blueprints',
        children: [{ name: 'file.json', type: 'file' as const, path: '/Blueprints/file.json' }],
      },
    ];
    const { getByText } = render(<FileTree files={files} />);
    const folder = getByText('Blueprints');
    fireEvent.click(folder);
    expect(getByText('file.json')).toBeTruthy();
  });

  it('collapses folder on second click', () => {
    const files = [
      {
        name: 'Blueprints',
        type: 'folder' as const,
        path: '/Blueprints',
        children: [{ name: 'file.json', type: 'file' as const, path: '/Blueprints/file.json' }],
      },
    ];
    const { getByText, queryByText } = render(<FileTree files={files} defaultExpanded={['/Blueprints']} />);
    const folder = getByText('Blueprints');
    fireEvent.click(folder);
    expect(queryByText('file.json')).toBeFalsy();
  });

  it('calls onFileSelect when file is clicked', () => {
    const files = [{ name: 'file.json', type: 'file' as const, path: '/file.json' }];
    const onFileSelect = vi.fn();
    const { getByText } = render(<FileTree files={files} onFileSelect={onFileSelect} />);
    fireEvent.click(getByText('file.json'));
    expect(onFileSelect).toHaveBeenCalledWith('/file.json');
  });

  it('renders nested folder structure', () => {
    const files = [
      {
        name: 'Assets',
        type: 'folder' as const,
        path: '/Assets',
        children: [
          {
            name: 'Sprites',
            type: 'folder' as const,
            path: '/Assets/Sprites',
            children: [],
          },
        ],
      },
    ];
    const { getByText } = render(<FileTree files={files} defaultExpanded={['/Assets']} />);
    expect(getByText('Sprites')).toBeTruthy();
  });
});

