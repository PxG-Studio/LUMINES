/**
 * PostgreSQL Client Bridge
 * 
 * Re-exports database client functions from main client module
 * This provides a consistent interface for database operations
 */

export { query, queryReplica, transaction, getPrimaryPool, getReplicaPool, closeConnections } from './client';

