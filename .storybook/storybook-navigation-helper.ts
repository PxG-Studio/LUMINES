/**
 * Storybook Navigation Helper
 * Maps routes to Storybook story IDs for navigation
 */

// Map routes to Storybook story kind and name
export const routeToStoryMap = {
  '/landing': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Landing/Pages/Main Gateway',
    story: 'Default'
  },
  '/waypoint': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Waypoint/Pages/Unity Visual Scripting',
    story: 'Default'
  },
  '/spark': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Spark/Pages/IDE Experience',
    story: 'Default'
  },
  '/slate/ide': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Slate/Pages/Workspace & Identity',
    story: 'Default'
  },
  '/ignis': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Ignis/Pages/API Backend',
    story: 'Default'
  },
  '/ignition': {
    kind: 'Lumenforge.io Design System/WISSIL Framework/Ignition/Pages/Project Bootstrap',
    story: 'Default'
  },
};

/**
 * Navigate to a Storybook story from a route
 */
export function navigateToStory(href: string) {
  const storyInfo = routeToStoryMap[href as keyof typeof routeToStoryMap];
  
  if (!storyInfo) {
    console.log(`[Storybook] No story mapping for route: ${href}`);
    return;
  }

  try {
    // Try using Storybook's navigation API
    if (typeof window !== 'undefined') {
      const { navigate } = require('@storybook/addon-links');
      navigate(storyInfo.kind, storyInfo.story);
    }
  } catch (err) {
    // Fallback: use URL-based navigation
    console.log(`[Storybook] Navigating to: ${storyInfo.kind} → ${storyInfo.story}`);
    const storyId = `${storyInfo.kind}--${storyInfo.story}`.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[&]/g, 'and')
      .replace(/[^a-z0-9-]/g, '');
    
    if (typeof window !== 'undefined') {
      window.location.href = `?path=/story/${storyId}`;
    }
  }
}

