// Database configuration for Video Analysis Service

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
    host: process.env.VIDEO_ANALYSIS_DB_HOST || 'localhost',
    port: parseInt(process.env.VIDEO_ANALYSIS_DB_PORT || '5432'),
    database: process.env.VIDEO_ANALYSIS_DB_NAME || 'cricketiq_video_analysis',
    username: process.env.VIDEO_ANALYSIS_DB_USER || 'postgres',
    password: process.env.VIDEO_ANALYSIS_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.VIDEO_ANALYSIS_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.VIDEO_ANALYSIS_DB_TIMEOUT || '5000')
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
    // Video analysis sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_analysis_sessions (
        id UUID PRIMARY KEY,
        match_id UUID REFERENCES matches(id),
        player_id UUID REFERENCES players(id),
        video_url VARCHAR(500) NOT NULL,
        analysis_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        result_url VARCHAR(500),
        confidence_score DECIMAL(5, 2),
        duration DECIMAL(10, 2),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Video analysis results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_analysis_results (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES video_analysis_sessions(id) ON DELETE CASCADE,
        analysis_type VARCHAR(50) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(10, 2),
        metric_unit VARCHAR(50),
        confidence_score DECIMAL(5, 2),
        timestamp_range JSONB,
        insights TEXT[],
        recommendations TEXT[],
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Video annotations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_annotations (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES video_analysis_sessions(id) ON DELETE CASCADE,
        annotation_type VARCHAR(50) NOT NULL,
        timestamp_start DECIMAL(10, 2) NOT NULL,
        timestamp_end DECIMAL(10, 2) NOT NULL,
        description TEXT,
        tags TEXT[],
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Video highlights table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_highlights (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES video_analysis_sessions(id) ON DELETE CASCADE,
        highlight_type VARCHAR(50) NOT NULL,
        timestamp_start DECIMAL(10, 2) NOT NULL,
        timestamp_end DECIMAL(10, 2) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Video tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_tags (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES video_analysis_sessions(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        confidence DECIMAL(5, 2),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, tag)
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_match ON video_analysis_sessions(match_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_player ON video_analysis_sessions(player_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON video_analysis_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_results_session ON video_analysis_results(session_id);
      CREATE INDEX IF NOT EXISTS idx_annotations_session ON video_annotations(session_id);
      CREATE INDEX IF NOT EXISTS idx_highlights_session ON video_highlights(session_id);
    `);

    console.log('Video Analysis database initialized successfully');
  } catch (error) {
    console.error('Error initializing video analysis database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};