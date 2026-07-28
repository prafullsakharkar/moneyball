// Auth routes for Identity Service

import { Router } from 'express';
import { authService } from '../services/AuthService.js';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware to verify JWT token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authorization header required'
      }
    });
  }

  const token = authHeader.substring(7);
  const user = authService.verifyToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }

  req.user = user;
  next();
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: error.message.includes('already') ? 'EMAIL_EXISTS' : 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        code: error.message.includes('Invalid') ? 'INVALID_CREDENTIALS' : 'ACCOUNT_INACTIVE',
        message: error.message
      }
    });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokenPair = await authService.refreshTokens(refreshToken);
    res.json({
      success: true,
      data: tokenPair,
      message: 'Tokens refreshed'
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: error.message
      }
    });
  }
});

// Logout route
router.post('/logout', authenticate, async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await authService.logout(req.user.id, refreshToken);
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
      message: 'User retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

export default router;
