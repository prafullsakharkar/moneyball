// Database configuration for Media Service

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
    host: process.env.MEDIA_DB_HOST || 'localhost',
    port: parseInt(process.env.MEDIA_DB_PORT || '5432'),
    database: process.env.MEDIA_DB_NAME || 'cricketiq_media',
    username: process.env.MEDIA_DB_USER || 'postgres',
    password: process.env.MEDIA_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.MEDIA_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.MEDIA_DB_TIMEOUT || '5000')
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
    // Media files table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id UUID PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size BIGINT NOT NULL,
        file_format VARCHAR(50) NOT NULL,
        storage_provider VARCHAR(20) NOT NULL DEFAULT 's3',
        bucket_name VARCHAR(100),
        object_key VARCHAR(500),
        thumbnail_url VARCHAR(500),
        duration DECIMAL(10, 2),
        width INTEGER,
        height INTEGER,
        metadata JSONB,
        is_primary BOOLEAN NOT NULL DEFAULT false,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Media albums table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_albums (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        cover_image_id UUID REFERENCES media_files(id),
        is_private BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Media album items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_album_items (
        id UUID PRIMARY KEY,
        album_id UUID NOT NULL REFERENCES media_albums(id) ON DELETE CASCADE,
        media_file_id UUID NOT NULL REFERENCES media_files(id),
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Media tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_tags (
        id UUID PRIMARY KEY,
        media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(media_file_id, tag)
      )
    `);

    // Media analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_analytics (
        id UUID PRIMARY KEY,
        media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
        views INTEGER NOT NULL DEFAULT 0,
        downloads INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        shares INTEGER NOT NULL DEFAULT 0,
        last_viewed_at TIMESTAMP WITH TIME ZONE,
        last_downloaded_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(media_file_id)
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_files_entity ON media_files(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);
      CREATE INDEX IF NOT EXISTS idx_media_files_active ON media_files(is_active);
      CREATE INDEX IF NOT EXISTS idx_media_albums_entity ON media_albums(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_media_tags_tag ON media_tags(tag);
      CREATE INDEX IF NOT EXISTS idx_media_analytics_views ON media_analytics(views DESC);
    `);

    console.log('Media database initialized successfully');
  } catch (error) {
    console.error('Error initializing media database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};