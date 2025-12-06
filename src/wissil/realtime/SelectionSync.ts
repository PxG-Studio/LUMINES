/**
 * Selection Sync
 * 
 * Synchronizes object selection across all users
 */

import { ySelection, yHistory, awareness } from './YProvider';
import { ideEventBus } from '../ide-shell/IDEEventBus';

export class SelectionSync {
  private userId: number;

  constructor() {
    this.userId = awareness.clientID;
  }

  selectObject(id: string) {
    ySelection.set("active", id);
    ySelection.set("selectedBy", this.userId);
    ySelection.set("selectedAt", Date.now());
    
    // Emit local events
    ideEventBus.emit('unity:select', id);
    ideEventBus.emit('inspector:inspect', id);
    
    this.recordAction('selection:change', { objectId: id });
  }

  clearSelection() {
    ySelection.delete("active");
    ySelection.delete("selectedBy");
    this.recordAction('selection:clear', {});
  }

  observeSelection(callback: (objectId: string | null, userId: number | null) => void) {
    const updateSelection = () => {
      const active = ySelection.get("active") as string | undefined;
      const selectedBy = ySelection.get("selectedBy") as number | undefined;
      callback(active || null, selectedBy || null);
    };

    ySelection.observe(updateSelection);
    updateSelection(); // Initial call
  }

  getSelectedBy(): number | null {
    return ySelection.get("selectedBy") as number | null;
  }

  getSelectedObject(): string | null {
    return ySelection.get("active") as string | null;
  }

  private recordAction(action: string, payload: any) {
    yHistory.push([{
      timestamp: Date.now(),
      userId: this.userId,
      action,
      payload
    }]);
  }
}

export const selectionSync = new SelectionSync();

