// Database configuration for Sponsorship Service

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
    host: process.env.SPONSORSHIP_DB_HOST || 'localhost',
    port: parseInt(process.env.SPONSORSHIP_DB_PORT || '5432'),
    database: process.env.SPONSORSHIP_DB_NAME || 'cricketiq_sponsorship',
    username: process.env.SPONSORSHIP_DB_USER || 'postgres',
    password: process.env.SPONSORSHIP_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.SPONSORSHIP_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.SPONSORSHIP_DB_TIMEOUT || '5000')
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
    // Sponsors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sponsor_type VARCHAR(50) NOT NULL,
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sponsorship packages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsorship_packages (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sponsor_id UUID REFERENCES sponsors(id),
        price DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        benefits TEXT[],
        max_exposure VARCHAR(50),
        duration_days INTEGER NOT NULL DEFAULT 365,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sponsorship deals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsorship_deals (
        id UUID PRIMARY KEY,
        sponsor_id UUID REFERENCES sponsors(id),
        package_id UUID REFERENCES sponsorship_packages(id),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_amount DECIMAL(12, 2) NOT NULL,
        payment_terms TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Deal payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS deal_payments (
        id UUID PRIMARY KEY,
        deal_id UUID REFERENCES sponsorship_deals(id),
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        payment_date DATE NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        transaction_reference VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sponsorship assets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsorship_assets (
        id UUID PRIMARY KEY,
        deal_id UUID REFERENCES sponsorship_deals(id),
        asset_type VARCHAR(50) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size BIGINT,
        mime_type VARCHAR(100),
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);
      CREATE INDEX IF NOT EXISTS idx_packages_sponsor ON sponsorship_packages(sponsor_id);
      CREATE INDEX IF NOT EXISTS idx_deals_sponsor ON sponsorship_deals(sponsor_id);
      CREATE INDEX IF NOT EXISTS idx_deals_entity ON sponsorship_deals(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_deals_status ON sponsorship_deals(status);
      CREATE INDEX IF NOT EXISTS idx_payments_deal ON deal_payments(deal_id);
      CREATE INDEX IF NOT EXISTS idx_assets_deal ON sponsorship_assets(deal_id);
    `);

    console.log('Sponsorship database initialized successfully');
  } catch (error) {
    console.error('Error initializing sponsorship database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
