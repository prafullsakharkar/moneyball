// Database configuration for Scouting Service

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
    host: process.env.SCATING_DB_HOST || 'localhost',
    port: parseInt(process.env.SCATING_DB_PORT || '5432'),
    database: process.env.SCATING_DB_NAME || 'cricketiq_scouting',
    username: process.env.SCATING_DB_USER || 'postgres',
    password: process.env.SCATING_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.SCATING_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.SCATING_DB_TIMEOUT || '5000')
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
    // Scouting reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scouting_reports (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        scout_id UUID REFERENCES users(id),
        report_date DATE NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Draft',
        summary TEXT,
        overall_rating DECIMAL(3, 1),
        strengths TEXT[],
        weaknesses TEXT[],
        recommendations TEXT[],
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Scouting report sections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scouting_report_sections (
        id UUID PRIMARY KEY,
        report_id UUID NOT NULL REFERENCES scouting_reports(id) ON DELETE CASCADE,
        section_name VARCHAR(100) NOT NULL,
        content TEXT,
        rating DECIMAL(3, 1),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Scouting sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scouting_sessions (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        location VARCHAR(255),
        status VARCHAR(20) NOT NULL DEFAULT 'Planned',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Scouting session players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scouting_session_players (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES scouting_sessions(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id),
        assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, player_id)
      )
    `);

    // Player rankings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_rankings (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        format VARCHAR(20) NOT NULL,
        position VARCHAR(50) NOT NULL,
        ranking DECIMAL(5, 2) NOT NULL,
        total_players INTEGER NOT NULL,
        percentile DECIMAL(5, 2),
        evaluation_date DATE NOT NULL,
        criteria JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, format, position)
      )
    `);

    // Scouting notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scouting_notes (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        scout_id UUID REFERENCES users(id),
        note_type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        is_public BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_player ON scouting_reports(player_id);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON scouting_reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_date ON scouting_reports(report_date DESC);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON scouting_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_session_players_session ON scouting_session_players(session_id);
      CREATE INDEX IF NOT EXISTS idx_rankings_player ON player_rankings(player_id);
      CREATE INDEX IF NOT EXISTS idx_notes_player ON scouting_notes(player_id);
    `);

    console.log('Scouting database initialized successfully');
  } catch (error) {
    console.error('Error initializing scouting database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};