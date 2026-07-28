// Database configuration for Admin Service

import { Pool } from 'pg';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  maxConnections: number;
  connectionTimeout: number;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.ADMIN_DB_HOST || 'localhost',
    port: parseInt(process.env.ADMIN_DB_PORT || '5432'),
    database: process.env.ADMIN_DB_NAME || 'cricketiq_admin',
    username: process.env.ADMIN_DB_USER || 'postgres',
    password: process.env.ADMIN_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.ADMIN_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.ADMIN_DB_TIMEOUT || '5000')
  };
};

export const createPool = (): Pool => {
  const config = getDatabaseConfig();
  return new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    max: config.maxConnections,
    connectionTimeoutMillis: config.connectionTimeout
  });
};

export const pool = createPool();

// Initialize database tables
export const initializeDatabase = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID,
        old_values JSONB,
        new_values JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // System settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value JSONB,
        setting_type VARCHAR(50) NOT NULL,
        description TEXT,
        is_locked BOOLEAN NOT NULL DEFAULT false,
        updated_by UUID REFERENCES users(id),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // System logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id UUID PRIMARY KEY,
        log_level VARCHAR(20) NOT NULL,
        log_category VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        stack_trace TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cache invalidation table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cache_invalidation (
        id UUID PRIMARY KEY,
        cache_key VARCHAR(255) NOT NULL,
        cache_type VARCHAR(50) NOT NULL,
        invalidated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // API rate limits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_rate_limits (
        id UUID PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        request_count INTEGER NOT NULL DEFAULT 1,
        window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ip_address, endpoint, window_start)
      )
    `);

    // Database migrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level);
      CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(log_category);
      CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_cache_invalidation_key ON cache_invalidation(cache_key);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON api_rate_limits(ip_address);
    `);

    console.log('Admin database initialized successfully');
  } catch (error) {
    console.error('Error initializing admin database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
