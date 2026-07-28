// Database configuration for Scoring Service

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
    host: process.env.SCORING_DB_HOST || 'localhost',
    port: parseInt(process.env.SCORING_DB_PORT || '5432'),
    database: process.env.SCORING_DB_NAME || 'cricketiq_scoring',
    username: process.env.SCORING_DB_USER || 'postgres',
    password: process.env.SCORING_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.SCORING_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.SCORING_DB_TIMEOUT || '5000')
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
    // Scoring sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_sessions (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        session_status VARCHAR(20) NOT NULL DEFAULT 'Active',
        innings_number INTEGER NOT NULL,
        current_over INTEGER NOT NULL DEFAULT 0,
        current_ball INTEGER NOT NULL DEFAULT 0,
        runs INTEGER NOT NULL DEFAULT 0,
        wickets INTEGER NOT NULL DEFAULT 0,
        extras INTEGER NOT NULL DEFAULT 0,
        last_ball_by UUID REFERENCES players(id),
        last_ball_to UUID REFERENCES players(id),
        last_ball_result VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID,
        UNIQUE(match_id, innings_number)
      )
    `);

    // Scoring events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_events (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES scoring_sessions(id) ON DELETE CASCADE,
        match_id UUID NOT NULL REFERENCES matches(id),
        over_number INTEGER NOT NULL,
        ball_number INTEGER NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_outcome VARCHAR(50) NOT NULL,
        runs_scored INTEGER NOT NULL DEFAULT 0,
        is_wicket BOOLEAN NOT NULL DEFAULT FALSE,
        is_extras BOOLEAN NOT NULL DEFAULT FALSE,
        extras_type VARCHAR(50),
        extras_runs INTEGER NOT NULL DEFAULT 0,
        bowler_id UUID REFERENCES players(id),
        batter_id UUID REFERENCES players(id),
        fielder_id UUID REFERENCES players(id),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID
      )
    `);

    // Scoring notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_notes (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES scoring_sessions(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        note_type VARCHAR(50) NOT NULL,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Scoring audit log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_audit_log (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES scoring_sessions(id) ON DELETE CASCADE,
        match_id UUID NOT NULL REFERENCES matches(id),
        event_type VARCHAR(50) NOT NULL,
        old_value JSONB,
        new_value JSONB,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_scoring_sessions_match ON scoring_sessions(match_id);
      CREATE INDEX IF NOT EXISTS idx_scoring_sessions_innings ON scoring_sessions(match_id, innings_number);
      CREATE INDEX IF NOT EXISTS idx_scoring_events_session ON scoring_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_scoring_events_match ON scoring_events(match_id);
      CREATE INDEX IF NOT EXISTS idx_scoring_audit_session ON scoring_audit_log(session_id);
    `);

    console.log('Scoring database initialized successfully');
  } catch (error) {
    console.error('Error initializing scoring database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
