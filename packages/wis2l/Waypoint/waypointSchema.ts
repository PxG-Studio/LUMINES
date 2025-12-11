/**
 * Waypoint Documentation Schema
 * Defines doc items and hierarchy
 */

export type WaypointDoc = {
  id: string;
  title: string;
  file: string; // MDX file path
  children?: WaypointDoc[];
};

export const WaypointTree: WaypointDoc[] = [
  {
    id: "intro",
    title: "Introduction",
    file: "intro.mdx"
  },
  {
    id: "getting-started",
    title: "Getting Started",
    file: "editor.mdx",
    children: [
      {
        id: "runtime",
        title: "Ignition Runtime",
        file: "runtime.mdx"
      }
    ]
  }
];

