// Player routes for Player Service

import { Router } from 'express';
import { playerService } from '../services/PlayerService.js';
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
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }

  next();
};

// Get all players
router.get('/', async (req, res) => {
  try {
    const result = await playerService.getAllPlayers(req.query as any);
    res.json({
      success: true,
      data: result.players,
      meta: result.meta
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

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Player not found'
        }
      });
    }

    res.json({
      success: true,
      data: player
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

// Get player stats
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await playerService.getPlayerStats(req.params.id);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Player stats not found'
        }
      });
    }

    res.json({
      success: true,
      data: stats
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

// Get player fitness
router.get('/:id/fitness', async (req, res) => {
  try {
    const fitness = await playerService.getPlayerFitness(req.params.id);
    
    if (!fitness) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Player fitness not found'
        }
      });
    }

    res.json({
      success: true,
      data: fitness
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

// Get player medical
router.get('/:id/medical', async (req, res) => {
  try {
    const medical = await playerService.getPlayerMedical(req.params.id);
    
    if (!medical) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Player medical not found'
        }
      });
    }

    res.json({
      success: true,
      data: medical
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

// Get player match history
router.get('/:id/match-history', async (req, res) => {
  try {
    const history = await playerService.getPlayerMatchHistory(req.params.id);
    res.json({
      success: true,
      data: history
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

// Create player
router.post('/', authenticate, async (req, res) => {
  try {
    const player = await playerService.createPlayer(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: player,
      message: 'Player created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});

// Update player
router.put('/:id', authenticate, async (req, res) => {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: player,
      message: 'Player updated successfully'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }
});

// Update player stats
router.put('/:id/stats', authenticate, async (req, res) => {
  try {
    const stats = await playerService.updatePlayerStats(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: stats,
      message: 'Player stats updated successfully'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }
});

export default router;
