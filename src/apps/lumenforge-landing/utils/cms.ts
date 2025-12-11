/**
 * CMS Utilities
 * EC-211, EC-212: Content loading & caching
 */
import { createCache } from './cache';
import { defaultContent, SiteContent } from './content';

const contentCache = createCache<string, SiteContent>({ ttl: 1000 * 60 * 5 });

export async function fetchContent(locale: string): Promise<SiteContent> {
  const cacheKey = `content-${locale}`;
  const cached = contentCache.get(cacheKey);
  if (cached) return cached;

  // Simulate CMS fetch
  await new Promise((resolve) => setTimeout(resolve, 100));
  const content = defaultContent; // Replace with real CMS fetch
  contentCache.set(cacheKey, content);
  return content;
}
