/**
 * Unit Tests for ErrorBoundary Component
 * Target: 10-15 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, AsyncErrorFallback } from '../ErrorBoundary';
import React from 'react';

// Component that throws error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary Component', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display fallback', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should display custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should call onError callback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should show error details when available', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const details = screen.getByText(/Error details/i);
    expect(details).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should allow resetting error state', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const resetButton = screen.getByText(/Try Again/i);
    fireEvent.click(resetButton);

    // Re-render without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should display component stack in error details', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const details = screen.getByText(/Error details/i);
    fireEvent.click(details);

    // Error details should be expanded
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});

describe('AsyncErrorFallback Component', () => {
  it('should render error message', () => {
    const error = new Error('Async error');
    const resetErrorBoundary = vi.fn();

    render(
      <AsyncErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    );

    expect(screen.getByText('Async error')).toBeInTheDocument();
  });

  it('should call resetErrorBoundary on retry', () => {
    const error = new Error('Async error');
    const resetErrorBoundary = vi.fn();

    render(
      <AsyncErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    );

    const retryButton = screen.getByText(/Retry/i);
    fireEvent.click(retryButton);

    expect(resetErrorBoundary).toHaveBeenCalled();
  });

  it('should display appropriate error UI', () => {
    const error = new Error('Failed to load');
    const resetErrorBoundary = vi.fn();

    render(
      <AsyncErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    expect(screen.getByText(/Retry/i)).toBeInTheDocument();
  });
});

