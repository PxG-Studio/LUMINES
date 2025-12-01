/**
 * FilePreview Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FilePreview } from '../../../src/editor/filesystem/FilePreview';

describe('FilePreview', () => {
  it('renders without crashing', () => {
    const { container } = render(<FilePreview />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FilePreview />);
    expect(container).toMatchSnapshot();
  });

  it('displays file content', () => {
    const content = 'function test() { return true; }';
    const { getByText } = render(<FilePreview content={content} />);
    expect(getByText(content)).toBeTruthy();
  });

  it('displays file name', () => {
    const { getByText } = render(<FilePreview fileName="test.json" />);
    expect(getByText(/test\.json/)).toBeTruthy();
  });

  it('displays language', () => {
    const { getByText } = render(<FilePreview language="typescript" fileName="test.ts" />);
    expect(getByText(/typescript/)).toBeTruthy();
  });
});

