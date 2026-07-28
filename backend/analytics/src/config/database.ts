// Database configuration for Analytics Service

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
    host: process.env.ANALYTICS_DB_HOST || 'localhost',
    port: parseInt(process.env.ANALYTICS_DB_PORT || '5432'),
    database: process.env.ANALYTICS_DB_NAME || 'cricketiq_analytics',
    username: process.env.ANALYTICS_DB_USER || 'postgres',
    password: process.env.ANALYTICS_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.ANALYTICS_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.ANALYTICS_DB_TIMEOUT || '5000')
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
    // Player stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        format VARCHAR(20) NOT NULL,
        matches INTEGER NOT NULL DEFAULT 0,
        innings INTEGER NOT NULL DEFAULT 0,
        runs INTEGER NOT NULL DEFAULT 0,
        highest_score VARCHAR(10),
        average DECIMAL(10, 2),
        strike_rate DECIMAL(10, 2),
        centuries INTEGER NOT NULL DEFAULT 0,
        fifties INTEGER NOT NULL DEFAULT 0,
        ducks INTEGER NOT NULL DEFAULT 0,
        wickets INTEGER NOT NULL DEFAULT 0,
        best_bowling VARCHAR(20),
        economy_rate DECIMAL(10, 2),
        catches INTEGER NOT NULL DEFAULT 0,
        stumpings INTEGER NOT NULL DEFAULT 0,
        matches_as_captain INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, format)
      )
    `);

    // Team stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_stats (
        id UUID PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id),
        format VARCHAR(20) NOT NULL,
        matches INTEGER NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0,
        ties INTEGER NOT NULL DEFAULT 0,
        no_results INTEGER NOT NULL DEFAULT 0,
        win_percentage DECIMAL(5, 2),
        home_matches INTEGER NOT NULL DEFAULT 0,
        home_wins INTEGER NOT NULL DEFAULT 0,
        away_matches INTEGER NOT NULL DEFAULT 0,
        away_wins INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, format)
      )
    `);

    // Match analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_analytics (
        id UUID PRIMARY KEY,
        match_id UUID NOT NULL REFERENCES matches(id),
        team1_id UUID NOT NULL REFERENCES teams(id),
        team2_id UUID NOT NULL REFERENCES teams(id),
        venue_id UUID REFERENCES venues(id),
        toss_winner_id UUID REFERENCES teams(id),
        toss_decision VARCHAR(20),
        first_innings_score INTEGER,
        second_innings_score INTEGER,
        result VARCHAR(50),
        winning_margin VARCHAR(50),
        player_of_the_match UUID REFERENCES players(id),
        crowd_count INTEGER,
        weather_conditions VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(match_id)
      )
    `);

    // Player performance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_performance (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id),
        match_id UUID NOT NULL REFERENCES matches(id),
        runs_scored INTEGER NOT NULL DEFAULT 0,
        balls_faced INTEGER NOT NULL DEFAULT 0,
        fours INTEGER NOT NULL DEFAULT 0,
        sixes INTEGER NOT NULL DEFAULT 0,
        wickets_taken INTEGER NOT NULL DEFAULT 0,
        runs_conceded INTEGER NOT NULL DEFAULT 0,
        catches INTEGER NOT NULL DEFAULT 0,
        stumpings INTEGER NOT NULL DEFAULT 0,
        catches_as_captain INTEGER NOT NULL DEFAULT 0,
        stumpings_as_captain INTEGER NOT NULL DEFAULT 0,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, match_id)
      )
    `);

    // Leaderboard table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboards (
        id UUID PRIMARY KEY,
        competition_id UUID NOT NULL REFERENCES competitions(id),
        season_id UUID REFERENCES seasons(id),
        category VARCHAR(50) NOT NULL,
        player_id UUID NOT NULL REFERENCES players(id),
        value DECIMAL(20, 2) NOT NULL,
        rank INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(competition_id, season_id, category, player_id)
      )
    `);

    // Search index table
    await client.query(`
      CREATE TABLE IF NOT EXISTS search_index (
        id UUID PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        tags TEXT[],
        full_text_search tsvector,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create GIN index for full-text search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_search_full_text ON search_index USING GIN (full_text_search)
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_stats(player_id);
      CREATE INDEX IF NOT EXISTS idx_team_stats_team ON team_stats(team_id);
      CREATE INDEX IF NOT EXISTS idx_match_analytics_match ON match_analytics(match_id);
      CREATE INDEX IF NOT EXISTS idx_player_performance_player ON player_performance(player_id);
      CREATE INDEX IF NOT EXISTS idx_leaderboard_competition ON leaderboards(competition_id);
    `);

    console.log('Analytics database initialized successfully');
  } catch (error) {
    console.error('Error initializing analytics database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
