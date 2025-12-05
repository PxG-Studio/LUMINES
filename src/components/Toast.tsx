import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { lumenForgeColors, transitions } from '../design-system/tokens';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    success: (message) => showToast('success', message, 3000),
    error: (message) => showToast('error', message, 7000),
    warning: (message) => showToast('warning', message, 5000),
    info: (message) => showToast('info', message, 4000),
    dismissToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: lumenForgeColors.status.success,
          bg: `${lumenForgeColors.status.success}20`,
          border: lumenForgeColors.status.success,
        };
      case 'error':
        return {
          icon: lumenForgeColors.status.error,
          bg: `${lumenForgeColors.status.error}20`,
          border: lumenForgeColors.status.error,
        };
      case 'warning':
        return {
          icon: lumenForgeColors.status.warning,
          bg: `${lumenForgeColors.status.warning}20`,
          border: lumenForgeColors.status.warning,
        };
      case 'info':
        return {
          icon: lumenForgeColors.accent.primary,
          bg: `${lumenForgeColors.accent.primary}20`,
          border: lumenForgeColors.accent.primary,
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        padding: '1rem',
        background: lumenForgeColors.background.secondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        animation: 'slideInRight 0.3s ease-out',
        pointerEvents: 'auto',
        minWidth: '300px',
      }}
    >
      <div style={{ color: colors.icon, flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.5',
            wordBreak: 'break-word',
          }}
        >
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          color: lumenForgeColors.text.tertiary,
          flexShrink: 0,
          transition: transitions.fast,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = lumenForgeColors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = lumenForgeColors.text.tertiary;
        }}
      >
        <X size={16} />
      </button>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
