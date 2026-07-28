// Database configuration for Notification Service

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
    host: process.env.NOTIFICATION_DB_HOST || 'localhost',
    port: parseInt(process.env.NOTIFICATION_DB_PORT || '5432'),
    database: process.env.NOTIFICATION_DB_NAME || 'cricketiq_notification',
    username: process.env.NOTIFICATION_DB_USER || 'postgres',
    password: process.env.NOTIFICATION_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.NOTIFICATION_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.NOTIFICATION_DB_TIMEOUT || '5000')
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
    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL DEFAULT 'Normal',
        status VARCHAR(20) NOT NULL DEFAULT 'Unread',
        read_at TIMESTAMP WITH TIME ZONE,
        action_url VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notification templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_templates (
        id UUID PRIMARY KEY,
        template_name VARCHAR(100) UNIQUE NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        title_template VARCHAR(255) NOT NULL,
        message_template TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL DEFAULT 'Normal',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notification preferences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        notification_type VARCHAR(50) NOT NULL,
        channel VARCHAR(20) NOT NULL,
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, notification_type, channel)
      )
    `);

    // Notification sent history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_sent_history (
        id UUID PRIMARY KEY,
        notification_id UUID REFERENCES notifications(id),
        user_id UUID NOT NULL REFERENCES users(id),
        notification_type VARCHAR(50) NOT NULL,
        channel VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        error_message TEXT
      )
    `);

    // Push tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS push_tokens (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        token VARCHAR(500) NOT NULL,
        device_type VARCHAR(20) NOT NULL,
        device_name VARCHAR(100),
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_used_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, token)
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_preferences_user ON notification_preferences(user_id);
      CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id);
    `);

    console.log('Notification database initialized successfully');
  } catch (error) {
    console.error('Error initializing notification database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};