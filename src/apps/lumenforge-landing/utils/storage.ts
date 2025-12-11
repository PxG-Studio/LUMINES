/**
 * Storage Utilities
 * EC-018, EC-019: LocalStorage and SessionStorage with error handling
 * EC-LAND-051 to EC-LAND-060: Enhanced storage security
 */
import { PrivacyManager } from './security';

export class SafeStorage {
  private storage: globalThis.Storage | null = null;
  private type: 'local' | 'session';
  private encryptSensitive: boolean;

  constructor(type: 'local' | 'session' = 'local', encryptSensitive: boolean = false) {
    this.type = type;
    this.encryptSensitive = encryptSensitive;
    
    if (typeof window === 'undefined') {
      return;
    }

    try {
      this.storage = type === 'local' ? window.localStorage : window.sessionStorage;
      // Test if storage is available
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
    } catch (e) {
      // Storage not available (private browsing, quota exceeded, etc.)
      console.warn(`Storage (${type}) not available:`, e);
      this.storage = null;
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.storage) return defaultValue ?? null;

    try {
      const item = this.storage.getItem(key);
      if (item === null) return defaultValue ?? null;
      
      // EC-LAND-051, EC-LAND-094: Decrypt if encrypted
      let parsed: any;
      try {
        const decoded = this.encryptSensitive ? PrivacyManager.decryptSensitiveData(item) : item;
        parsed = JSON.parse(decoded);
      } catch {
        // If decryption fails, try parsing directly (for non-encrypted data)
        parsed = JSON.parse(item);
      }
      
      return parsed as T;
    } catch (e) {
      console.warn(`Failed to get storage item "${key}":`, e);
      return defaultValue ?? null;
    }
  }

  set<T>(key: string, value: T, sensitive: boolean = false): boolean {
    if (!this.storage) return false;

    try {
      const serialized = JSON.stringify(value);
      
      // EC-LAND-051, EC-LAND-094: Encrypt sensitive data
      const stored = (sensitive || this.encryptSensitive) 
        ? PrivacyManager.encryptSensitiveData(serialized)
        : serialized;
      
      this.storage.setItem(key, stored);
      
      // EC-LAND-054: Check quota
      if (this.storage.length > 1000) {
        console.warn('Storage quota may be exceeded');
      }
      
      return true;
    } catch (e) {
      // EC-LAND-055: Handle quota exceeded gracefully
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn(`Storage quota exceeded for key "${key}"`);
        return false;
      }
      console.warn(`Failed to set storage item "${key}":`, e);
      return false;
    }
  }

  remove(key: string): boolean {
    if (!this.storage) return false;

    try {
      this.storage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Failed to remove storage item "${key}":`, e);
      return false;
    }
  }

  clear(): boolean {
    if (!this.storage) return false;

    try {
      this.storage.clear();
      return true;
    } catch (e) {
      console.warn('Failed to clear storage:', e);
      return false;
    }
  }

  has(key: string): boolean {
    if (!this.storage) return false;
    return this.storage.getItem(key) !== null;
  }

  // EC-LAND-052: Check if storage is accessible to all tabs (localStorage only)
  isAccessibleToAllTabs(): boolean {
    return this.type === 'local';
  }

  // EC-LAND-056: Check if data persists in incognito
  persistsInIncognito(): boolean {
    // sessionStorage should not persist, but localStorage might
    return this.type === 'local';
  }
}

export const localStorage = new SafeStorage('local');
export const sessionStorage = new SafeStorage('session');

