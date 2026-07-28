// Database configuration for Reporting Service

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
    host: process.env.REPORTING_DB_HOST || 'localhost',
    port: parseInt(process.env.REPORTING_DB_PORT || '5432'),
    database: process.env.REPORTING_DB_NAME || 'cricketiq_reporting',
    username: process.env.REPORTING_DB_USER || 'postgres',
    password: process.env.REPORTING_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.REPORTING_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.REPORTING_DB_TIMEOUT || '5000')
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
    // Reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        report_type VARCHAR(50) NOT NULL,
        report_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
        status VARCHAR(20) NOT NULL DEFAULT 'Draft',
        generated_at TIMESTAMP WITH TIME ZONE,
        file_url VARCHAR(500),
        parameters JSONB,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Report templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_templates (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        report_type VARCHAR(50) NOT NULL,
        template_type VARCHAR(50) NOT NULL,
        template_content TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Report schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_schedules (
        id UUID PRIMARY KEY,
        report_id UUID REFERENCES reports(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        schedule_type VARCHAR(50) NOT NULL,
        cron_expression VARCHAR(100),
        start_date DATE NOT NULL,
        end_date DATE,
        recipients TEXT[],
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Report logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_logs (
        id UUID PRIMARY KEY,
        report_id UUID REFERENCES reports(id),
        scheduled_id UUID REFERENCES report_schedules(id),
        status VARCHAR(20) NOT NULL,
        started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        error_message TEXT,
        file_url VARCHAR(500)
      )
    `);

    // Report permissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_permissions (
        id UUID PRIMARY KEY,
        report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        permission_level VARCHAR(20) NOT NULL DEFAULT 'View',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(report_id, user_id)
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_templates_type ON report_templates(report_type);
      CREATE INDEX IF NOT EXISTS idx_schedules_report ON report_schedules(report_id);
      CREATE INDEX IF NOT EXISTS idx_logs_report ON report_logs(report_id);
    `);

    console.log('Reporting database initialized successfully');
  } catch (error) {
    console.error('Error initializing reporting database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};