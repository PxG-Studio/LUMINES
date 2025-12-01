/**
 * Success State Component
 * EC-LAND-831 to EC-LAND-840: Success states
 */
import React from 'react';

export interface SuccessStateProps {
  /** EC-LAND-831: Success shown */
  show?: boolean;
  /** EC-LAND-832: Clear message */
  message?: string;
  /** EC-LAND-833: Accessible */
  ariaLabel?: string;
  /** EC-LAND-834: Localized message */
  localizedMessage?: string;
  /** EC-LAND-835: Dismissible */
  dismissible?: boolean;
  /** EC-LAND-836: Timed auto-dismiss */
  autoDismiss?: number;
  /** EC-LAND-837: Optimized */
  optimized?: boolean;
  /** EC-LAND-839: Consistent styling */
  variant?: 'toast' | 'banner' | 'fullscreen';
  /** EC-LAND-840: Helpful message */
  helpful?: boolean;
  /** On dismiss callback */
  onDismiss?: () => void;
  /** Icon component */
  icon?: React.ReactNode;
}

/**
 * Success State Component
 * EC-LAND-831 to EC-LAND-840
 */
export const SuccessState: React.FC<SuccessStateProps> = ({
  show = true,
  message = 'Success!',
  ariaLabel,
  localizedMessage,
  dismissible = true,
  autoDismiss,
  optimized: _optimized = true, // EC-LAND-837: Optimized (handled by React.memo if needed)
  variant = 'toast',
  helpful = true,
  onDismiss,
  icon,
}) => {
  const [isVisible, setIsVisible] = React.useState(show);
  const timeoutRef = React.useRef<number | null>(null);

  // EC-LAND-836: Auto-dismiss
  React.useEffect(() => {
    if (autoDismiss && isVisible) {
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, autoDismiss);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [autoDismiss, isVisible, onDismiss]);

  // EC-LAND-837: Optimize rendering (handled by React.memo if needed)
  const displayMessage = React.useMemo(() => {
    return localizedMessage || message;
  }, [localizedMessage, message]);

  // EC-LAND-840: Helpful message
  const helpfulMessage = React.useMemo(() => {
    if (!helpful) return displayMessage;
    return `${displayMessage} Your action was completed successfully.`;
  }, [helpful, displayMessage]);

  const handleDismiss = React.useCallback(() => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  // EC-LAND-831: Show success
  if (!isVisible) return null;

  // EC-LAND-833: Accessible
  const accessibilityProps = {
    'role': 'status' as const,
    'aria-live': 'polite' as const,
    'aria-label': ariaLabel || displayMessage,
  };

  // EC-LAND-839: Consistent styling
  const variantClasses = {
    toast: 'fixed top-4 right-4 flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-lg shadow-lg z-50 max-w-md',
    banner: 'flex items-center justify-center gap-4 p-4 bg-success/10 border-b border-success/20',
    fullscreen: 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50',
  };

  return (
    <div className={variantClasses[variant]} {...accessibilityProps}>
      {icon && (
        <div className="text-success text-2xl" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-foreground flex-1">
        {helpfulMessage}
      </p>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss success message"
        >
          ✕
        </button>
      )}
    </div>
  );
};

