/**
 * Empty State Component
 * EC-LAND-811 to EC-LAND-820: Empty states
 */
import React from 'react';
import { GradientButton } from './GradientButton';

export interface EmptyStateProps {
  /** EC-LAND-811: Empty state shown */
  show?: boolean;
  /** EC-LAND-812: Helpful message */
  message?: string;
  /** EC-LAND-813: Actionable CTA */
  actionLabel?: string;
  /** EC-LAND-814: Accessible */
  ariaLabel?: string;
  /** EC-LAND-815: Localized message */
  localizedMessage?: string;
  /** EC-LAND-816: Consistent styling */
  variant?: 'default' | 'minimal' | 'illustrated';
  /** EC-LAND-819: Contextual message */
  contextual?: boolean;
  /** EC-LAND-820: Recoverable */
  recoverable?: boolean;
  /** On action callback */
  onAction?: () => void;
  /** Icon component */
  icon?: React.ReactNode;
}

/**
 * Empty State Component
 * EC-LAND-811 to EC-LAND-820
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  show = true,
  message = 'No data available',
  actionLabel,
  ariaLabel,
  localizedMessage,
  variant = 'default',
  contextual = true,
  recoverable = true,
  onAction,
  icon,
}) => {
  // EC-LAND-815: Localized message
  const displayMessage = React.useMemo(() => {
    return localizedMessage || message;
  }, [localizedMessage, message]);

  // EC-LAND-819: Contextual message
  const contextualMessage = React.useMemo(() => {
    if (!contextual) return displayMessage;
    return `${displayMessage} Try refreshing or adjusting your filters.`;
  }, [contextual, displayMessage]);

  // EC-LAND-811: Show empty state
  if (!show) return null;

  // EC-LAND-814: Accessible
  const accessibilityProps = {
    'role': 'status' as const,
    'aria-live': 'polite' as const,
    'aria-label': ariaLabel || displayMessage,
  };

  // EC-LAND-816: Consistent styling
  const variantClasses = {
    default: 'flex flex-col items-center justify-center p-8 text-center',
    minimal: 'flex flex-col items-center justify-center p-4 text-center',
    illustrated: 'flex flex-col items-center justify-center p-12 text-center',
  };

  return (
    <div className={variantClasses[variant]} {...accessibilityProps}>
      {icon && (
        <div className="mb-4 text-4xl text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-foreground mb-2">
        {contextualMessage}
      </p>
      {recoverable && actionLabel && onAction && (
        <div className="mt-4">
          <GradientButton
            onClick={onAction}
            aria-label={actionLabel}
          >
            {actionLabel}
          </GradientButton>
        </div>
      )}
    </div>
  );
};

