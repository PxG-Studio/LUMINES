import React from 'react';
import { slateTokens, ColorSystem } from '@/tokens/slate.tokens';

export interface WISSILLayoutProps {
  children: React.ReactNode;
  system: ColorSystem;
  title?: string;
  description?: string;
  showHeader?: boolean;
  className?: string;
}

/**
 * WISSILLayout Component
 *
 * Universal layout wrapper for all WISSIL subsystem pages.
 * Provides consistent structure, theming, and accessibility.
 */
export const WISSILLayout: React.FC<WISSILLayoutProps> = ({
  children,
  system,
  title,
  description,
  showHeader = false,
  className = '',
}) => {
  const systemColors = slateTokens.colors[system];
  const isPrimary = 'primary' in systemColors;

  return (
    <div
      className={`min-h-screen bg-background-primary ${className}`}
      data-system={system}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: isPrimary ? systemColors.gradient : 'transparent',
          }}
        />

        {/* Animated Orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float"
          style={{
            backgroundColor: isPrimary ? systemColors.primary : 'transparent',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{
            backgroundColor: isPrimary ? systemColors.secondary : 'transparent',
            animationDelay: '3s',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Optional Header */}
        {showHeader && (title || description) && (
          <header className="container mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto text-center">
              {title && (
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
                  style={{
                    backgroundImage: isPrimary ? systemColors.gradient : 'linear-gradient(90deg, #fff, #fff)',
                  }}
                >
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>

      {/* System Badge (Development Helper) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="fixed bottom-4 right-4 px-4 py-2 rounded-lg text-xs font-mono font-semibold shadow-lg z-50"
          style={{
            backgroundColor: isPrimary ? systemColors.primary : '#6366F1',
            color: '#fff',
          }}
        >
          {system.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default WISSILLayout;
