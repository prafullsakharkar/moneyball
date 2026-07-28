// Routes for Training Service

import { Router } from 'express';
import {
  trainingSessionService,
  trainingSessionPlayerService,
  trainingDrillService,
  trainingSessionDrillService,
  playerFitnessService,
  trainingReportService
} from '../services/TrainingService';
import {
  TrainingSessionCreateInput,
  TrainingSessionUpdateInput,
  TrainingSessionPlayerCreateInput,
  TrainingDrillCreateInput,
  TrainingDrillUpdateInput,
  TrainingSessionDrillCreateInput,
  PlayerFitnessCreateInput,
  TrainingReportCreateInput,
  SessionType,
  SessionStatus,
  AttendanceStatus,
  DrillType,
  DifficultyLevel,
  FitnessType,
  ReportType
} from '../models/Training';

const router = Router();

// Training Session routes
router.get('/training/sessions', async (req, res) => {
  try {
    const { teamId, coachId, status, date, limit, offset } = req.query;
    let sessions;
    if (teamId) {
      const params: any = {};
      if (status) params.status = status as SessionStatus;
      if (date) params.date = date;
      if (limit) params.limit = parseInt(limit as string);
      if (offset) params.offset = parseInt(offset as string);
      const result = await trainingSessionService.getSessionsByTeam(teamId, params);
      sessions = result.sessions;
    } else if (coachId) {
      sessions = await trainingSessionService.getSessionsByCoach(coachId);
    } else {
      sessions = [];
    }
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training sessions' });
  }
});

router.get('/training/sessions/:id', async (req, res) => {
  try {
    const session = await trainingSessionService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Training session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training session' });
  }
});

router.post('/training/sessions', async (req, res) => {
  try {
    const input: TrainingSessionCreateInput = req.body;
    const session = await trainingSessionService.createSession(input);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create training session' });
  }
});

router.put('/training/sessions/:id', async (req, res) => {
  try {
    const input: TrainingSessionUpdateInput = req.body;
    const session = await trainingSessionService.updateSession(req.params.id, input);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update training session' });
  }
});

router.patch('/training/sessions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const session = await trainingSessionService.updateSession(req.params.id, { status });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update training session status' });
  }
});

router.post('/training/sessions/:id/complete', async (req, res) => {
  try {
    const session = await trainingSessionService.completeSession(req.params.id);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete training session' });
  }
});

router.delete('/training/sessions/:id', async (req, res) => {
  try {
    const deleted = await trainingSessionService.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Training session not found' });
    }
    res.json({ success: true, message: 'Training session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete training session' });
  }
});

// Training Session Player routes
router.get('/training/sessions/:sessionId/players', async (req, res) => {
  try {
    const players = await trainingSessionPlayerService.getPlayersBySession(req.params.sessionId);
    res.json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training session players' });
  }
});

router.get('/training/sessions/:sessionId/players/:playerId', async (req, res) => {
  try {
    const player = await trainingSessionPlayerService.getPlayerAttendance(
      req.params.sessionId,
      req.params.playerId
    );
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player attendance not found' });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player attendance' });
  }
});

router.post('/training/sessions/:sessionId/players', async (req, res) => {
  try {
    const input: TrainingSessionPlayerCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const player = await trainingSessionPlayerService.createPlayerAttendance(input);
    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create player attendance' });
  }
});

router.put('/training/session-players/:id', async (req, res) => {
  try {
    const player = await trainingSessionPlayerService.updatePlayerAttendance(req.params.id, req.body);
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update player attendance' });
  }
});

// Training Drill routes
router.get('/training/drills', async (req, res) => {
  try {
    const { drillType, difficultyLevel } = req.query;
    const params: any = {};
    if (drillType) params.drillType = drillType as DrillType;
    if (difficultyLevel) params.difficultyLevel = difficultyLevel as DifficultyLevel;

    const drills = await trainingDrillService.getAllDrills(params);
    res.json({ success: true, data: drills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training drills' });
  }
});

router.get('/training/drills/:id', async (req, res) => {
  try {
    const drill = await trainingDrillService.getDrillById(req.params.id);
    if (!drill) {
      return res.status(404).json({ success: false, error: 'Training drill not found' });
    }
    res.json({ success: true, data: drill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training drill' });
  }
});

router.post('/training/drills', async (req, res) => {
  try {
    const input: TrainingDrillCreateInput = req.body;
    const drill = await trainingDrillService.createDrill(input);
    res.status(201).json({ success: true, data: drill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create training drill' });
  }
});

router.put('/training/drills/:id', async (req, res) => {
  try {
    const input: TrainingDrillUpdateInput = req.body;
    const drill = await trainingDrillService.updateDrill(req.params.id, input);
    res.json({ success: true, data: drill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update training drill' });
  }
});

router.delete('/training/drills/:id', async (req, res) => {
  try {
    const deleted = await trainingDrillService.deleteDrill(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Training drill not found' });
    }
    res.json({ success: true, message: 'Training drill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete training drill' });
  }
});

// Training Session Drill routes
router.get('/training/sessions/:sessionId/drills', async (req, res) => {
  try {
    const drills = await trainingSessionDrillService.getDrillsBySession(req.params.sessionId);
    res.json({ success: true, data: drills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training session drills' });
  }
});

router.post('/training/sessions/:sessionId/drills', async (req, res) => {
  try {
    const input: TrainingSessionDrillCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const drill = await trainingSessionDrillService.createSessionDrill(input);
    res.status(201).json({ success: true, data: drill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create training session drill' });
  }
});

router.delete('/training/session-drills/:id', async (req, res) => {
  try {
    const deleted = await trainingSessionDrillService.deleteSessionDrill(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Training session drill not found' });
    }
    res.json({ success: true, message: 'Training session drill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete training session drill' });
  }
});

// Player Fitness routes
router.get('/training/players/:playerId/fitness', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const params: any = {};
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await playerFitnessService.getFitnessByPlayer(req.params.playerId, params);
    res.json({ success: true, data: result.fitness, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player fitness' });
  }
});

router.get('/training/players/:playerId/fitness/:fitnessType', async (req, res) => {
  try {
    const fitness = await playerFitnessService.getFitnessByType(
      req.params.playerId,
      req.params.fitnessType as FitnessType
    );
    res.json({ success: true, data: fitness });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player fitness by type' });
  }
});

router.post('/training/players/:playerId/fitness', async (req, res) => {
  try {
    const input: PlayerFitnessCreateInput = { ...req.body, playerId: req.params.playerId };
    const fitness = await playerFitnessService.createFitness(input);
    res.status(201).json({ success: true, data: fitness });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create player fitness record' });
  }
});

router.put('/training/player-fitness/:id', async (req, res) => {
  try {
    const fitness = await playerFitnessService.updateFitness(req.params.id, req.body);
    res.json({ success: true, data: fitness });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update player fitness record' });
  }
});

// Training Report routes
router.get('/training/sessions/:sessionId/reports', async (req, res) => {
  try {
    const reports = await trainingReportService.getReportsBySession(req.params.sessionId);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch training reports' });
  }
});

router.post('/training/sessions/:sessionId/reports/attendance', async (req, res) => {
  try {
    const report = await trainingReportService.generateAttendanceReport(req.params.sessionId);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate attendance report' });
  }
});

router.post('/training/sessions/:sessionId/reports/performance', async (req, res) => {
  try {
    const report = await trainingReportService.generatePerformanceReport(req.params.sessionId);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate performance report' });
  }
});

export default router;
