/**
 * Database Client Types
 */

export interface DatabaseClient {
  query: (sql: string, params?: any[]) => Promise<any>;
  close: () => Promise<void>;
}

