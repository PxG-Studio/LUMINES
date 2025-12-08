/**
 * Conflict Resolution Strategies
 * Handle merge conflicts in collaborative editing
 */

import { logger } from '../monitoring/logger';

export interface MergeResult {
  merged: string;
  hasConflicts: boolean;
  conflicts: ConflictMarker[];
}

export interface ConflictMarker {
  start: number;
  end: number;
  local: string;
  remote: string;
}

export function threeWayMerge(base: string, local: string, remote: string): MergeResult {
  const result: MergeResult = { merged: '', hasConflicts: false, conflicts: [] };
  const baseLines = base.split('\n');
  const localLines = local.split('\n');
  const remoteLines = remote.split('\n');
  const mergedLines: string[] = [];
  
  let i = 0, j = 0, k = 0;
  while (i < baseLines.length || j < localLines.length || k < remoteLines.length) {
    const baseLine = baseLines[i] || '';
    const localLine = localLines[j] || '';
    const remoteLine = remoteLines[k] || '';

    if (localLine === remoteLine) {
      mergedLines.push(localLine);
      i++; j++; k++;
    } else if (localLine === baseLine) {
      mergedLines.push(remoteLine);
      i++; j++; k++;
    } else if (remoteLine === baseLine) {
      mergedLines.push(localLine);
      i++; j++; k++;
    } else {
      result.hasConflicts = true;
      mergedLines.push('<<<<<<< LOCAL');
      mergedLines.push(localLine);
      mergedLines.push('=======');
      mergedLines.push(remoteLine);
      mergedLines.push('>>>>>>> REMOTE');
      i++; j++; k++;
    }
  }

  result.merged = mergedLines.join('\n');
  logger.info('Three-way merge completed', { hasConflicts: result.hasConflicts });
  return result;
}

export function lastWriteWins(localTimestamp: number, remoteTimestamp: number, localVersion: string, remoteVersion: string): string {
  return localTimestamp > remoteTimestamp ? localVersion : remoteVersion;
}
