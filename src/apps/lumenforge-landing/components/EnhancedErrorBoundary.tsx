/**
 * Enhanced Error Boundary Component
 * EC-LAND-601 to EC-LAND-610: Enhanced error boundaries
 */
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ErrorBoundaryManager, UserFriendlyErrors, ErrorRecoveryManager } from '../utils/error-handling';
import { GradientButton } from './GradientButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  boundaryId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private boundaryId: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.boundaryId = props.boundaryId || `error-boundary-${Math.random().toString(36).substr(2, 9)}`;
  }

  // EC-LAND-601, EC-LAND-605: Catch render errors
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  // EC-LAND-603, EC-LAND-604: Catch async and event handler errors
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // EC-LAND-606: Log error
    ErrorBoundaryManager.registerError(this.boundaryId, error, errorInfo);

    // EC-LAND-610: Report to monitoring
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  // EC-LAND-608: Recovery handler
  handleRecovery = async () => {
    const { error } = this.state;
    if (!error) return;

    const recovered = await ErrorRecoveryManager.autoRecover(error, async () => {
      // Attempt to recover by resetting state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });

    if (!recovered) {
      // EC-LAND-622: User-initiated recovery
      const result = await ErrorRecoveryManager.userRecover(async () => {
        window.location.reload();
      });

      if (!result.success) {
        console.error('Recovery failed:', result.error);
      }
    }
  };

  // EC-LAND-609: Reset state
  handleReset = () => {
    ErrorBoundaryManager.clearError(this.boundaryId);
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // EC-LAND-607: Show fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      const userMessage = error
        ? UserFriendlyErrors.getMessage(error)
        : 'Something went wrong';

      const isRecoverable = error
        ? ErrorBoundaryManager.isRecoverable(error)
        : false;

      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gray-900 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
            <AlertTriangle
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-300 mb-6">{userMessage}</p>

            <div className="flex flex-col gap-3">
              {isRecoverable && (
                <GradientButton
                  onClick={this.handleRecovery}
                  icon={<RefreshCw className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Try Again
                </GradientButton>
              )}

              <GradientButton
                onClick={this.handleReset}
                variant="secondary"
                icon={<RefreshCw className="w-4 h-4" />}
                iconPosition="left"
              >
                Reset
              </GradientButton>

              <GradientButton
                onClick={() => (window.location.href = '/')}
                variant="ghost"
                icon={<Home className="w-4 h-4" />}
                iconPosition="left"
              >
                Go Home
              </GradientButton>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto bg-gray-900 p-4 rounded">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

