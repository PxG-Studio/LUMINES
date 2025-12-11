/**
 * Collaboration Realtime Bridge
 * 
 * Re-exports collaboration manager from SPARK module
 * This allows the main app to use SPARK's collaboration functionality
 */

export { getCollaborationManager } from '@/lib/spark/collaboration/realtime';
export type {
  CollaborationSession,
  CollaborationMessage,
  Participant,
  Comment,
} from '@/lib/spark/collaboration/realtime';

