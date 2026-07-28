// Match routes for Match Service

import { Router } from 'express';
import { matchService } from '../services/MatchService.js';
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

// Get all matches
router.get('/', async (req, res) => {
  try {
    const result = await matchService.getAllMatches(req.query as any);
    res.json({
      success: true,
      data: result.matches,
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

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Match not found'
        }
      });
    }

    res.json({
      success: true,
      data: match
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

// Get match officials
router.get('/:id/officials', async (req, res) => {
  try {
    const officials = await matchService.getMatchOfficials(req.params.id);
    res.json({
      success: true,
      data: officials
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

// Get match playing XI
router.get('/:id/playing-xi', async (req, res) => {
  try {
    const playingXI = await matchService.getMatchPlayingXI(req.params.id);
    res.json({
      success: true,
      data: playingXI
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

// Get match notes
router.get('/:id/notes', async (req, res) => {
  try {
    const notes = await matchService.getMatchNotes(req.params.id);
    res.json({
      success: true,
      data: notes
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

// Create match
router.post('/', authenticate, async (req, res) => {
  try {
    const match = await matchService.createMatch(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: match,
      message: 'Match created successfully'
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

// Update match
router.put('/:id', authenticate, async (req, res) => {
  try {
    const match = await matchService.updateMatch(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: match,
      message: 'Match updated successfully'
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

// Add match official
router.post('/:id/officials', authenticate, async (req, res) => {
  try {
    const official = await matchService.addMatchOfficial(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: official,
      message: 'Match official added'
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

// Add playing XI
router.post('/:id/playing-xi', authenticate, async (req, res) => {
  try {
    const playingXI = await matchService.addPlayingXI(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: playingXI,
      message: 'Player added to playing XI'
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

// Add match note
router.post('/:id/notes', authenticate, async (req, res) => {
  try {
    const note = await matchService.addMatchNote(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: note,
      message: 'Match note added'
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

export default router;
