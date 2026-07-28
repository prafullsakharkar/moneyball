// Database configuration for Auction Service

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
    host: process.env.AUCTION_DB_HOST || 'localhost',
    port: parseInt(process.env.AUCTION_DB_PORT || '5432'),
    database: process.env.AUCTION_DB_NAME || 'cricketiq_auction',
    username: process.env.AUCTION_DB_USER || 'postgres',
    password: process.env.AUCTION_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.AUCTION_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.AUCTION_DB_TIMEOUT || '5000')
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
    // Auctions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        auction_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE,
        venue_id UUID REFERENCES venues(id),
        organizer_id UUID REFERENCES organizations(id),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auction players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_players (
        id UUID PRIMARY KEY,
        auction_id UUID REFERENCES auctions(id),
        player_id UUID REFERENCES players(id),
        base_price DECIMAL(12, 2) NOT NULL,
        current_price DECIMAL(12, 2) DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'Available',
        team_id UUID REFERENCES teams(id),
        bid_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(auction_id, player_id)
      )
    `);

    // Auction teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_teams (
        id UUID PRIMARY KEY,
        auction_id UUID REFERENCES auctions(id),
        team_id UUID REFERENCES teams(id),
        budget DECIMAL(12, 2) NOT NULL,
        spent DECIMAL(12, 2) DEFAULT 0,
        players_hired INTEGER NOT NULL DEFAULT 0,
        max_players INTEGER NOT NULL DEFAULT 25,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(auction_id, team_id)
      )
    `);

    // Auction bids table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_bids (
        id UUID PRIMARY KEY,
        auction_id UUID REFERENCES auctions(id),
        player_id UUID REFERENCES auction_players(id),
        team_id UUID REFERENCES teams(id),
        bidder_id UUID REFERENCES users(id),
        amount DECIMAL(12, 2) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auction logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_logs (
        id UUID PRIMARY KEY,
        auction_id UUID REFERENCES auctions(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id UUID,
        user_id UUID REFERENCES users(id),
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
      CREATE INDEX IF NOT EXISTS idx_auctions_date ON auctions(start_date);
      CREATE INDEX IF NOT EXISTS idx_auction_players_status ON auction_players(status);
      CREATE INDEX IF NOT EXISTS idx_auction_teams_auction ON auction_teams(auction_id);
      CREATE INDEX IF NOT EXISTS idx_auction_bids_player ON auction_bids(player_id);
      CREATE INDEX IF NOT EXISTS idx_auction_logs_auction ON auction_logs(auction_id);
    `);

    console.log('Auction database initialized successfully');
  } catch (error) {
    console.error('Error initializing auction database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
