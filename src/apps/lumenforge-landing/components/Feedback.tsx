/**
 * Feedback Component
 * EC-LAND-841 to EC-LAND-850: Feedback & Notifications
 */
import React from 'react';
import { useToast, Toast } from './Toast';
import { ToastContainer } from './Toast';

export interface FeedbackProps {
  /** EC-LAND-841: Feedback provided */
  show?: boolean;
  /** EC-LAND-842: Timely feedback */
  immediate?: boolean;
  /** EC-LAND-843: Clear feedback */
  clear?: boolean;
  /** EC-LAND-844: Accessible feedback */
  accessible?: boolean;
  /** EC-LAND-845: Localized feedback */
  localized?: boolean;
  /** EC-LAND-846: Dismissible feedback */
  dismissible?: boolean;
  /** EC-LAND-847: Prioritized feedback */
  priority?: 'low' | 'medium' | 'high' | 'critical';
  /** EC-LAND-849: Optimized feedback */
  optimized?: boolean;
  /** EC-LAND-850: Consistent feedback */
  consistent?: boolean;
}

/**
 * Feedback Component
 * EC-LAND-841 to EC-LAND-850
 */
export const Feedback: React.FC<FeedbackProps> = ({
  show = true,
  priority = 'medium',
  optimized = true,
  consistent = true,
}) => {
  const { toasts, dismissToast } = useToast();

  // EC-LAND-841: Show feedback
  if (!show || toasts.length === 0) return null;

  // EC-LAND-842: Immediate feedback (handled by Toast component)
  // EC-LAND-843: Clear feedback (handled by Toast component)
  // EC-LAND-844: Accessible feedback (handled by Toast component)
  // EC-LAND-845: Localized feedback (handled by Toast component)
  // EC-LAND-846: Dismissible feedback (handled by Toast component)
  // EC-LAND-847: Prioritized feedback
  const prioritizedToasts = React.useMemo(() => {
    if (!consistent) return toasts;

    // Sort by priority (higher priority first)
    // This is a simplified version - in a real app, you'd store priority in the Toast object
    return [...toasts]; // For now, maintain order
  }, [toasts, consistent, priority]);

  // EC-LAND-849: Optimize rendering
  const displayToasts = React.useMemo(() => {
    if (!optimized) return prioritizedToasts;
    // Limit to 5 toasts at a time
    return prioritizedToasts.slice(0, 5);
  }, [prioritizedToasts, optimized]);

  return (
    <ToastContainer
      toasts={displayToasts}
      onDismiss={dismissToast}
      position="top-right"
    />
  );
};

/**
 * Feedback Manager Hook
 * EC-LAND-841 to EC-LAND-850
 */
export function useFeedback() {
  const { showToast, dismissToast, success, error, warning, info } = useToast();

  // EC-LAND-842: Timely feedback
  const showImmediate = React.useCallback((message: string, type: Toast['type'] = 'info', duration?: number) => {
    return showToast(message, type, duration);
  }, [showToast]);

  // EC-LAND-843: Clear feedback
  const showClear = React.useCallback((message: string, type: Toast['type'] = 'info', duration?: number) => {
    const clearMessage = message.trim();
    return showToast(clearMessage, type, duration);
  }, [showToast]);

  // EC-LAND-844: Accessible feedback
  const showAccessible = React.useCallback((message: string, type: Toast['type'] = 'info', duration?: number) => {
    // Ensure message is accessible (no special characters that screen readers can't handle)
    const accessibleMessage = message.replace(/[^\w\s.,!?-]/g, '');
    return showToast(accessibleMessage, type, duration);
  }, [showToast]);

  // EC-LAND-845: Localized feedback
  const showLocalized = React.useCallback((message: string, type: Toast['type'] = 'info', duration?: number, _locale?: string) => {
    // In a real app, you'd translate the message here
    const localizedMessage = message; // Placeholder
    return showToast(localizedMessage, type, duration);
  }, [showToast]);

  // EC-LAND-847: Prioritized feedback
  const showPrioritized = React.useCallback((message: string, type: Toast['type'] = 'info', duration?: number, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    // Adjust duration based on priority
    const priorityDuration = priority === 'critical' ? 10000 : priority === 'high' ? 7000 : duration || 5000;
    return showToast(message, type, priorityDuration);
  }, [showToast]);

  return {
    showToast,
    dismissToast,
    success,
    error,
    warning,
    info,
    showImmediate,
    showClear,
    showAccessible,
    showLocalized,
    showPrioritized,
  };
}

