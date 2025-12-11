/**
 * PWA Utilities
 * EC-201, EC-202, EC-203: Service worker registration & update flow
 */
export interface ServiceWorkerRegistrationOptions {
  scope?: string;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export async function registerServiceWorker(
  swUrl: string,
  options: ServiceWorkerRegistrationOptions = {}
) {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: options.scope || '/',
      });

      // Listen for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                options.onUpdate?.(registration);
              } else {
                options.onSuccess?.(registration);
              }
            }
          };
        }
      };

      return registration;
    } catch (error) {
      options.onError?.(error as Error);
      console.warn('Service worker registration failed:', error);
    }
  }
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
}
