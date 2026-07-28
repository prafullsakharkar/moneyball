// Database configuration for Organization Service

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
    host: process.env.ORGANIZATION_DB_HOST || 'localhost',
    port: parseInt(process.env.ORGANIZATION_DB_PORT || '5432'),
    database: process.env.ORGANIZATION_DB_NAME || 'cricketiq_organization',
    username: process.env.ORGANIZATION_DB_USER || 'postgres',
    password: process.env.ORGANIZATION_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.ORGANIZATION_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.ORGANIZATION_DB_TIMEOUT || '5000')
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
    // Organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY,
        external_id UUID,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50) NOT NULL,
        logo VARCHAR(500),
        description TEXT,
        organization_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        website VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        address JSONB,
        contact JSONB,
        social_media JSONB,
        settings JSONB,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_at TIMESTAMP WITH TIME ZONE,
        verified_by UUID,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Organization hierarchy table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_hierarchy (
        id UUID PRIMARY KEY,
        parent_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        child_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        relationship_type VARCHAR(50) NOT NULL,
        started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(parent_id, child_id, relationship_type)
      )
    `);

    // Organization documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_documents (
        id UUID PRIMARY KEY,
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

    // Organization settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_settings (
        id UUID PRIMARY KEY,
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        theme VARCHAR(50),
        language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        currency VARCHAR(10) DEFAULT 'USD',
        cricket_format VARCHAR(20) DEFAULT 'T20',
        match_duration_minutes INTEGER DEFAULT 180,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id)
      )
    `);

    // Venues table
    await client.query(`
      CREATE TABLE IF NOT EXISTS venues (
        id UUID PRIMARY KEY,
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50),
        logo VARCHAR(500),
        description TEXT,
        venue_type VARCHAR(50) NOT NULL,
        capacity INTEGER,
        address JSONB,
        facilities JSONB,
        images JSONB,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);
      CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
      CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
      CREATE INDEX IF NOT EXISTS idx_venues_organization ON venues(organization_id);
      CREATE INDEX IF NOT EXISTS idx_venues_name ON venues(name);
    `);

    console.log('Organization database initialized successfully');
  } catch (error) {
    console.error('Error initializing organization database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
