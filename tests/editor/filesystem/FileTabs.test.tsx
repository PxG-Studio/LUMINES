/**
 * FileTabs Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FileTabs } from '../../../src/editor/filesystem/FileTabs';

describe('FileTabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileTabs />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FileTabs />);
    expect(container).toMatchSnapshot();
  });
});

