/**
 * TLS Configuration Example
 * 
 * This is a template for TLS configuration
 * Copy to tls.config.ts and fill in actual certificate paths
 */

export interface TLSConfig {
  enabled: boolean;
  certPath: string;
  keyPath: string;
  caPath?: string;
  minVersion?: string;
  ciphers?: string[];
}

/**
 * Production TLS Configuration
 */
export const productionTLSConfig: TLSConfig = {
  enabled: true,
  certPath: process.env.TLS_CERT_PATH || '/etc/ssl/certs/spark.crt',
  keyPath: process.env.TLS_KEY_PATH || '/etc/ssl/private/spark.key',
  caPath: process.env.TLS_CA_PATH,
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384',
  ],
};

/**
 * Development TLS Configuration (self-signed)
 */
export const developmentTLSConfig: TLSConfig = {
  enabled: false, // Usually disabled in development
  certPath: './certs/dev.crt',
  keyPath: './certs/dev.key',
  minVersion: 'TLSv1.2',
};

/**
 * Get TLS config based on environment
 */
export function getTLSConfig(): TLSConfig {
  if (process.env.NODE_ENV === 'production') {
    return productionTLSConfig;
  }
  return developmentTLSConfig;
}

