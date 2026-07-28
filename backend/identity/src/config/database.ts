// Database configuration for Identity Service

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
    host: process.env.IDENTITY_DB_HOST || 'localhost',
    port: parseInt(process.env.IDENTITY_DB_PORT || '5432'),
    database: process.env.IDENTITY_DB_NAME || 'cricketiq_identity',
    username: process.env.IDENTITY_DB_USER || 'postgres',
    password: process.env.IDENTITY_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.IDENTITY_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.IDENTITY_DB_TIMEOUT || '5000')
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
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        external_id UUID,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        phone VARCHAR(20),
        gender VARCHAR(20),
        date_of_birth DATE,
        role VARCHAR(50) NOT NULL DEFAULT 'Fan',
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID,
        updated_by UUID
      )
    `);

    // User sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        refresh_token VARCHAR(500) NOT NULL,
        refresh_token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        revoked_at TIMESTAMP WITH TIME ZONE,
        revoked_by UUID
      )
    `);

    // Roles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT[],
        is_system BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User roles junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        assigned_by UUID REFERENCES users(id),
        assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, role_id)
      )
    `);

    // Permissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        resource VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Role permissions junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      )
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_id UUID,
        old_value JSONB,
        new_value JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default roles
    await client.query(`
      INSERT INTO roles (id, name, description, permissions, is_system)
      VALUES 
        (gen_random_uuid(), 'SuperAdmin', 'Super administrator with full access', ARRAY['*'], TRUE),
        (gen_random_uuid(), 'PlatformAdmin', 'Platform administrator', ARRAY['admin:read', 'admin:write', 'admin:delete'], TRUE),
        (gen_random_uuid(), 'OrganizationAdmin', 'Organization administrator', ARRAY['organization:read', 'organization:write', 'organization:delete'], TRUE),
        (gen_random_uuid(), 'TeamManager', 'Team manager', ARRAY['team:read', 'team:write', 'team:delete'], TRUE),
        (gen_random_uuid(), 'Coach', 'Team coach', ARRAY['team:read', 'player:read', 'training:read'], TRUE),
        (gen_random_uuid(), 'Captain', 'Team captain', ARRAY['team:read', 'player:read'], TRUE),
        (gen_random_uuid(), 'Player', 'Registered player', ARRAY['player:read', 'training:read', 'analytics:read'], TRUE),
        (gen_random_uuid(), 'Scorer', 'Match scorer', ARRAY['scoring:read', 'scoring:write'], TRUE),
        (gen_random_uuid(), 'Umpire', 'Match umpire', ARRAY['match:read', 'scoring:read'], TRUE),
        (gen_random_uuid(), 'Scout', 'Player scout', ARRAY['player:read', 'scouting:read', 'scouting:write'], TRUE),
        (gen_random_uuid(), 'Parent', 'Parent of junior player', ARRAY['player:read', 'training:read'], TRUE),
        (gen_random_uuid(), 'Fan', 'Public fan', ARRAY['player:read', 'match:read', 'tournament:read'], TRUE)
      ON CONFLICT (name) DO NOTHING
    `);

    // Insert default permissions
    const defaultPermissions = [
      { name: 'admin:read', description: 'Read admin resources', resource: 'admin', action: 'read' },
      { name: 'admin:write', description: 'Write admin resources', resource: 'admin', action: 'write' },
      { name: 'admin:delete', description: 'Delete admin resources', resource: 'admin', action: 'delete' },
      { name: 'organization:read', description: 'Read organizations', resource: 'organization', action: 'read' },
      { name: 'organization:write', description: 'Write organizations', resource: 'organization', action: 'write' },
      { name: 'organization:delete', description: 'Delete organizations', resource: 'organization', action: 'delete' },
      { name: 'player:read', description: 'Read players', resource: 'player', action: 'read' },
      { name: 'player:write', description: 'Write players', resource: 'player', action: 'write' },
      { name: 'player:delete', description: 'Delete players', resource: 'player', action: 'delete' },
      { name: 'team:read', description: 'Read teams', resource: 'team', action: 'read' },
      { name: 'team:write', description: 'Write teams', resource: 'team', action: 'write' },
      { name: 'team:delete', description: 'Delete teams', resource: 'team', action: 'delete' },
      { name: 'match:read', description: 'Read matches', resource: 'match', action: 'read' },
      { name: 'match:write', description: 'Write matches', resource: 'match', action: 'write' },
      { name: 'scoring:read', description: 'Read scoring', resource: 'scoring', action: 'read' },
      { name: 'scoring:write', description: 'Write scoring', resource: 'scoring', action: 'write' },
      { name: 'tournament:read', description: 'Read tournaments', resource: 'tournament', action: 'read' },
      { name: 'tournament:write', description: 'Write tournaments', resource: 'tournament', action: 'write' },
      { name: 'training:read', description: 'Read training', resource: 'training', action: 'read' },
      { name: 'training:write', description: 'Write training', resource: 'training', action: 'write' },
      { name: 'analytics:read', description: 'Read analytics', resource: 'analytics', action: 'read' },
      { name: 'scouting:read', description: 'Read scouting', resource: 'scouting', action: 'read' },
      { name: 'scouting:write', description: 'Write scouting', resource: 'scouting', action: 'write' },
      { name: 'media:read', description: 'Read media', resource: 'media', action: 'read' },
      { name: 'media:write', description: 'Write media', resource: 'media', action: 'write' },
      { name: 'finance:read', description: 'Read finance', resource: 'finance', action: 'read' },
      { name: 'finance:write', description: 'Write finance', resource: 'finance', action: 'write' },
      { name: 'notification:read', description: 'Read notifications', resource: 'notification', action: 'read' },
      { name: 'notification:write', description: 'Write notifications', resource: 'notification', action: 'write' }
    ];

    for (const perm of defaultPermissions) {
      await client.query(`
        INSERT INTO permissions (id, name, description, resource, action)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
      `, [perm.name, perm.description, perm.resource, perm.action]);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};
