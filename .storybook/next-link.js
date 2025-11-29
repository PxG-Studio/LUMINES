// Mock Next.js Link component for Storybook
import React from 'react';

export default function Link({ children, href, className, ...props }) {
  return (
    <a
      href={href || '#'}
      className={className}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        console.log('Link clicked:', href);
      }}
    >
      {children}
    </a>
  );
}
