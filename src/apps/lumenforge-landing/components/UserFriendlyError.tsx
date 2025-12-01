/**
 * User-Friendly Error Component
 * EC-LAND-611 to EC-LAND-620: User-friendly error display
 */
import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { UserFriendlyErrors } from '../utils/error-handling';
import { ARIAManager } from '../utils/accessibility';

export interface UserFriendlyErrorProps {
  error: Error | string;
  context?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number;
  className?: string;
}

export const UserFriendlyError: React.FC<UserFriendlyErrorProps> = ({
  error,
  context,
  onDismiss,
  onRetry,
  autoDismiss = false,
  dismissAfter = 5000,
  className = '',
}) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const message = UserFriendlyErrors.getMessage(errorObj, context);
  const isDismissible = UserFriendlyErrors.isDismissible(errorObj);

  // EC-LAND-615: Auto dismiss
  React.useEffect(() => {
    if (autoDismiss && isDismissible && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, isDismissible, dismissAfter, onDismiss]);

  // EC-LAND-614: Announce error to screen readers
  React.useEffect(() => {
    ARIAManager.announce(message, 'assertive');
  }, [message]);

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-300">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            aria-label="Retry operation"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            Try Again
          </button>
        )}
      </div>
      {isDismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-red-400 hover:text-red-300 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

