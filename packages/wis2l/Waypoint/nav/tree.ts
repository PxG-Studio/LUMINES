/**
 * Documentation Navigation Tree
 * Defines the structure of the documentation sidebar
 */

export interface DocNavItem {
  id: string;
  label: string;
}

export interface DocNavSection {
  label: string;
  items: DocNavItem[];
}

export const docTree: DocNavSection[] = [
  {
    label: "Introduction",
    items: [
      { id: "intro/getting-started", label: "Getting Started" }
    ]
  },
  {
    label: "Runtime",
    items: [
      { id: "runtime/runtime-overview", label: "Runtime Overview" },
      { id: "runtime/fs-api", label: "Filesystem API" }
    ]
  },
  {
    label: "Editor",
    items: [
      { id: "editor/monaco-basics", label: "Monaco Editor Basics" }
    ]
  },
  {
    label: "Ignis",
    items: [
      { id: "ignis/unity-webgl", label: "Unity WebGL Integration" }
    ]
  }
];

/**
 * Find a doc item by ID
 */
export function findDocById(id: string): DocNavItem | null {
  for (const section of docTree) {
    const item = section.items.find((item) => item.id === id);
    if (item) return item;
  }
  return null;
}

/**
 * Get all doc IDs as flat array
 */
export function getAllDocIds(): string[] {
  return docTree.flatMap((section) => section.items.map((item) => item.id));
}

