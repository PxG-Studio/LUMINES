/**
 * ThemeProvider Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../../src/theme/ThemeProvider';

const TestComponent = () => {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
};

describe('ThemeProvider', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('provides default dark theme', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('theme').textContent).toBe('dark');
  });

  it('provides light theme when specified', () => {
    const { getByTestId } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('theme').textContent).toBe('light');
  });

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Child Content</div>
      </ThemeProvider>
    );
    expect(getByText('Child Content')).toBeTruthy();
  });
});

