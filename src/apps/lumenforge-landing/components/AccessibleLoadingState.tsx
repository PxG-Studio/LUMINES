/**
 * Accessible Loading State Component
 * EC-LAND-269, EC-LAND-300, EC-LAND-353: Accessible loading states
 */
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ARIAManager } from '../utils/accessibility';

export interface AccessibleLoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const AccessibleLoadingState: React.FC<AccessibleLoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  // EC-LAND-269: Announce loading state to screen readers
  useEffect(() => {
    ARIAManager.announce(message, 'polite');
  }, [message]);

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm ${className}`}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" aria-hidden="true" />
          <p className="text-white text-sm font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" aria-hidden="true" />
      <span className="text-sm text-gray-300">{message}</span>
    </div>
  );
};

