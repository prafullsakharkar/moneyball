// Database configuration for Training Service

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
    host: process.env.TRAINING_DB_HOST || 'localhost',
    port: parseInt(process.env.TRAINING_DB_PORT || '5432'),
    database: process.env.TRAINING_DB_NAME || 'cricketiq_training',
    username: process.env.TRAINING_DB_USER || 'postgres',
    password: process.env.TRAINING_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.TRAINING_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.TRAINING_DB_TIMEOUT || '5000')
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
    // Training sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_sessions (
        id UUID PRIMARY KEY,
        team_id UUID REFERENCES teams(id),
        coach_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        session_type VARCHAR(50) NOT NULL,
        scheduled_date DATE NOT NULL,
        start_time TIME WITH TIME ZONE,
        end_time TIME WITH TIME ZONE,
        venue_id UUID REFERENCES venues(id),
        status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
        duration_minutes INTEGER,
        equipment JSONB,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Training session players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_session_players (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id),
        attendance_status VARCHAR(20) NOT NULL DEFAULT 'NotAttended',
        performance_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, player_id)
      )
    `);

    // Training drills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_drills (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        drill_type VARCHAR(50) NOT NULL,
        difficulty_level VARCHAR(20) NOT NULL,
        duration_minutes INTEGER,
        equipment_required TEXT[],
        objectives TEXT[],
        instructions TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Training session drills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_session_drills (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
        drill_id UUID NOT NULL REFERENCES training_drills(id),
        order_number INTEGER NOT NULL,
        duration_minutes INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player fitness tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_fitness (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        session_id UUID REFERENCES training_sessions(id),
        date DATE NOT NULL,
        fitness_type VARCHAR(50) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Training reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_reports (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
        report_type VARCHAR(50) NOT NULL,
        data JSONB,
        generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_team ON training_sessions(team_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_date ON training_sessions(scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON training_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_session_players_session ON training_session_players(session_id);
      CREATE INDEX IF NOT EXISTS idx_drills_type ON training_drills(drill_type);
      CREATE INDEX IF NOT EXISTS idx_fitness_player ON player_fitness(player_id);
    `);

    console.log('Training database initialized successfully');
  } catch (error) {
    console.error('Error initializing training database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};