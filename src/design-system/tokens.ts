export const lumenForgeColors = {
  background: {
    primary: '#0F0F14',
    secondary: '#1C2450',
    tertiary: '#1A1D2E',
  },
  accent: {
    primary: '#2D7FF9',
    secondary: '#42D8E8',
    tertiary: '#5B9FFF',
  },
  text: {
    primary: '#E6E7EB',
    secondary: '#BFC2CA',
    tertiary: '#8B8D98',
  },
  border: {
    primary: '#2D7FF9',
    secondary: '#42D8E8',
    subtle: '#2A2D3A',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
} as const;

export const borderRadius = {
  sm: '0.375rem',
  md: '0.75rem',
  lg: '0.875rem',
  xl: '1rem',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(45, 127, 249, 0.05)',
  md: '0 4px 6px -1px rgba(45, 127, 249, 0.1)',
  lg: '0 10px 15px -3px rgba(45, 127, 249, 0.15)',
  glow: '0 0 12px rgba(45, 127, 249, 0.2)',
  glowStrong: '0 0 20px rgba(45, 127, 249, 0.3)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;
