/**
 * Accessible Error Message Component
 * EC-LAND-351, EC-LAND-352, EC-LAND-268: Accessible error messages
 */
import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ARIAManager } from '../utils/accessibility';

export interface AccessibleErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  autoDismiss?: boolean;
  dismissAfter?: number;
  associatedFieldId?: string;
}

export const AccessibleErrorMessage: React.FC<AccessibleErrorMessageProps> = ({
  message,
  onDismiss,
  type = 'error',
  autoDismiss = false,
  dismissAfter = 5000,
  associatedFieldId,
}) => {
  // EC-LAND-268, EC-LAND-351: Announce error to screen readers
  useEffect(() => {
    ARIAManager.announce(message, 'assertive');
  }, [message]);

  // EC-LAND-268: Associate with form field if provided
  useEffect(() => {
    if (associatedFieldId) {
      const field = document.getElementById(associatedFieldId);
      const errorElement = document.getElementById(`error-${associatedFieldId}`);
      
      if (field && errorElement) {
        ARIAManager.associateErrorMessage(field, errorElement);
      }
    }
  }, [associatedFieldId]);

  // Auto dismiss
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  const typeStyles = {
    error: 'bg-red-900/20 border-red-500/50 text-red-300',
    warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-300',
    info: 'bg-blue-900/20 border-blue-500/50 text-blue-300',
  };

  return (
    <div
      id={associatedFieldId ? `error-${associatedFieldId}` : undefined}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`flex items-start gap-3 p-4 rounded-lg border ${typeStyles[type]}`}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-current hover:opacity-70 transition-opacity"
          aria-label="Dismiss error message"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

