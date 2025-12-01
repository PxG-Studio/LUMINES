/**
 * Error Handling Hooks
 * EC-LAND-601 to EC-LAND-650: Error handling hooks
 */
import { useState, useCallback, useEffect } from 'react';
import {
  ErrorLogger,
  UserFriendlyErrors,
  ErrorRecoveryManager,
  ValidationErrorHandler,
  APIErrorHandler,
  AsyncErrorHandler,
} from '../utils/error-handling';

/**
 * Hook for error logging
 * EC-LAND-631
 */
export function useErrorLogging() {
  const [errors, setErrors] = useState<Array<{ error: Error; timestamp: string }>>([]);

  const logError = useCallback((error: Error, context?: any) => {
    ErrorLogger.log(error, context);
    setErrors(prev => [...prev, { error, timestamp: new Date().toISOString() }]);
  }, []);

  const clearLog = useCallback(() => {
    ErrorLogger.clearLog();
    setErrors([]);
  }, []);

  return { errors, logError, clearLog };
}

/**
 * Hook for user-friendly error messages
 * EC-LAND-611 to EC-LAND-620
 */
export function useUserFriendlyError() {
  const getMessage = useCallback((error: Error | string, context?: string) => {
    return UserFriendlyErrors.getMessage(error, context);
  }, []);

  const isDismissible = useCallback((error: Error) => {
    return UserFriendlyErrors.isDismissible(error);
  }, []);

  return { getMessage, isDismissible };
}

/**
 * Hook for error recovery
 * EC-LAND-621 to EC-LAND-630
 */
export function useErrorRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<Error | null>(null);

  const autoRecover = useCallback(async (error: Error, recoveryFn: () => Promise<void>) => {
    setIsRecovering(true);
    setRecoveryError(null);

    try {
      const success = await ErrorRecoveryManager.autoRecover(error, recoveryFn);
      if (!success) {
        setRecoveryError(error);
      }
      return success;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  const userRecover = useCallback(async (recoveryFn: () => Promise<void>) => {
    setIsRecovering(true);
    setRecoveryError(null);

    try {
      const result = await ErrorRecoveryManager.userRecover(recoveryFn);
      if (!result.success && result.error) {
        setRecoveryError(result.error);
      }
      return result.success;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  return { autoRecover, userRecover, isRecovering, recoveryError };
}

/**
 * Hook for validation errors
 * EC-LAND-641 to EC-LAND-650
 */
export function useValidationErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = useCallback((fieldId: string, message: string) => {
    setErrors(prev => ({ ...prev, [fieldId]: message }));
    
    const field = document.getElementById(fieldId);
    if (field) {
      ValidationErrorHandler.showError(fieldId, message, field);
    }
  }, []);

  const clearError = useCallback((fieldId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    ValidationErrorHandler.clearError(fieldId);
  }, []);

  const clearAll = useCallback(() => {
    Object.keys(errors).forEach(fieldId => {
      ValidationErrorHandler.clearError(fieldId);
    });
    setErrors({});
  }, [errors]);

  return { errors, setError, clearError, clearAll };
}

/**
 * Hook for API error handling
 * EC-LAND-651 to EC-LAND-660
 */
export function useAPIError() {
  const handleError = useCallback((error: any) => {
    return APIErrorHandler.handle(error);
  }, []);

  return { handleError };
}

/**
 * Hook for async error handling
 * EC-LAND-671 to EC-LAND-680
 */
export function useAsyncError() {
  const wrapAsync = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T
  ): T => {
    return AsyncErrorHandler.wrapAsync(fn);
  }, []);

  return { wrapAsync };
}

/**
 * Hook for error monitoring
 * EC-LAND-631 to EC-LAND-640
 */
export function useErrorMonitoring() {
  const [errorFrequency, setErrorFrequency] = useState(0);
  const [trends, setTrends] = useState<{
    mostCommon: string;
    frequency: number;
    recentErrors: number;
  } | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const log = ErrorLogger.getLog();
      if (log.length > 0) {
        const lastError = log[log.length - 1];
        const frequency = ErrorLogger.getErrorFrequency(
          lastError.error.message,
          60000
        );
        setErrorFrequency(frequency);
      }

      const errorTrends = ErrorLogger.analyzeTrends();
      setTrends(errorTrends);
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { errorFrequency, trends };
}

