/**
 * Search Index
 * Fuse.js-powered search for documentation
 */

import Fuse from "fuse.js";
import docsDb from "../docsDb";

let fuse: Fuse<{ id: string; content: string }> | null = null;

interface SearchResult {
  id: string;
  content: string;
}

/**
 * Initialize search index
 */
function getSearchIndex(): Fuse<SearchResult> {
  if (!fuse) {
    const items: SearchResult[] = Object.keys(docsDb).map((id) => ({
      id,
      content: docsDb[id]
    }));

    fuse = new Fuse(items, {
      keys: ["id", "content"],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2
    });
  }

  return fuse;
}

/**
 * Search documentation
 */
export function searchDocs(query: string): SearchResult[] {
  if (!query || !query.trim()) {
    return [];
  }

  const index = getSearchIndex();
  const results = index.search(query);

  return results.map((result) => result.item);
}

/**
 * Reset search index (useful for hot reloading)
 */
export function resetSearchIndex(): void {
  fuse = null;
}

/**
 * Get all documentation IDs
 */
export function getAllDocIds(): string[] {
  return Object.keys(docsDb);
}

