// Database configuration for Team Service

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
    host: process.env.TEAM_DB_HOST || 'localhost',
    port: parseInt(process.env.TEAM_DB_PORT || '5432'),
    database: process.env.TEAM_DB_NAME || 'cricketiq_team',
    username: process.env.TEAM_DB_USER || 'postgres',
    password: process.env.TEAM_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.TEAM_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.TEAM_DB_TIMEOUT || '5000')
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
    // Teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY,
        external_id UUID,
        organization_id UUID NOT NULL REFERENCES organizations(id),
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50) NOT NULL,
        logo VARCHAR(500),
        colors JSONB,
        format VARCHAR(20) NOT NULL,
        team_type VARCHAR(50) NOT NULL,
        team_category VARCHAR(50) NOT NULL,
        gender VARCHAR(20),
        age_group VARCHAR(20),
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        description TEXT,
        website VARCHAR(255),
        social_media JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Team rosters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_rosters (
        id UUID PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        jersey_number INTEGER,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        joined_date DATE NOT NULL,
        left_date DATE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, player_id)
      )
    `);

    // Team captains table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_captains (
        id UUID PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id),
        appointed_date DATE NOT NULL,
        ended_date DATE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Team coaches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_coaches (
        id UUID PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        coach_id UUID NOT NULL REFERENCES users(id),
        role VARCHAR(50) NOT NULL,
        started_date DATE NOT NULL,
        ended_date DATE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Team stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_stats (
        id UUID PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        matches_played INTEGER NOT NULL DEFAULT 0,
        matches_won INTEGER NOT NULL DEFAULT 0,
        matches_lost INTEGER NOT NULL DEFAULT 0,
        matches_tied INTEGER NOT NULL DEFAULT 0,
        matches_no_result INTEGER NOT NULL DEFAULT 0,
        win_percentage DECIMAL(5, 2),
        runs_scored INTEGER NOT NULL DEFAULT 0,
        wickets_taken INTEGER NOT NULL DEFAULT 0,
        average_run_rate DECIMAL(5, 2),
        average_opposition_run_rate DECIMAL(5, 2),
        last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_teams_organization ON teams(organization_id);
      CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
      CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
      CREATE INDEX IF NOT EXISTS idx_team_rosters_team ON team_rosters(team_id);
      CREATE INDEX IF NOT EXISTS idx_team_rosters_player ON team_rosters(player_id);
      CREATE INDEX IF NOT EXISTS idx_team_stats_team ON team_stats(team_id);
    `);

    console.log('Team database initialized successfully');
  } catch (error) {
    console.error('Error initializing team database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
