// Database configuration for Player Service

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
    host: process.env.PLAYER_DB_HOST || 'localhost',
    port: parseInt(process.env.PLAYER_DB_PORT || '5432'),
    database: process.env.PLAYER_DB_NAME || 'cricketiq_player',
    username: process.env.PLAYER_DB_USER || 'postgres',
    password: process.env.PLAYER_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.PLAYER_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.PLAYER_DB_TIMEOUT || '5000')
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
    // Players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id UUID PRIMARY KEY,
        external_id UUID,
        user_id UUID REFERENCES users(id),
        organization_id UUID REFERENCES organizations(id),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        date_of_birth DATE,
        age INTEGER,
        gender VARCHAR(20),
        primary_role VARCHAR(50) NOT NULL,
        secondary_role VARCHAR(50),
        batting_style VARCHAR(50),
        bowling_style VARCHAR(50),
        fielding_skills TEXT[],
        profile_image VARCHAR(500),
        bio TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Player stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        matches_played INTEGER NOT NULL DEFAULT 0,
        runs_scored INTEGER NOT NULL DEFAULT 0,
        balls_faced INTEGER NOT NULL DEFAULT 0,
        batting_average DECIMAL(10, 2),
        strike_rate DECIMAL(10, 2),
        centuries INTEGER NOT NULL DEFAULT 0,
        half_centuries INTEGER NOT NULL DEFAULT 0,
        wickets_taken INTEGER NOT NULL DEFAULT 0,
        balls_bowled INTEGER NOT NULL DEFAULT 0,
        bowling_average DECIMAL(10, 2),
        economy_rate DECIMAL(10, 2),
        catches INTEGER NOT NULL DEFAULT 0,
        run_outs INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player fitness table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_fitness (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        height_cm INTEGER,
        weight_kg DECIMAL(5, 2),
        bmi DECIMAL(5, 2),
        run_100m_time DECIMAL(5, 2),
        run_20m_time DECIMAL(5, 2),
        throw_distance_m DECIMAL(5, 2),
        bowling_speed_kmh DECIMAL(5, 2),
        batting_strength INTEGER,
        fitness_score INTEGER,
        last_assessment DATE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player medical records table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_medical (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        blood_type VARCHAR(10),
        allergies TEXT[],
        medical_conditions TEXT[],
        current_medications TEXT[],
        injury_history TEXT[],
        last_medical_checkup DATE,
        medical_status VARCHAR(20) NOT NULL DEFAULT 'Fit',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player contracts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_contracts (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id),
        organization_id UUID REFERENCES organizations(id),
        contract_type VARCHAR(50) NOT NULL,
        base_price DECIMAL(15, 2),
        contract_start DATE NOT NULL,
        contract_end DATE NOT NULL,
        contract_status VARCHAR(20) NOT NULL DEFAULT 'Active',
        contract_document VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_documents (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        document_type VARCHAR(100) NOT NULL,
        document_url VARCHAR(500) NOT NULL,
        document_name VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        uploaded_by UUID,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_at TIMESTAMP WITH TIME ZONE,
        verified_by UUID
      )
    `);

    // Player match history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_match_history (
        id UUID PRIMARY KEY,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        match_id UUID NOT NULL,
        team_id UUID NOT NULL,
        runs_scored INTEGER,
        balls_faced INTEGER,
        wickets_taken INTEGER,
        overs_bowled DECIMAL(4, 1),
        catches INTEGER,
        run_outs INTEGER,
        is_man_of_the_match BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_players_organization ON players(organization_id);
      CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
      CREATE INDEX IF NOT EXISTS idx_players_name ON players(first_name, last_name);
      CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_stats(player_id);
      CREATE INDEX IF NOT EXISTS idx_player_fitness_player ON player_fitness(player_id);
      CREATE INDEX IF NOT EXISTS idx_player_match_history_player ON player_match_history(player_id);
    `);

    console.log('Player database initialized successfully');
  } catch (error) {
    console.error('Error initializing player database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
