import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Panel } from '../design-system/components/Panel';
import { lumenForgeColors } from '../design-system/tokens';
import { logError } from '../lib/errors/ErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    logError({
      error,
      errorInfo,
      context: {
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      },
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: lumenForgeColors.background.primary,
            padding: '2rem',
          }}
        >
          <Panel variant="glass" padding="lg" style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <AlertTriangle
                size={48}
                style={{
                  color: lumenForgeColors.status.error,
                  marginBottom: '1rem',
                }}
              />
              <h2
                style={{
                  color: lumenForgeColors.text.primary,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  margin: 0,
                }}
              >
                Something went wrong
              </h2>
              <p
                style={{
                  color: lumenForgeColors.text.secondary,
                  fontSize: '0.875rem',
                  margin: '0.5rem 0 0 0',
                }}
              >
                An unexpected error occurred. Your work has been saved.
              </p>
            </div>

            {this.state.error && import.meta.env.DEV && (
              <details
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: lumenForgeColors.background.tertiary,
                  borderRadius: '0.375rem',
                  border: `1px solid ${lumenForgeColors.border.subtle}`,
                }}
              >
                <summary
                  style={{
                    color: lumenForgeColors.text.secondary,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  Error Details (Development Mode)
                </summary>
                <pre
                  style={{
                    fontSize: '0.75rem',
                    color: lumenForgeColors.status.error,
                    overflow: 'auto',
                    maxHeight: '200px',
                    fontFamily: 'monospace',
                    margin: '0.5rem 0 0 0',
                    padding: '0.5rem',
                    background: lumenForgeColors.background.primary,
                    borderRadius: '0.25rem',
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
                  color: lumenForgeColors.text.primary,
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: lumenForgeColors.background.tertiary,
                  color: lumenForgeColors.text.primary,
                  border: `1px solid ${lumenForgeColors.border.subtle}`,
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <Home size={16} />
                Go Home
              </button>
            </div>
          </Panel>
        </div>
      );
    }

    return this.props.children;
  }
}
