/**
 * Inspector Sync
 * 
 * Synchronizes Inspector panel state across all users
 */

import { yInspector, yHistory, awareness } from './YProvider';
import { ideEventBus } from '../ide-shell/IDEEventBus';

export class InspectorSync {
  private userId: number;

  constructor() {
    this.userId = awareness.clientID;
  }

  updateProperty(key: string, value: any) {
    yInspector.set(key, value);
    yInspector.set(`${key}:updatedBy`, this.userId);
    yInspector.set(`${key}:updatedAt`, Date.now());
    
    ideEventBus.emit('property:update', { key, value });
    this.recordAction('inspector:update', { key, value });
  }

  updateProperties(properties: Record<string, any>) {
    Object.entries(properties).forEach(([key, value]) => {
      this.updateProperty(key, value);
    });
  }

  observeInspector(callback: (props: Record<string, any>) => void) {
    const updateInspector = () => {
      const props: Record<string, any> = {};
      yInspector.forEach((value, key) => {
        if (!key.includes(':updatedBy') && !key.includes(':updatedAt')) {
          props[key] = value;
        }
      });
      callback(props);
    };

    yInspector.observe(updateInspector);
    updateInspector(); // Initial call
  }

  clearInspector() {
    yInspector.forEach((value, key) => {
      yInspector.delete(key);
    });
    this.recordAction('inspector:clear', {});
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

export const inspectorSync = new InspectorSync();

