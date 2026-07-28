// Services for Admin Service

import { pool } from '../config/database';
import {
  AuditLog,
  SystemSetting,
  SystemLog,
  CacheInvalidation,
  ApiRateLimit,
  Migration,
  AuditLogCreateInput,
  SystemSettingCreateInput,
  SystemSettingUpdateInput,
  SystemLogCreateInput,
  CacheInvalidationCreateInput,
  ApiRateLimitCreateInput,
  MigrationCreateInput,
  LogLevel,
  LogCategory,
  CacheType
} from '../models/Admin';

export class AuditLogService {
  async getAllLogs(params?: {
    userId?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const { userId, entityType, startDate, endDate, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM audit_logs';
    const values: any[] = [];
    const conditions: string[] = [];

    if (userId) {
      conditions.push('user_id = $' + (values.length + 1));
      values.push(userId);
    }
    if (entityType) {
      conditions.push('entity_type = $' + (values.length + 1));
      values.push(entityType);
    }
    if (startDate) {
      conditions.push('created_at >= $' + (values.length + 1));
      values.push(startDate);
    }
    if (endDate) {
      conditions.push('created_at <= $' + (values.length + 1));
      values.push(endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM audit_logs
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      logs: result.rows,
      total
    };
  }

  async getLogById(id: string): Promise<AuditLog | null> {
    const result = await pool.query('SELECT * FROM audit_logs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createLog(input: AuditLogCreateInput): Promise<AuditLog> {
    const { userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent } = input;
    const query = `
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      userId || null,
      action,
      entityType,
      entityId || null,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      ipAddress || null,
      userAgent || null
    ]);
    return result.rows[0];
  }

  async getLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const result = await pool.query(
      'SELECT * FROM audit_logs WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
      [entityType, entityId]
    );
    return result.rows;
  }
}

export class SystemSettingService {
  async getAllSettings(): Promise<SystemSetting[]> {
    const result = await pool.query('SELECT * FROM system_settings ORDER BY setting_key');
    return result.rows;
  }

  async getSettingByKey(key: string): Promise<SystemSetting | null> {
    const result = await pool.query('SELECT * FROM system_settings WHERE setting_key = $1', [key]);
    return result.rows[0] || null;
  }

  async getSettingValue<T = unknown>(key: string): Promise<T | null> {
    const result = await pool.query('SELECT setting_value FROM system_settings WHERE setting_key = $1', [key]);
    return result.rows[0]?.setting_value || null;
  }

  async createSetting(input: SystemSettingCreateInput): Promise<SystemSetting> {
    const { settingKey, settingValue, settingType, description, isLocked = false, updatedBy } = input;
    const query = `
      INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_locked, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (setting_key) DO UPDATE SET
        setting_value = $3,
        setting_type = $4,
        description = $5,
        is_locked = $6,
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      settingKey,
      JSON.stringify(settingValue),
      settingType,
      description || null,
      isLocked,
      updatedBy || null
    ]);
    return result.rows[0];
  }

  async updateSetting(key: string, input: SystemSettingUpdateInput): Promise<SystemSetting> {
    const { settingValue, description, isLocked } = input;
    const query = `
      UPDATE system_settings
      SET setting_value = COALESCE($1::jsonb, setting_value),
          description = COALESCE($2, description),
          is_locked = COALESCE($3, is_locked),
          updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      settingValue ? JSON.stringify(settingValue) : undefined,
      description || undefined,
      isLocked,
      key
    ]);
    return result.rows[0];
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM system_settings WHERE setting_key = $1 RETURNING id', [key]);
    return result.rows.length > 0;
  }

  async lockSetting(key: string): Promise<SystemSetting> {
    const query = `
      UPDATE system_settings
      SET is_locked = true, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = $1
      RETURNING *
    `;
    const result = await pool.query(query, [key]);
    return result.rows[0];
  }

  async unlockSetting(key: string): Promise<SystemSetting> {
    const query = `
      UPDATE system_settings
      SET is_locked = false, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = $1
      RETURNING *
    `;
    const result = await pool.query(query, [key]);
    return result.rows[0];
  }
}

export class SystemLogService {
  async getAllLogs(params?: {
    logLevel?: string;
    logCategory?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: SystemLog[]; total: number }> {
    const { logLevel, logCategory, startDate, endDate, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM system_logs';
    const values: any[] = [];
    const conditions: string[] = [];

    if (logLevel) {
      conditions.push('log_level = $' + (values.length + 1));
      values.push(logLevel);
    }
    if (logCategory) {
      conditions.push('log_category = $' + (values.length + 1));
      values.push(logCategory);
    }
    if (startDate) {
      conditions.push('created_at >= $' + (values.length + 1));
      values.push(startDate);
    }
    if (endDate) {
      conditions.push('created_at <= $' + (values.length + 1));
      values.push(endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM system_logs
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      logs: result.rows,
      total
    };
  }

  async getLogById(id: string): Promise<SystemLog | null> {
    const result = await pool.query('SELECT * FROM system_logs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createLog(input: SystemLogCreateInput): Promise<SystemLog> {
    const { logLevel, logCategory, message, stackTrace, metadata } = input;
    const query = `
      INSERT INTO system_logs (id, log_level, log_category, message, stack_trace, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      logLevel,
      logCategory,
      message,
      stackTrace || null,
      metadata ? JSON.stringify(metadata) : null
    ]);
    return result.rows[0];
  }

  async getErrorLogs(params?: { startDate?: string; endDate?: string }): Promise<SystemLog[]> {
    const { startDate, endDate } = params || {};
    let query = 'SELECT * FROM system_logs WHERE log_level IN ($1, $2, $3)';
    const values: any[] = [LogLevel.Error, LogLevel.Critical, LogLevel.Warning];

    if (startDate) {
      query += ' AND created_at >= $' + (values.length + 1);
      values.push(startDate);
    }
    if (endDate) {
      query += ' AND created_at <= $' + (values.length + 1);
      values.push(endDate);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }
}

export class CacheInvalidationService {
  async getAllInvalidations(params?: {
    cacheType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CacheInvalidation[]> {
    const { cacheType, startDate, endDate } = params || {};
    let query = 'SELECT * FROM cache_invalidation';
    const values: any[] = [];
    const conditions: string[] = [];

    if (cacheType) {
      conditions.push('cache_type = $' + (values.length + 1));
      values.push(cacheType);
    }
    if (startDate) {
      conditions.push('invalidated_at >= $' + (values.length + 1));
      values.push(startDate);
    }
    if (endDate) {
      conditions.push('invalidated_at <= $' + (values.length + 1));
      values.push(endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY invalidated_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  async createInvalidation(input: CacheInvalidationCreateInput): Promise<CacheInvalidation> {
    const { cacheKey, cacheType } = input;
    const query = `
      INSERT INTO cache_invalidation (id, cache_key, cache_type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      cacheKey,
      cacheType
    ]);
    return result.rows[0];
  }

  async invalidateAll(cacheType: string): Promise<void> {
    await pool.query('DELETE FROM cache_invalidation WHERE cache_type = $1', [cacheType]);
  }
}

export class ApiRateLimitService {
  async getRateLimit(ipAddress: string, endpoint: string, windowStart: string): Promise<ApiRateLimit | null> {
    const result = await pool.query(
      'SELECT * FROM api_rate_limits WHERE ip_address = $1 AND endpoint = $2 AND window_start = $3',
      [ipAddress, endpoint, windowStart]
    );
    return result.rows[0] || null;
  }

  async incrementRateLimit(input: ApiRateLimitCreateInput): Promise<ApiRateLimit> {
    const { ipAddress, endpoint, requestCount = 1 } = input;
    const query = `
      INSERT INTO api_rate_limits (id, ip_address, endpoint, request_count, window_start)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (ip_address, endpoint, window_start) DO UPDATE SET
        request_count = api_rate_limits.request_count + $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      ipAddress,
      endpoint,
      requestCount,
      new Date().toISOString()
    ]);
    return result.rows[0];
  }

  async getTopRateLimitedIPs(limit: number = 10): Promise<{ ipAddress: string; count: number }[]> {
    const result = await pool.query(`
      SELECT ip_address, SUM(request_count) as count
      FROM api_rate_limits
      WHERE window_start >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
      GROUP BY ip_address
      ORDER BY count DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async resetRateLimit(ipAddress: string, endpoint: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM api_rate_limits WHERE ip_address = $1 AND endpoint = $2 RETURNING id',
      [ipAddress, endpoint]
    );
    return result.rows.length > 0;
  }
}

export class MigrationService {
  async getAllMigrations(): Promise<Migration[]> {
    const result = await pool.query('SELECT * FROM migrations ORDER BY executed_at');
    return result.rows;
  }

  async getMigrationByName(name: string): Promise<Migration | null> {
    const result = await pool.query('SELECT * FROM migrations WHERE name = $1', [name]);
    return result.rows[0] || null;
  }

  async createMigration(input: MigrationCreateInput): Promise<Migration> {
    const { name } = input;
    const query = `
      INSERT INTO migrations (id, name)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [crypto.randomUUID(), name]);
    return result.rows[0] || null;
  }

  async markMigrationAsExecuted(name: string): Promise<Migration> {
    const query = `
      INSERT INTO migrations (id, name)
      VALUES ($1, $2)
      ON CONFLICT (name) DO UPDATE SET executed_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [crypto.randomUUID(), name]);
    return result.rows[0];
  }
}
