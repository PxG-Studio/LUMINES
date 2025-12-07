import React from 'react';
import { lumenForgeColors, borderRadius, shadows, transitions } from '../tokens';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glowOnHover?: boolean;
  style?: React.CSSProperties;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  variant = 'primary',
  padding = 'md',
  glowOnHover = false,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: 'rgba(28, 36, 80, 0.4)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${lumenForgeColors.border.subtle}`,
        };
      case 'secondary':
        return {
          background: `linear-gradient(145deg, ${lumenForgeColors.background.secondary} 0%, ${lumenForgeColors.background.primary} 100%)`,
          border: `1px solid ${lumenForgeColors.border.primary}`,
        };
      case 'primary':
      default:
        return {
          background: `linear-gradient(145deg, ${lumenForgeColors.background.secondary} 0%, ${lumenForgeColors.background.primary} 100%)`,
          border: `1px solid ${lumenForgeColors.accent.primary}`,
        };
    }
  };

  const getPaddingValue = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '0.5rem';
      case 'lg':
        return '1.5rem';
      case 'md':
      default:
        return '1rem';
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      className={className}
      style={{
        ...variantStyles,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.glow,
        padding: getPaddingValue(),
        transition: transitions.normal,
        ...(glowOnHover && {
          cursor: 'pointer',
        }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (glowOnHover) {
          e.currentTarget.style.boxShadow = shadows.glowStrong;
        }
      }}
      onMouseLeave={(e) => {
        if (glowOnHover) {
          e.currentTarget.style.boxShadow = shadows.glow;
        }
      }}
    >
      {children}
    </div>
  );
};
