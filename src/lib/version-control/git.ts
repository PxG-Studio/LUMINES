/**
 * Version Control Git Bridge
 * 
 * Re-exports git manager from SPARK module
 * This allows the main app to use SPARK's version control functionality
 */

export { getGitManager } from '@/lib/spark/version-control/git';
export type {
  GitCommit,
  GitBranch,
  GitStatus,
  MergeResult,
} from '@/lib/spark/version-control/git';

