/**
 * Audit Logging System
 * 
 * Logs all security events and user actions for compliance and security monitoring
 */

import { query } from '../database/client';

export interface AuditEvent {
  id?: string;
  user_id: string;
  session_id?: string;
  event_type: AuditEventType;
  resource_type: string;
  resource_id?: string;
  action: string;
  success: boolean;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  error_message?: string;
  timestamp?: Date;
}

export type AuditEventType =
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'data_deletion'
  | 'configuration_change'
  | 'security_event'
  | 'api_access'
  | 'export'
  | 'import';

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
  try {
    await query(
      `INSERT INTO spark_audit_logs (
        user_id, session_id, event_type, resource_type, resource_id,
        action, success, ip_address, user_agent, metadata, error_message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        event.user_id,
        event.session_id || null,
        event.event_type,
        event.resource_type,
        event.resource_id || null,
        event.action,
        event.success,
        event.ip_address || null,
        event.user_agent || null,
        JSON.stringify(event.metadata || {}),
        event.error_message || null,
      ]
    );
  } catch (error) {
    // Audit logging failures should not break the application
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  userId: string,
  action: 'login' | 'logout' | 'login_failed' | 'token_refresh' | 'mfa_challenge' | 'mfa_success',
  success: boolean,
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    error_message?: string;
    mfa_method?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    event_type: 'authentication',
    resource_type: 'user',
    resource_id: userId,
    action,
    success,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    error_message: metadata?.error_message,
    metadata: {
      mfa_method: metadata?.mfa_method,
    },
  });
}

/**
 * Log authorization events
 */
export async function logAuthzEvent(
  userId: string,
  action: 'access_granted' | 'access_denied' | 'permission_changed',
  resourceType: string,
  resourceId: string,
  success: boolean,
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    reason?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    event_type: 'authorization',
    resource_type: resourceType,
    resource_id: resourceId,
    action,
    success,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    metadata: {
      reason: metadata?.reason,
    },
  });
}

/**
 * Log data access events
 */
export async function logDataAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: 'read' | 'list' | 'search',
  metadata?: {
    session_id?: string;
    ip_address?: string;
    user_agent?: string;
    query_params?: Record<string, any>;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    session_id: metadata?.session_id,
    event_type: 'data_access',
    resource_type: resourceType,
    resource_id: resourceId,
    action,
    success: true,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    metadata: {
      query_params: metadata?.query_params,
    },
  });
}

/**
 * Log data modification events
 */
export async function logDataModification(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: 'create' | 'update',
  success: boolean,
  metadata?: {
    session_id?: string;
    ip_address?: string;
    user_agent?: string;
    changes?: Record<string, any>;
    error_message?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    session_id: metadata?.session_id,
    event_type: 'data_modification',
    resource_type: resourceType,
    resource_id: resourceId,
    action,
    success,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    metadata: {
      changes: metadata?.changes,
    },
    error_message: metadata?.error_message,
  });
}

/**
 * Log data deletion events
 */
export async function logDataDeletion(
  userId: string,
  resourceType: string,
  resourceId: string,
  success: boolean,
  metadata?: {
    session_id?: string;
    ip_address?: string;
    user_agent?: string;
    error_message?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    session_id: metadata?.session_id,
    event_type: 'data_deletion',
    resource_type: resourceType,
    resource_id: resourceId,
    action: 'delete',
    success,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    error_message: metadata?.error_message,
  });
}

/**
 * Log security events
 */
export async function logSecurityEvent(
  userId: string,
  event: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_token' | 'csrf_attempt' | 'xss_attempt' | 'sql_injection_attempt',
  severity: 'low' | 'medium' | 'high' | 'critical',
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    details?: Record<string, any>;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    event_type: 'security_event',
    resource_type: 'security',
    action: event,
    success: false, // Security events are always failures
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    metadata: {
      severity,
      details: metadata?.details,
    },
  });
}

/**
 * Log API access events
 */
export async function logAPIAccess(
  userId: string,
  endpoint: string,
  method: string,
  success: boolean,
  metadata?: {
    session_id?: string;
    ip_address?: string;
    user_agent?: string;
    response_time_ms?: number;
    error_message?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    session_id: metadata?.session_id,
    event_type: 'api_access',
    resource_type: 'api',
    resource_id: endpoint,
    action: `${method} ${endpoint}`,
    success,
    ip_address: metadata?.ip_address,
    user_agent: metadata?.user_agent,
    metadata: {
      method,
      response_time_ms: metadata?.response_time_ms,
    },
    error_message: metadata?.error_message,
  });
}

/**
 * Log export events
 */
export async function logExport(
  userId: string,
  resourceType: string,
  resourceId: string,
  format: string,
  success: boolean,
  metadata?: {
    session_id?: string;
    ip_address?: string;
    file_size?: number;
    error_message?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    session_id: metadata?.session_id,
    event_type: 'export',
    resource_type: resourceType,
    resource_id: resourceId,
    action: `export_${format}`,
    success,
    ip_address: metadata?.ip_address,
    metadata: {
      format,
      file_size: metadata?.file_size,
    },
    error_message: metadata?.error_message,
  });
}

/**
 * Get audit logs for a user
 */
export async function getAuditLogs(
  userId: string,
  options?: {
    event_type?: AuditEventType;
    resource_type?: string;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<AuditEvent[]> {
  const conditions: string[] = ['user_id = $1'];
  const values: any[] = [userId];
  let paramIndex = 2;

  if (options?.event_type) {
    conditions.push(`event_type = $${paramIndex++}`);
    values.push(options.event_type);
  }

  if (options?.resource_type) {
    conditions.push(`resource_type = $${paramIndex++}`);
    values.push(options.resource_type);
  }

  if (options?.start_date) {
    conditions.push(`timestamp >= $${paramIndex++}`);
    values.push(options.start_date);
  }

  if (options?.end_date) {
    conditions.push(`timestamp <= $${paramIndex++}`);
    values.push(options.end_date);
  }

  const limit = options?.limit || 100;
  const offset = options?.offset || 0;

  const result = await query<AuditEvent>(
    `SELECT * FROM spark_audit_logs
     WHERE ${conditions.join(' AND ')}
     ORDER BY timestamp DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...values, limit, offset]
  );

  return result.rows;
}

/**
 * Get audit logs for a resource
 */
export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  limit: number = 100
): Promise<AuditEvent[]> {
  const result = await query<AuditEvent>(
    `SELECT * FROM spark_audit_logs
     WHERE resource_type = $1 AND resource_id = $2
     ORDER BY timestamp DESC
     LIMIT $3`,
    [resourceType, resourceId, limit]
  );

  return result.rows;
}

