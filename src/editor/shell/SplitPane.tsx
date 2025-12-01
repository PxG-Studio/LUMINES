/**
 * Split Pane Component
 * 
 * Resizable split container
 */

import React, { useState, useRef, useEffect } from 'react';

export type SplitDirection = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  direction?: SplitDirection;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: [React.ReactNode, React.ReactNode];
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  direction = 'horizontal',
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  children,
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        newSize = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSize = ((e.clientY - rect.top) / rect.height) * 100;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minSize, maxSize]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* First Pane */}
      <div
        style={{
          width: isHorizontal ? `${size}%` : '100%',
          height: isHorizontal ? '100%' : `${size}%`,
          overflow: 'auto',
        }}
      >
        {children[0]}
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: isHorizontal ? 4 : '100%',
          height: isHorizontal ? '100%' : 4,
          background: isDragging
            ? 'var(--slate-accent, #3f8cff)'
            : 'var(--slate-border, #26292f)',
          cursor: isHorizontal ? 'col-resize' : 'row-resize',
          transition: isDragging ? 'none' : 'background 0.2s',
          position: 'relative',
          zIndex: 10,
        }}
      />

      {/* Second Pane */}
      <div
        style={{
          width: isHorizontal ? `${100 - size}%` : '100%',
          height: isHorizontal ? '100%' : `${100 - size}%`,
          overflow: 'auto',
        }}
      >
        {children[1]}
      </div>
    </div>
  );
};

export default SplitPane;

