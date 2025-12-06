/**
 * AppShell Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppShell } from '../../../src/editor/shell/AppShell';

describe('AppShell', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    expect(container).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    expect(container).toMatchSnapshot();
  });

  it('shows sidebar when sidebarVisible is true', () => {
    const { container } = render(
      <AppShell sidebarVisible={true} sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </AppShell>
    );
    expect(container).toBeTruthy();
  });

  it('hides sidebar when sidebarVisible is false', () => {
    const { container } = render(
      <AppShell sidebarVisible={false} sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </AppShell>
    );
    expect(container).toBeTruthy();
  });

  it('renders in fullscreen mode', () => {
    const { container } = render(
      <AppShell fullscreen={true}>
        <div>Content</div>
      </AppShell>
    );
    expect(container).toBeTruthy();
  });
});

