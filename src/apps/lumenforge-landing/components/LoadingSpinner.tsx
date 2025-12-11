/**
 * LoadingSpinner Component
 * EC-019, EC-021, EC-022: Loading states and feedback
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <Loader2 className={`${sizeClasses[size]} text-[#F5B914]`} />
      </motion.div>
      {text && (
        <p className="text-white/70 text-sm" aria-label={text}>
          {text}
        </p>
      )}
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center z-[200]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

