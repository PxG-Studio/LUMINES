/**
 * Mobile Accessible Component Wrapper
 * EC-LAND-361 to EC-LAND-370: Mobile accessibility
 */
import React from 'react';
import { isMobileDevice } from '../utils/performance';

export interface MobileAccessibleComponentProps {
  children: React.ReactNode;
  minTouchTarget?: number; // Minimum touch target size in pixels (default: 44)
  className?: string;
}

/**
 * Wrapper component that ensures mobile accessibility
 * EC-LAND-361, EC-LAND-362
 */
export const MobileAccessibleComponent: React.FC<MobileAccessibleComponentProps> = ({
  children,
  minTouchTarget = 44, // WCAG minimum
  className = '',
}) => {
  const isMobile = isMobileDevice();

  const mobileStyles: React.CSSProperties = isMobile
    ? {
        minWidth: `${minTouchTarget}px`,
        minHeight: `${minTouchTarget}px`,
        padding: '8px', // Ensure adequate spacing
      }
    : {};

  return (
    <div className={className} style={mobileStyles}>
      {children}
    </div>
  );
};

/**
 * Accessible Touch Target Component
 * EC-LAND-361, EC-LAND-362
 */
export const AccessibleTouchTarget: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  minSize?: number;
  className?: string;
  ariaLabel?: string;
}> = ({ children, onClick, minSize = 44, className = '', ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
        padding: '8px',
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

