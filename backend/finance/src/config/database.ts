// Database configuration for Finance Service

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
    host: process.env.FINANCE_DB_HOST || 'localhost',
    port: parseInt(process.env.FINANCE_DB_PORT || '5432'),
    database: process.env.FINANCE_DB_NAME || 'cricketiq_finance',
    username: process.env.FINANCE_DB_USER || 'postgres',
    password: process.env.FINANCE_DB_PASSWORD || 'postgres',
    maxConnections: parseInt(process.env.FINANCE_DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.FINANCE_DB_TIMEOUT || '5000')
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
    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        transaction_id VARCHAR(50) UNIQUE NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        payment_method VARCHAR(50),
        payment_reference VARCHAR(100),
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Invoices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        total_amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'Draft',
        due_date DATE,
        paid_at TIMESTAMP WITH TIME ZONE,
        items JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY,
        payment_id VARCHAR(50) UNIQUE NOT NULL,
        invoice_id UUID REFERENCES invoices(id),
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        transaction_reference VARCHAR(100),
        gateway_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        organization_id UUID NOT NULL REFERENCES organizations(id),
        plan_name VARCHAR(100) NOT NULL,
        plan_tier VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        billing_period VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        start_date DATE NOT NULL,
        end_date DATE,
        auto_renew BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Refunds table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id UUID PRIMARY KEY,
        transaction_id UUID REFERENCES transactions(id),
        invoice_id UUID REFERENCES invoices(id),
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        reason TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        processed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Financial reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_reports (
        id UUID PRIMARY KEY,
        report_type VARCHAR(50) NOT NULL,
        report_period VARCHAR(20) NOT NULL,
        report_date DATE NOT NULL,
        data JSONB,
        generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_entity ON transactions(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_invoices_entity ON invoices(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_organization ON subscriptions(organization_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    `);

    console.log('Finance database initialized successfully');
  } catch (error) {
    console.error('Error initializing finance database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  pool,
  initializeDatabase
};