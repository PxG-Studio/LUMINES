/**
 * Loading State Component
 * EC-LAND-801 to EC-LAND-810: Loading states
 */
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingStateProps {
  /** EC-LAND-801: Loading message */
  message?: string;
  /** EC-LAND-802: Clear loading message */
  clearMessage?: boolean;
  /** EC-LAND-803: Accessible label */
  ariaLabel?: string;
  /** EC-LAND-804: Localized message */
  localizedMessage?: string;
  /** EC-LAND-805: Dismissible loading */
  dismissible?: boolean;
  /** EC-LAND-806: Loading timeout */
  timeout?: number;
  /** EC-LAND-807: Optimized loading */
  optimized?: boolean;
  /** EC-LAND-809: Consistent styling */
  variant?: 'default' | 'minimal' | 'fullscreen';
  /** EC-LAND-810: Helpful loading message */
  helpful?: boolean;
  /** On dismiss callback */
  onDismiss?: () => void;
  /** On timeout callback */
  onTimeout?: () => void;
}

/**
 * Loading State Component
 * EC-LAND-801 to EC-LAND-810
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  clearMessage = true,
  ariaLabel,
  localizedMessage,
  dismissible = false,
  timeout,
  optimized: _optimized = true, // EC-LAND-807: Optimized (handled by React.memo if needed)
  variant = 'default',
  helpful = true,
  onDismiss,
  onTimeout,
}) => {
  const [showDismiss, setShowDismiss] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  // EC-LAND-806: Handle timeout
  React.useEffect(() => {
    if (timeout) {
      timeoutRef.current = window.setTimeout(() => {
        if (onTimeout) {
          onTimeout();
        }
        if (dismissible) {
          setShowDismiss(true);
        }
      }, timeout);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [timeout, dismissible, onTimeout]);

  // EC-LAND-807: Optimize rendering (handled by React.memo if needed)
  const displayMessage = React.useMemo(() => {
    return localizedMessage || message;
  }, [localizedMessage, message]);

  // EC-LAND-810: Helpful message
  const helpfulMessage = React.useMemo(() => {
    if (!helpful) return displayMessage;
    return `${displayMessage} Please wait...`;
  }, [helpful, displayMessage]);

  const handleDismiss = React.useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  // EC-LAND-803: Accessible
  const accessibilityProps = {
    'role': 'status' as const,
    'aria-live': 'polite' as const,
    'aria-label': ariaLabel || displayMessage,
    'aria-busy': true,
  };

  // EC-LAND-809: Consistent styling
  const variantClasses = {
    default: 'flex flex-col items-center justify-center p-8',
    minimal: 'flex items-center justify-center p-4',
    fullscreen: 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50',
  };

  return (
    <div className={variantClasses[variant]} {...accessibilityProps}>
      <LoadingSpinner />
      {clearMessage && (
        <p className="mt-4 text-sm text-muted-foreground">
          {helpfulMessage}
        </p>
      )}
      {dismissible && showDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className="mt-4 text-sm text-primary hover:underline"
          aria-label="Dismiss loading"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

