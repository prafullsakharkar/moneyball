// Auth Service for Identity Service

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';
import { generateId, isValidPassword, getCurrentTimestamp } from '@shared/utils';
import { User, TokenPair, AuthenticatedUser, UserLoginInput, UserRegisterInput } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export class AuthService {
  // Register a new user
  async register(input: UserRegisterInput): Promise<{ user: User; tokenPair: TokenPair }> {
    const client = await pool.connect();
    
    try {
      // Validate password
      if (!isValidPassword(input.password)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      }

      // Check if email already exists
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [input.email]);
      if (existingUser.rows.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // Generate user ID
      const userId = generateId();

      // Create user
      const result = await client.query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, full_name, phone, gender, role, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, email, first_name, last_name, full_name, role, status, email_verified, phone_verified`,
        [userId, input.email, passwordHash, input.firstName, input.lastName, `${input.firstName} ${input.lastName}`, input.phone, input.gender, input.role || 'Fan', 'Active']
      );

      const user = result.rows[0];

      // Create session for immediate login
      const refreshToken = uuidv4();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await client.query(
        `INSERT INTO user_sessions (id, user_id, refresh_token, refresh_token_expiry)
         VALUES ($1, $2, $3, $4)`,
        [uuidv4(), userId, refreshToken, refreshTokenExpiry]
      );

      // Generate tokens
      const tokenPair = this.generateTokenPair(userId, user.email, user.role);

      return { user, tokenPair };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Login user
  async login(input: UserLoginInput): Promise<{ user: AuthenticatedUser; tokenPair: TokenPair }> {
    const client = await pool.connect();
    
    try {
      // Find user by email
      const result = await client.query(
        'SELECT id, email, password_hash, first_name, last_name, full_name, role, status, email_verified, phone_verified FROM users WHERE email = $1',
        [input.email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Check if user is active
      if (user.status !== 'Active') {
        throw new Error('Account is not active');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await client.query(
        'UPDATE users SET last_login = $1 WHERE id = $2',
        [getCurrentTimestamp(), user.id]
      );

      // Create session
      const refreshToken = uuidv4();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await client.query(
        `INSERT INTO user_sessions (id, user_id, refresh_token, refresh_token_expiry)
         VALUES ($1, $2, $3, $4)`,
        [uuidv4(), user.id, refreshToken, refreshTokenExpiry]
      );

      // Get user permissions
      const permissions = await this.getUserPermissions(user.id);

      // Generate tokens
      const tokenPair = this.generateTokenPair(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.lastName,
          fullName: user.full_name,
          role: user.role,
          status: user.status,
          emailVerified: user.email_verified,
          phoneVerified: user.phone_verified,
          permissions
        },
        tokenPair
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const client = await pool.connect();
    
    try {
      // Find session with refresh token
      const result = await client.query(
        `SELECT user_id, refresh_token_expiry FROM user_sessions 
         WHERE refresh_token = $1 AND revoked_at IS NULL`,
        [refreshToken]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid refresh token');
      }

      const session = result.rows[0];

      // Check if refresh token is expired
      if (new Date(session.refresh_token_expiry) < new Date()) {
        throw new Error('Refresh token expired');
      }

      // Get user info
      const userResult = await client.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [session.user_id]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Generate new tokens
      const tokenPair = this.generateTokenPair(user.id, user.email, user.role);

      // Update refresh token in session
      const newRefreshToken = uuidv4();
      const newRefreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await client.query(
        `UPDATE user_sessions 
         SET refresh_token = $1, refresh_token_expiry = $2 
         WHERE user_id = $3 AND refresh_token = $4`,
        [newRefreshToken, newRefreshTokenExpiry, session.user_id, refreshToken]
      );

      return tokenPair;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Logout user
  async logout(userId: string, refreshToken: string): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query(
        `UPDATE user_sessions 
         SET revoked_at = $1, revoked_by = $2 
         WHERE user_id = $3 AND refresh_token = $4`,
        [getCurrentTimestamp(), userId, userId, refreshToken]
      );
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Generate access and refresh tokens
  private generateTokenPair(userId: string, email: string, role: string): TokenPair {
    const accessToken = jwt.sign(
      { sub: userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = uuidv4();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      accessToken,
      refreshToken,
      accessTokenExpiry: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      refreshTokenExpiry
    };
  }

  // Get user permissions
  private async getUserPermissions(userId: string): Promise<string[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT DISTINCT p.name
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = $1`,
        [userId]
      );

      return result.rows.map((row: any) => row.name);
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Verify JWT token
  verifyToken(token: string): AuthenticatedUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      return {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        fullName: `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim(),
        role: decoded.role,
        status: 'Active',
        emailVerified: true,
        phoneVerified: false,
        permissions: []
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
