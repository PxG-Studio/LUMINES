import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface GradientButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-disabled'?: boolean;
}

/**
 * GradientButton Component
 * EC-242: Fix loading state persistence
 * EC-256: Handle missing icon gracefully
 * EC-101, EC-102, EC-120: Accessibility improvements
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  onClick,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  'aria-disabled': ariaDisabled,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white
      shadow-[0_0_20px_rgba(102,126,234,0.5)] 
      hover:shadow-[0_0_30px_rgba(102,126,234,0.7)]
    `,
    secondary: `
      bg-white/5 border border-white/10 text-white/90
      hover:bg-white/10 hover:border-white/20
    `,
    ghost: `
      bg-transparent text-white/70
      hover:bg-white/5 hover:text-white
    `,
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${className}
      `}
      onClick={isDisabled ? undefined : onClick}
      whileHover={isDisabled ? {} : { scale: 1.05 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-disabled={isDisabled || ariaDisabled}
    >
      {/* Pulse animation for primary variant */}
      {variant === 'primary' && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2]"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content - EC-256: Handle missing icon gracefully */}
      <span className="relative flex items-center justify-center gap-inherit">
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true">{icon}</span>
        )}
      </span>
    </motion.button>
  );
};

