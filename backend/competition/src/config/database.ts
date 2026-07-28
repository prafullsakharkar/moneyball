// Database configuration for Competition Service

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
    host: process.env.COMPETITION_DB_HOST || 'localhost',
    port: parseInt(process.env.COMPETITION_DB_PORT || '5432'),
    database: process.env.COMPETITION_DB_NAME || 'cricketiq_competition',
    username: process.env.COMPETITION_DB_USER || 'postgres',
    password: process.env.COMPETITION_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.COMPETITION_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.COMPETITION_DB_TIMEOUT || '5000')
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
    // Competitions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS competitions (
        id UUID PRIMARY KEY,
        external_id UUID,
        organization_id UUID NOT NULL REFERENCES organizations(id),
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50) NOT NULL,
        description TEXT,
        format VARCHAR(20) NOT NULL,
        competition_type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        gender VARCHAR(20),
        age_group VARCHAR(20),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        registration_deadline DATE,
        venue_id UUID REFERENCES venues(id),
        prize_pool JSONB,
        sponsor_ids UUID[],
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Seasons table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seasons (
        id UUID PRIMARY KEY,
        competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Groups table (for Round Robin/Group stages)
    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY,
        competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
        season_id UUID REFERENCES seasons(id),
        name VARCHAR(100) NOT NULL,
        group_type VARCHAR(50) NOT NULL,
        teams UUID[],
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fixtures table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fixtures (
        id UUID PRIMARY KEY,
        competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
        season_id UUID REFERENCES seasons(id),
        group_id UUID REFERENCES groups(id),
        match_id UUID REFERENCES matches(id),
        round INTEGER NOT NULL,
        stage VARCHAR(50) NOT NULL,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME WITH TIME ZONE,
        venue_id UUID REFERENCES venues(id),
        team1_id UUID REFERENCES teams(id),
        team2_id UUID REFERENCES teams(id),
        status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Standings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS standings (
        id UUID PRIMARY KEY,
        competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
        season_id UUID REFERENCES seasons(id),
        group_id UUID REFERENCES groups(id),
        team_id UUID NOT NULL REFERENCES teams(id),
        matches_played INTEGER NOT NULL DEFAULT 0,
        matches_won INTEGER NOT NULL DEFAULT 0,
        matches_lost INTEGER NOT NULL DEFAULT 0,
        matches_tied INTEGER NOT NULL DEFAULT 0,
        matches_no_result INTEGER NOT NULL DEFAULT 0,
        points INTEGER NOT NULL DEFAULT 0,
        net_run_rate DECIMAL(10, 3),
        position INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(competition_id, season_id, group_id, team_id)
      )
    `);

    // Tournament teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tournament_teams (
        id UUID PRIMARY KEY,
        tournament_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams(id),
        registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
        squad UUID[],
        captain_id UUID REFERENCES players(id),
        coach_id UUID REFERENCES users(id),
        status VARCHAR(20) NOT NULL DEFAULT 'Registered',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tournament_id, team_id)
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_competitions_organization ON competitions(organization_id);
      CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
      CREATE INDEX IF NOT EXISTS idx_competitions_date ON competitions(start_date, end_date);
      CREATE INDEX IF NOT EXISTS idx_fixtures_competition ON fixtures(competition_id);
      CREATE INDEX IF NOT EXISTS idx_fixtures_team1 ON fixtures(team1_id);
      CREATE INDEX IF NOT EXISTS idx_fixtures_team2 ON fixtures(team2_id);
      CREATE INDEX IF NOT EXISTS idx_standings_competition ON standings(competition_id);
      CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament ON tournament_teams(tournament_id);
    `);

    console.log('Competition database initialized successfully');
  } catch (error) {
    console.error('Error initializing competition database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
