// Scoring routes for Scoring Service

import { Router } from 'express';
import { scoringService } from '../services/ScoringService.js';
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

// Get all scoring sessions
router.get('/', async (req, res) => {
  try {
    const result = await scoringService.getAllScoringSessions(req.query as any);
    res.json({
      success: true,
      data: result.sessions,
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

// Get scoring session by ID
router.get('/:id', async (req, res) => {
  try {
    const session = await scoringService.getScoringSessionById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Scoring session not found'
        }
      });
    }

    res.json({
      success: true,
      data: session
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

// Get scoring events
router.get('/:id/events', async (req, res) => {
  try {
    const result = await scoringService.getScoringEvents(req.params.id, req.query as any);
    res.json({
      success: true,
      data: result.events,
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

// Get scoring notes
router.get('/:id/notes', async (req, res) => {
  try {
    const notes = await scoringService.getScoringNotes(req.params.id);
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

// Get scorecard
router.get('/:id/scorecard', async (req, res) => {
  try {
    const scorecard = await scoringService.getScorecard(req.params.id);
    
    if (!scorecard) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Scorecard not found'
        }
      });
    }

    res.json({
      success: true,
      data: scorecard
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

// Create scoring session
router.post('/', authenticate, async (req, res) => {
  try {
    const session = await scoringService.createScoringSession(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: session,
      message: 'Scoring session created successfully'
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

// Update scoring session
router.put('/:id', authenticate, async (req, res) => {
  try {
    const session = await scoringService.updateScoringSession(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: session,
      message: 'Scoring session updated successfully'
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

// Add scoring event
router.post('/:id/events', authenticate, async (req, res) => {
  try {
    const event = await scoringService.addScoringEvent(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: event,
      message: 'Scoring event added'
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

// Ball-by-ball scoring
router.post('/:id/ball-by-ball', authenticate, async (req, res) => {
  try {
    const event = await scoringService.ballByBallScoring(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: event,
      message: 'Ball-by-ball scoring recorded'
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

// Add scoring note
router.post('/:id/notes', authenticate, async (req, res) => {
  try {
    const note = await scoringService.addScoringNote(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: note,
      message: 'Scoring note added'
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
