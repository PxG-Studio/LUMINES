/**
 * Error State Component
 * EC-LAND-821 to EC-LAND-830: Error states
 */
import React from 'react';
import { UserFriendlyError } from './UserFriendlyError';
import { GradientButton } from './GradientButton';

export interface ErrorStateProps {
  /** EC-LAND-821: Error shown */
  error?: Error | string | null;
  /** EC-LAND-822: Helpful message */
  message?: string;
  /** EC-LAND-823: Actionable retry */
  retryLabel?: string;
  /** EC-LAND-824: Accessible */
  ariaLabel?: string;
  /** EC-LAND-825: Localized message */
  localizedMessage?: string;
  /** EC-LAND-826: Consistent styling */
  variant?: 'default' | 'minimal' | 'full';
  /** EC-LAND-829: Contextual error */
  contextual?: boolean;
  /** EC-LAND-830: Recoverable */
  recoverable?: boolean;
  /** On retry callback */
  onRetry?: () => void;
  /** On dismiss callback */
  onDismiss?: () => void;
}

/**
 * Error State Component
 * EC-LAND-821 to EC-LAND-830
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  message,
  retryLabel = 'Retry',
  ariaLabel,
  localizedMessage,
  variant = 'default',
  contextual = true,
  recoverable = true,
  onRetry,
  onDismiss,
}) => {
  // EC-LAND-821: Show error
  if (!error && !message) return null;

  // EC-LAND-825: Localized message
  const displayMessage = React.useMemo(() => {
    if (localizedMessage) return localizedMessage;
    if (message) return message;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An error occurred';
  }, [localizedMessage, message, error]);

  // EC-LAND-824: Accessible
  const accessibilityProps = {
    'role': 'alert' as const,
    'aria-live': 'assertive' as const,
    'aria-label': ariaLabel || displayMessage,
  };

  // EC-LAND-826: Consistent styling
  const variantClasses = {
    default: 'flex flex-col items-center justify-center p-8 text-center',
    minimal: 'flex flex-col items-center justify-center p-4 text-center',
    full: 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50',
  };

  // EC-LAND-829: Contextual error
  const errorContext = React.useMemo(() => {
    if (!contextual) return undefined;
    return variant === 'full' ? 'Please try again or contact support if the problem persists.' : undefined;
  }, [contextual, variant]);

  return (
    <div className={variantClasses[variant]} {...accessibilityProps}>
      <UserFriendlyError
        error={error instanceof Error ? error : new Error(displayMessage)}
        context={errorContext}
      />
      {recoverable && onRetry && (
        <div className="mt-4 flex gap-4">
          <GradientButton
            onClick={onRetry}
            aria-label={retryLabel}
          >
            {retryLabel}
          </GradientButton>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
};

