/**
 * Accessible Editor Wrapper
 * 
 * Wraps editor components with accessibility features
 * ARIA labels, keyboard navigation, screen reader support
 */

'use client';

import React, { useRef, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import { useKeyboardNavigation } from './KeyboardNavigation';

export interface AccessibleEditorProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  shortcuts?: Array<{
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
  }>;
  trapFocus?: boolean;
}

export const AccessibleEditor: React.FC<AccessibleEditorProps> = ({
  children,
  label = 'Code Editor',
  description,
  shortcuts = [],
  trapFocus = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useKeyboardNavigation({
    shortcuts: shortcuts.map((s) => ({
      ...s,
      description: `${s.key}${s.ctrl ? '+Ctrl' : ''}${s.shift ? '+Shift' : ''}${s.alt ? '+Alt' : ''}`,
    })),
    enabled: true,
  });

  // Announce changes to screen readers
  useEffect(() => {
    if (description && containerRef.current) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = description;
      containerRef.current.appendChild(announcement);
    }
  }, [description]);

  const content = (
    <div
      ref={containerRef}
      role="application"
      aria-label={label}
      aria-describedby={description ? 'editor-description' : undefined}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {description && (
        <div id="editor-description" className="sr-only">
          {description}
        </div>
      )}
      {children}
    </div>
  );

  if (trapFocus) {
    return (
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: false,
          escapeDeactivates: true,
        }}
      >
        {content}
      </FocusTrap>
    );
  }

  return content;
};

export default AccessibleEditor;

