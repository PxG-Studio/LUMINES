/**
 * SLATE Design Tokens
 * LumenForge Design System
 *
 * Provides centralized design tokens for all WISSIL subsystems
 * Following Atomic Design principles and LumenForge design system
 *
 * Primary Colors: Amber (#F5B914), Cyan (#47E0FF), Purple (#A64DFF), Orange (#FF6B35)
 */

export const slateTokens = {
  // Color Palette (Luminera Design System)
  colors: {
    // System Colors
    landing: {
      primary: '#F5B914', // Amber
      secondary: '#47E0FF', // Cyan
      accent: '#A64DFF', // Purple
      gradient: 'linear-gradient(135deg, #F5B914 0%, #47E0FF 50%, #A64DFF 100%)',
    },
    waypoint: {
      primary: '#A64DFF', // Purple (Unity Visual Scripting)
      secondary: '#47E0FF', // Cyan
      accent: '#F5B914', // Amber
      gradient: 'linear-gradient(135deg, #A64DFF 0%, #47E0FF 100%)',
    },
    spark: {
      primary: '#47E0FF', // Cyan (IDE Experience)
      secondary: '#F5B914', // Amber
      accent: '#A64DFF', // Purple
      gradient: 'linear-gradient(135deg, #47E0FF 0%, #F5B914 100%)',
    },
    slate: {
      primary: '#A64DFF', // Purple (Workspace & Identity)
      secondary: '#47E0FF', // Cyan
      accent: '#F5B914', // Amber
      gradient: 'linear-gradient(135deg, #A64DFF 0%, #47E0FF 100%)',
    },
    ignis: {
      primary: '#FF6B35', // Orange (API Backend)
      secondary: '#F5B914', // Amber
      accent: '#47E0FF', // Cyan
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F5B914 100%)',
    },
    ignition: {
      primary: '#F5B914', // Amber (Project Bootstrap)
      secondary: '#FF6B35', // Orange
      accent: '#A64DFF', // Purple
      gradient: 'linear-gradient(135deg, #F5B914 0%, #FF6B35 100%)',
    },
    // Base Colors
    background: {
      primary: '#0A0A0A',
      secondary: '#1A1A1A',
      tertiary: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  // Typography
  typography: {
      fontFamily: {
        sans: 'Inter, system-ui, -apple-system, sans-serif',
        mono: 'Fira Code, JetBrains Mono, Consolas, monospace',
        display: 'Inter, sans-serif',
      },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem',     // 128px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    none: 'none',
    // Glow effects for WISSIL systems
    glow: {
      landing: '0 0 20px rgba(255, 215, 0, 0.5)',
      slate: '0 0 20px rgba(99, 102, 241, 0.5)',
      ignition: '0 0 20px rgba(239, 68, 68, 0.5)',
      spark: '0 0 20px rgba(251, 191, 36, 0.5)',
      ignis: '0 0 20px rgba(255, 107, 53, 0.5)',
      waypoint: '0 0 20px rgba(16, 185, 129, 0.5)',
    },
  },

  // Animation
  animation: {
    duration: {
      instant: '75ms',
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '700ms',
      slowest: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

// Type exports
export type SlateTokens = typeof slateTokens;
export type ColorSystem = keyof typeof slateTokens.colors;

// Helper function to get system colors
export function getSystemColors(system: ColorSystem) {
  return slateTokens.colors[system];
}

// Helper function to get system gradient
export function getSystemGradient(system: ColorSystem) {
  const systemColors = slateTokens.colors[system];
  return 'gradient' in systemColors ? systemColors.gradient : '';
}

// Helper function to get system glow
export function getSystemGlow(system: ColorSystem) {
  return slateTokens.shadows.glow[system] || slateTokens.shadows.none;
}
