// Mock Next.js Link component for Storybook with Storybook navigation
import React from 'react';

// Map routes to Storybook story kind and name
const routeToStoryMap = {
  '/landing': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Landing/Pages/Main Gateway',
    story: 'Default'
  },
  '/waypoint': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Waypoint/Pages/Unity Visual Scripting',
    story: 'Default'
  },
  '/spark': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Spark/Pages/IDE Experience',
    story: 'Default'
  },
  '/slate/ide': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Slate/Pages/Workspace & Identity',
    story: 'Default'
  },
  '/ignis': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Ignis/Pages/API Backend',
    story: 'Default'
  },
  '/ignition': {
    kind: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Pages/Project Bootstrap',
    story: 'Default'
  },
};

export default function Link({ children, href, className, onClick, ...props }) {
  const handleClick = (e) => {
    // Check if the click originated from a button
    const button = e.target.closest('button');
    if (button) {
      // Don't prevent default for buttons - let them handle their own clicks
      return;
    }
    
    // Check if we have a Storybook story mapping for this route
    const storyInfo = href ? routeToStoryMap[href] : null;
    
    if (storyInfo) {
      // Navigate to Storybook story
      e.preventDefault();
      e.stopPropagation();
      
      try {
        // Use Storybook's navigation API
        const { navigate } = require('@storybook/addon-links');
        navigate(storyInfo.kind, storyInfo.story);
      } catch (err) {
        // Fallback: use URL-based navigation
        const storyId = `${storyInfo.kind}--${storyInfo.story}`.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[&]/g, 'and')
          .replace(/[^a-z0-9-]/g, '');
        if (typeof window !== 'undefined') {
          window.location.href = `?path=/story/${storyId}`;
        }
      }
    } else {
      // For routes without mappings, prevent default and log
      e.preventDefault();
      console.log('[Storybook] Link clicked:', href, '(no story mapping)');
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href || '#'}
      className={className}
      {...props}
      onClick={handleClick}
      style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
    >
      {children}
    </a>
  );
}
