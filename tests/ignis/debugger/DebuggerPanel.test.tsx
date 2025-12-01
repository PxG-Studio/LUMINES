/**
 * DebuggerPanel Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DebuggerPanel } from '../../../src/ignis/debugger/DebuggerPanel';

describe('DebuggerPanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<DebuggerPanel />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<DebuggerPanel />);
    expect(container).toMatchSnapshot();
  });

  it('shows empty state when no logs', () => {
    const { getByText } = render(<DebuggerPanel />);
    expect(getByText(/No execution logs/)).toBeTruthy();
  });

  it('displays active node ID', () => {
    const { getByText } = render(<DebuggerPanel activeNodeId="node1" />);
    expect(getByText('node1')).toBeTruthy();
  });

  it('displays logs', () => {
    const logs = ['Log 1', 'Log 2'];
    const { getByText } = render(<DebuggerPanel logs={logs} />);
    expect(getByText('Log 1')).toBeTruthy();
    expect(getByText('Log 2')).toBeTruthy();
  });
});

