// Team routes for Team Service

import { Router } from 'express';
import { teamService } from '../services/TeamService.js';
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

// Get all teams
router.get('/', async (req, res) => {
  try {
    const result = await teamService.getAllTeams(req.query as any);
    res.json({
      success: true,
      data: result.teams,
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

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Team not found'
        }
      });
    }

    res.json({
      success: true,
      data: team
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

// Get team roster
router.get('/:id/roster', async (req, res) => {
  try {
    const roster = await teamService.getTeamRoster(req.params.id);
    res.json({
      success: true,
      data: roster
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

// Get team captain
router.get('/:id/captain', async (req, res) => {
  try {
    const captain = await teamService.getTeamCaptain(req.params.id);
    
    if (!captain) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Team captain not found'
        }
      });
    }

    res.json({
      success: true,
      data: captain
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

// Get team coach
router.get('/:id/coach', async (req, res) => {
  try {
    const coach = await teamService.getTeamCoach(req.params.id);
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Team coach not found'
        }
      });
    }

    res.json({
      success: true,
      data: coach
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

// Get team stats
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await teamService.getTeamStats(req.params.id);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Team stats not found'
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

// Create team
router.post('/', authenticate, async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully'
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

// Update team
router.put('/:id', authenticate, async (req, res) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: team,
      message: 'Team updated successfully'
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

// Add player to roster
router.post('/:id/roster', authenticate, async (req, res) => {
  try {
    const roster = await teamService.addPlayerToRoster(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: roster,
      message: 'Player added to roster'
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

// Remove player from roster
router.delete('/:id/roster/:playerId', authenticate, async (req, res) => {
  try {
    await teamService.removePlayerFromRoster(req.params.id, req.params.playerId, req.user.id);
    res.json({
      success: true,
      message: 'Player removed from roster'
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

// Update team stats
router.put('/:id/stats', authenticate, async (req, res) => {
  try {
    const stats = await teamService.updateTeamStats(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: stats,
      message: 'Team stats updated successfully'
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
