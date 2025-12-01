/**
 * ErrorMessage Component
 * EC-025, EC-026: User-friendly error messages
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  autoDismiss?: boolean;
  dismissAfter?: number;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  type = 'error',
  autoDismiss = false,
  dismissAfter = 5000,
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, isVisible, onDismiss]);

  const typeStyles = {
    error: 'bg-red-500/90 text-white border-red-400',
    warning: 'bg-amber-500/90 text-white border-amber-400',
    info: 'bg-blue-500/90 text-white border-blue-400',
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 right-4 z-[200] px-4 py-3 rounded-lg shadow-lg border ${typeStyles[type]} ${className} max-w-md`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          {onDismiss && (
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
              className="flex-shrink-0 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 rounded"
              aria-label="Dismiss error message"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

