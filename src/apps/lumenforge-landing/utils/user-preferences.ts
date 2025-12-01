/**
 * User Preferences Utilities
 * EC-LAND-891 to EC-LAND-900: User Preferences
 */
import { SafeStorage } from './storage';

/**
 * User Preferences Manager
 * EC-LAND-891 to EC-LAND-900
 */
export class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user-preferences';
  private static storage = new SafeStorage();

  /**
   * Save user preferences
   * EC-LAND-891: Save preferences
   */
  static savePreferences(preferences: Record<string, any>): boolean {
    try {
      const existing = this.loadPreferences();
      const merged = { ...existing, ...preferences };
      return this.storage.set(this.STORAGE_KEY, merged);
    } catch (error) {
      console.warn('Failed to save preferences:', error);
      return false;
    }
  }

  /**
   * Load user preferences
   * EC-LAND-892: Load preferences
   */
  static loadPreferences(): Record<string, any> {
    try {
      const stored = this.storage.get<string>(this.STORAGE_KEY);
      if (!stored) return {};

      // If already parsed, return as-is
      if (typeof stored === 'object') {
        return stored as Record<string, any>;
      }

      return JSON.parse(stored) as Record<string, any>;
    } catch (error) {
      console.warn('Failed to load preferences:', error);
      return {};
    }
  }

  /**
   * Get preference value
   * EC-LAND-892: Load preferences
   */
  static getPreference(key: string, defaultValue?: any): any {
    const preferences = this.loadPreferences();
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  }

  /**
   * Set preference value
   * EC-LAND-891: Save preferences
   */
  static setPreference(key: string, value: any): boolean {
    return this.savePreferences({ [key]: value });
  }

  /**
   * Synchronize preferences
   * EC-LAND-893: Synchronize preferences
   */
  static async synchronizePreferences(
    syncFn: (preferences: Record<string, any>) => Promise<Record<string, any>>
  ): Promise<boolean> {
    try {
      const local = this.loadPreferences();
      const remote = await syncFn(local);
      const merged = { ...local, ...remote };
      return this.savePreferences(merged);
    } catch (error) {
      console.warn('Failed to synchronize preferences:', error);
      return false;
    }
  }

  /**
   * Make preferences accessible
   * EC-LAND-894: Accessible preferences
   */
  static makeAccessible(container: HTMLElement): void {
    const preferenceControls = container.querySelectorAll<HTMLElement>('[data-preference]');

    preferenceControls.forEach(control => {
      const preferenceKey = control.getAttribute('data-preference');
      if (preferenceKey) {
        const value = this.getPreference(preferenceKey);
        if (control instanceof HTMLInputElement) {
          if (control.type === 'checkbox' || control.type === 'radio') {
            control.checked = value === true || control.value === value;
          } else {
            control.value = value || '';
          }
        }

        if (!control.hasAttribute('aria-label')) {
          control.setAttribute('aria-label', `Preference: ${preferenceKey}`);
        }
      }
    });
  }

  /**
   * Localize preferences
   * EC-LAND-895: Localized preferences
   */
  static localizePreferences(locale: string): void {
    this.setPreference('locale', locale);
  }

  /**
   * Optimize preferences
   * EC-LAND-897: Optimized preferences
   */
  static optimizePreferences(): void {
    const preferences = this.loadPreferences();
    const optimized: Record<string, any> = {};

    // Remove undefined values
    Object.keys(preferences).forEach(key => {
      if (preferences[key] !== undefined) {
        optimized[key] = preferences[key];
      }
    });

    this.savePreferences(optimized);
  }

  /**
   * Ensure preferences consistency
   * EC-LAND-898: Consistent preferences
   */
  static ensureConsistency(): void {
    const preferences = this.loadPreferences();
    const defaults: Record<string, any> = {
      theme: 'light',
      locale: 'en',
      reducedMotion: false,
    };

    const consistent = { ...defaults, ...preferences };
    this.savePreferences(consistent);
  }

  /**
   * Recover preferences
   * EC-LAND-899: Recoverable preferences
   */
  static recoverPreferences(fallback: Record<string, any>): Record<string, any> {
    try {
      const preferences = this.loadPreferences();
      return preferences;
    } catch (error) {
      console.warn('Failed to recover preferences, using fallback:', error);
      return fallback;
    }
  }

  /**
   * Monitor preferences
   * EC-LAND-900: Monitor preferences
   */
  private static preferenceListeners = new Map<string, Set<(value: any) => void>>();

  static watchPreference(key: string, callback: (value: any) => void): () => void {
    if (!this.preferenceListeners.has(key)) {
      this.preferenceListeners.set(key, new Set());
    }

    this.preferenceListeners.get(key)!.add(callback);

    return () => {
      this.preferenceListeners.get(key)?.delete(callback);
    };
  }

  static notifyPreferenceChange(key: string, value: any): void {
    const listeners = this.preferenceListeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.warn('Preference listener error:', error);
        }
      });
    }
  }
}

