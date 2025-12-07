import { useCallback } from 'react';
import { useToast } from '../components/Toast';
import { ErrorHandler } from '../lib/errors/ErrorHandler';

export interface UseErrorHandlerOptions {
  projectId?: string;
  userId?: string;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const toast = useToast();

  const handleError = useCallback(
    async (error: Error, context?: Record<string, any>) => {
      await ErrorHandler.handleError(error, {
        projectId: options.projectId,
        userId: options.userId,
        metadata: context,
      });

      const userMessage = ErrorHandler.getUserMessage(error);
      toast.error(userMessage);

      options.onError?.(error);
    },
    [options.projectId, options.userId, options.onError, toast]
  );

  const showSuccess = useCallback(
    (message: string) => {
      toast.success(message);
    },
    [toast]
  );

  const showWarning = useCallback(
    (message: string) => {
      toast.warning(message);
    },
    [toast]
  );

  const showInfo = useCallback(
    (message: string) => {
      toast.info(message);
    },
    [toast]
  );

  return {
    handleError,
    showSuccess,
    showWarning,
    showInfo,
  };
}

/**
 * Hook for async operations with error handling
 */
export function useAsyncError<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseErrorHandlerOptions & {
    onSuccess?: (data: T) => void;
    showSuccessToast?: boolean;
    successMessage?: string;
  } = {}
) {
  const { handleError, showSuccess } = useErrorHandler(options);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        const result = await asyncFunction(...args);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        if (options.showSuccessToast && options.successMessage) {
          showSuccess(options.successMessage);
        }

        return result;
      } catch (error) {
        await handleError(error as Error);
        return null;
      }
    },
    [asyncFunction, options, handleError, showSuccess]
  );

  return execute;
}
