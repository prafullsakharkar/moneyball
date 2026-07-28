// Database configuration for Match Service

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
    host: process.env.MATCH_DB_HOST || 'localhost',
    port: parseInt(process.env.MATCH_DB_PORT || '5432'),
    database: process.env.MATCH_DB_NAME || 'cricketiq_match',
    username: process.env.MATCH_DB_USER || 'postgres',
    password: process.env.MATCH_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.MATCH_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.MATCH_DB_TIMEOUT || '5000')
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
    // Matches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY,
        external_id UUID,
        tournament_id UUID REFERENCES tournaments(id),
        competition_id UUID REFERENCES competitions(id),
        team1_id UUID NOT NULL REFERENCES teams(id),
        team2_id UUID NOT NULL REFERENCES teams(id),
        venue_id UUID REFERENCES venues(id),
        format VARCHAR(20) NOT NULL,
        match_type VARCHAR(50) NOT NULL,
        match_status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
        scheduled_start TIMESTAMP WITH TIME ZONE,
        actual_start TIMESTAMP WITH TIME ZONE,
        actual_end TIMESTAMP WITH TIME ZONE,
        toss_winner_id UUID REFERENCES teams(id),
        toss_decision VARCHAR(20),
        first_innings_team_id UUID REFERENCES teams(id),
        second_innings_team_id UUID REFERENCES teams(id),
        result VARCHAR(100),
        winner_id UUID REFERENCES teams(id),
        margin VARCHAR(50),
        player_of_the_match UUID REFERENCES players(id),
        weather JSONB,
        match_notes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Match officials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_officials (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        official_id UUID NOT NULL REFERENCES users(id),
        role VARCHAR(50) NOT NULL,
        assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP WITH TIME ZONE
      )
    `);

    // Match playing XI table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_playing_xi (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams(id),
        player_id UUID NOT NULL REFERENCES players(id),
        is_starter BOOLEAN NOT NULL DEFAULT TRUE,
        batting_order INTEGER,
        bowling_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Match schedule table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_schedule (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME WITH TIME ZONE NOT NULL,
        timezone VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Match notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_notes (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        note_type VARCHAR(50) NOT NULL,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
      CREATE INDEX IF NOT EXISTS idx_matches_competition ON matches(competition_id);
      CREATE INDEX IF NOT EXISTS idx_matches_team1 ON matches(team1_id);
      CREATE INDEX IF NOT EXISTS idx_matches_team2 ON matches(team2_id);
      CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(match_status);
      CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(scheduled_start);
      CREATE INDEX IF NOT EXISTS idx_match_officials_match ON match_officials(match_id);
      CREATE INDEX IF NOT EXISTS idx_match_playing_xi_match ON match_playing_xi(match_id);
    `);

    console.log('Match database initialized successfully');
  } catch (error) {
    console.error('Error initializing match database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
