/**
 * Integration Utilities
 * EC-LAND-901 to EC-LAND-950: API, Third-Party, Analytics, Payment, OAuth Integration
 */

/**
 * API Integration Manager
 * EC-LAND-901 to EC-LAND-910
 */
export class APIIntegrationManager {
  /**
   * Handle API errors
   * EC-LAND-902: API errors handled
   */
  static handleError(error: any): { message: string; code?: string } {
    if (error instanceof Error) {
      return { message: error.message };
    }
    if (error?.response?.data) {
      return { message: error.response.data.message || 'API error', code: error.response.status };
    }
    return { message: 'Unknown API error' };
  }

  /**
   * Handle API timeouts
   * EC-LAND-903: API timeouts handled
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 10000
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API request timeout')), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }

  /**
   * Handle API rate limits
   * EC-LAND-904: API rate limits handled
   */
  private static rateLimitQueue: Array<() => Promise<any>> = [];
  private static isProcessing = false;
  private static lastRequestTime = 0;
  private static readonly MIN_DELAY = 100; // ms between requests

  static async rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.rateLimitQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessing || this.rateLimitQueue.length === 0) return;

    this.isProcessing = true;

    while (this.rateLimitQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.MIN_DELAY) {
        await new Promise(resolve => setTimeout(resolve, this.MIN_DELAY - timeSinceLastRequest));
      }

      const request = this.rateLimitQueue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        await request();
      }
    }

    this.isProcessing = false;
  }

  /**
   * Handle API authentication
   * EC-LAND-905: API authentication handled
   */
  static getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API versioning
   * EC-LAND-906: API versioning handled
   */
  static getVersionedUrl(baseUrl: string, version: string = 'v1'): string {
    return `${baseUrl}/${version}`;
  }

  /**
   * Monitor API
   * EC-LAND-910: API monitoring
   */
  private static apiMetrics = new Map<string, { requests: number; errors: number; avgResponseTime: number }>();

  static trackRequest(endpoint: string, responseTime: number, success: boolean): void {
    const metrics = this.apiMetrics.get(endpoint) || { requests: 0, errors: 0, avgResponseTime: 0 };
    metrics.requests++;
    if (!success) metrics.errors++;
    metrics.avgResponseTime = (metrics.avgResponseTime * (metrics.requests - 1) + responseTime) / metrics.requests;
    this.apiMetrics.set(endpoint, metrics);
  }

  static getMetrics(endpoint: string) {
    return this.apiMetrics.get(endpoint);
  }
}

/**
 * Third-Party Services Manager
 * EC-LAND-911 to EC-LAND-920
 */
export class ThirdPartyServicesManager {
  /**
   * Handle third-party errors
   * EC-LAND-912: Third-party errors handled
   */
  static handleError(error: any, serviceName: string): { message: string; service: string } {
    return {
      message: error instanceof Error ? error.message : 'Third-party service error',
      service: serviceName,
    };
  }

  /**
   * Handle third-party timeouts
   * EC-LAND-913: Third-party timeouts handled
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 10000,
    serviceName: string
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${serviceName} timeout`)), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }

  /**
   * Implement fallbacks
   * EC-LAND-920: Third-party fallbacks
   */
  static async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn('Primary service failed, using fallback:', error);
      return await fallback();
    }
  }
}

/**
 * Analytics Integration Manager
 * EC-LAND-921 to EC-LAND-930
 */
export class AnalyticsIntegrationManager {
  /**
   * Track event
   * EC-LAND-921: Analytics implemented
   */
  static trackEvent(eventName: string, properties?: Record<string, any>): void {
    // In a real app, you'd send this to your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }

  /**
   * Handle analytics errors
   * EC-LAND-923: Analytics errors handled
   */
  static handleError(error: any): void {
    console.warn('Analytics error:', error);
    // Don't throw - analytics errors shouldn't break the app
  }

  /**
   * Ensure privacy compliance
   * EC-LAND-924: Privacy-compliant analytics
   */
  static isPrivacyCompliant(): boolean {
    // Check if user has consented to analytics
    const consent = localStorage.getItem('analytics-consent');
    return consent === 'true';
  }

  /**
   * Make analytics accessible
   * EC-LAND-930: Accessible analytics
   */
  static trackAccessibilityEvent(eventName: string, properties?: Record<string, any>): void {
    if (this.isPrivacyCompliant()) {
      this.trackEvent(`a11y_${eventName}`, properties);
    }
  }
}

/**
 * Payment Integration Manager
 * EC-LAND-931 to EC-LAND-940
 */
export class PaymentIntegrationManager {
  /**
   * Handle payment errors
   * EC-LAND-932: Payment errors handled
   */
  static handleError(error: any): { message: string; code?: string } {
    if (error?.code) {
      return { message: error.message || 'Payment error', code: error.code };
    }
    return { message: 'Payment processing error' };
  }

  /**
   * Handle payment timeouts
   * EC-LAND-933: Payment timeouts handled
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 30000
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Payment request timeout')), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }

  /**
   * Validate payment
   * EC-LAND-935: Payment validation
   */
  static validatePayment(amount: number, currency: string): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    if (!currency || currency.length !== 3) {
      return { valid: false, error: 'Invalid currency code' };
    }
    return { valid: true };
  }

  /**
   * Implement fallbacks
   * EC-LAND-940: Payment fallbacks
   */
  static async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn('Primary payment method failed, using fallback:', error);
      return await fallback();
    }
  }
}

/**
 * OAuth Integration Manager
 * EC-LAND-941 to EC-LAND-950
 */
export class OAuthIntegrationManager {
  /**
   * Handle OAuth errors
   * EC-LAND-942: OAuth errors handled
   */
  static handleError(error: any): { message: string; code?: string } {
    if (error?.error) {
      return { message: error.error_description || error.error, code: error.error };
    }
    return { message: 'OAuth authentication error' };
  }

  /**
   * Handle OAuth timeouts
   * EC-LAND-943: OAuth timeouts handled
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 30000
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('OAuth request timeout')), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }

  /**
   * Validate OAuth callback
   * EC-LAND-945: OAuth validation
   */
  static validateCallback(params: URLSearchParams, state: string): { valid: boolean; error?: string } {
    const returnedState = params.get('state');
    if (returnedState !== state) {
      return { valid: false, error: 'Invalid state parameter' };
    }

    const code = params.get('code');
    if (!code) {
      return { valid: false, error: 'Missing authorization code' };
    }

    return { valid: true };
  }

  /**
   * Handle token refresh
   * EC-LAND-947: OAuth token refresh
   */
  static async refreshToken(
    refreshToken: string,
    refreshFn: (token: string) => Promise<{ accessToken: string; refreshToken?: string }>
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    try {
      return await refreshFn(refreshToken);
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Implement fallbacks
   * EC-LAND-950: OAuth fallbacks
   */
  static async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn('Primary OAuth method failed, using fallback:', error);
      return await fallback();
    }
  }
}

