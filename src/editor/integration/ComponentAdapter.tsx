/**
 * Component Adapter
 * 
 * Utility for adapting mirror components to WISSIL
 * - WISSIL-FS integration
 * - SLATE design tokens
 * - TypeScript types
 */

import React from 'react';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
import { slateTokens } from '@/tokens/slate.tokens';

/**
 * Adapts a component to use WISSIL-FS
 */
export function withWissilFS<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { fs?: ReturnType<typeof useWissilFS> }> {
  return function WissilFSComponent(props: P & { fs?: ReturnType<typeof useWissilFS> }) {
    const fs = useWissilFS();
    return <Component {...props} fs={fs} />;
  };
}

/**
 * Adapts styling to use SLATE tokens
 */
export function adaptSlateStyles(styles: Record<string, any>): Record<string, any> {
  const adapted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'string') {
      // Replace common color values with SLATE tokens
      adapted[key] = value
        .replace(/#0A0A0A|#0f1115|#16181d/gi, slateTokens.colors.background.primary)
        .replace(/#1A1A1A|#16181d/gi, slateTokens.colors.background.secondary)
        .replace(/#2A2A2A/gi, slateTokens.colors.background.tertiary)
        .replace(/#FFFFFF|#e4e7eb/gi, slateTokens.colors.text.primary)
        .replace(/#9ba1aa|#9CA3AF/gi, slateTokens.colors.text.secondary);
    } else {
      adapted[key] = value;
    }
  }
  
  return adapted;
}

/**
 * Creates a component wrapper with WISSIL integration
 */
export function createWissilComponent<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    useFS?: boolean;
    useSlate?: boolean;
  }
): React.ComponentType<P> {
  const { useFS = true, useSlate = true } = options || {};
  
  return function WissilComponent(props: P) {
    const fs = useFS ? useWissilFS() : null;
    
    // Adapt props if needed
    const adaptedProps = {
      ...props,
      ...(useFS && fs ? { fs } : {}),
    };
    
    return <Component {...adaptedProps} />;
  };
}

