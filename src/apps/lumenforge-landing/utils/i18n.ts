/**
 * Internationalization Utilities
 * EC-186, EC-187, EC-188: i18n support
 */
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface Translations {
  [key: string]: string | Translations;
}

class I18n {
  private locale: Locale = 'en';
  private translations: Map<Locale, Translations> = new Map();
  private fallbackLocale: Locale = 'en';

  setLocale(locale: Locale): void {
    this.locale = locale;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }

  getLocale(): Locale {
    return this.locale;
  }

  setTranslations(locale: Locale, translations: Translations): void {
    this.translations.set(locale, translations);
  }

  translate(key: string, params?: Record<string, string>): string | null {
    const translation = this.getTranslation(key);

    if (!translation) {
      // Suppress translation warnings in Storybook context
      const isStorybook = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' && window.location.port === '6006' ||
        window.parent !== window && window.parent.location?.href?.includes('storybook')
      );
      if (!isStorybook) {
        console.warn(`Translation missing for key: ${key}`);
      }
      return null; // Return null instead of key so fallback works
    }

    // Replace parameters
    if (params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return translation;
  }

  private getTranslation(key: string): string | null {
    const keys = key.split('.');
    let current: any = this.translations.get(this.locale);

    // Fallback to fallback locale if translation not found
    if (!current) {
      current = this.translations.get(this.fallbackLocale);
    }

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Try fallback locale
        const fallback = this.translations.get(this.fallbackLocale);
        if (fallback) {
          let fallbackCurrent: any = fallback;
          for (const fk of keys) {
            if (fallbackCurrent && typeof fallbackCurrent === 'object' && fk in fallbackCurrent) {
              fallbackCurrent = fallbackCurrent[fk];
            } else {
              return null;
            }
          }
          return typeof fallbackCurrent === 'string' ? fallbackCurrent : null;
        }
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  detectLocale(): Locale {
    if (typeof window === 'undefined') return 'en';

    // Check localStorage
    try {
      const saved = window.localStorage.getItem('locale');
      if (saved && ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(saved)) {
        return saved as Locale;
      }
    } catch (e) {
      // localStorage not available
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(browserLang)) {
      return browserLang as Locale;
    }

    return 'en';
  }
}

export const i18n = new I18n();

// Hook for React components
import { useState, useEffect } from 'react';
import { translations as defaultTranslations } from '../data/translations';

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale());

  useEffect(() => {
    Object.entries(defaultTranslations).forEach(([lang, data]) => {
      i18n.setTranslations(lang as Locale, data as Translations);
    });

    const detected = i18n.detectLocale();
    i18n.setLocale(detected);
    setLocaleState(detected);
  }, []);

  const setLocale = (newLocale: Locale) => {
    i18n.setLocale(newLocale);
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('locale', newLocale);
      } catch (e) {
        // localStorage not available
      }
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    return i18n.translate(key, params) || '';
  };

  return { locale, setLocale, t };
}

