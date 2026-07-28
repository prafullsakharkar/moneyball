// Routes for Scouting Service

import { Router } from 'express';
import {
  scoutingReportService,
  scoutingReportSectionService,
  scoutingSessionService,
  scoutingSessionPlayerService,
  playerRankingService,
  scoutingNoteService
} from '../services/ScoutingService';
import {
  ScoutingReportCreateInput,
  ScoutingReportUpdateInput,
  ScoutingReportSectionCreateInput,
  ScoutingSessionCreateInput,
  ScoutingSessionUpdateInput,
  ScoutingSessionPlayerCreateInput,
  PlayerRankingCreateInput,
  ScoutingNoteCreateInput,
  ReportType,
  ReportStatus,
  SessionStatus,
  SessionPlayerStatus,
  NoteType,
  CricketFormat
} from '../models/Scouting';

const router = Router();

// Scouting Report routes
router.get('/scouting/reports', async (req, res) => {
  try {
    const { playerId, scoutId, status, limit, offset } = req.query;
    let reports;
    if (playerId) {
      const params: any = {};
      if (status) params.status = status as ReportStatus;
      if (limit) params.limit = parseInt(limit as string);
      if (offset) params.offset = parseInt(offset as string);
      const result = await scoutingReportService.getReportsByPlayer(playerId, params);
      reports = result.reports;
    } else if (scoutId) {
      reports = await scoutingReportService.getReportsByScout(scoutId);
    } else {
      reports = [];
    }
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting reports' });
  }
});

router.get('/scouting/reports/:id', async (req, res) => {
  try {
    const report = await scoutingReportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Scouting report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting report' });
  }
});

router.post('/scouting/reports', async (req, res) => {
  try {
    const input: ScoutingReportCreateInput = req.body;
    const report = await scoutingReportService.createReport(input);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create scouting report' });
  }
});

router.put('/scouting/reports/:id', async (req, res) => {
  try {
    const input: ScoutingReportUpdateInput = req.body;
    const report = await scoutingReportService.updateReport(req.params.id, input);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update scouting report' });
  }
});

router.patch('/scouting/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await scoutingReportService.updateReport(req.params.id, { status });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update scouting report status' });
  }
});

router.post('/scouting/reports/:id/submit', async (req, res) => {
  try {
    const report = await scoutingReportService.submitReport(req.params.id);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to submit scouting report' });
  }
});

router.post('/scouting/reports/:id/complete', async (req, res) => {
  try {
    const report = await scoutingReportService.completeReport(req.params.id);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete scouting report' });
  }
});

router.delete('/scouting/reports/:id', async (req, res) => {
  try {
    const deleted = await scoutingReportService.deleteReport(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Scouting report not found' });
    }
    res.json({ success: true, message: 'Scouting report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete scouting report' });
  }
});

// Scouting Report Section routes
router.get('/scouting/reports/:reportId/sections', async (req, res) => {
  try {
    const sections = await scoutingReportSectionService.getSectionsByReport(req.params.reportId);
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting report sections' });
  }
});

router.post('/scouting/reports/:reportId/sections', async (req, res) => {
  try {
    const input: ScoutingReportSectionCreateInput = { ...req.body, reportId: req.params.reportId };
    const section = await scoutingReportSectionService.createSection(input);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create scouting report section' });
  }
});

router.delete('/scouting/report-sections/:id', async (req, res) => {
  try {
    const deleted = await scoutingReportSectionService.deleteSection(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Scouting report section not found' });
    }
    res.json({ success: true, message: 'Scouting report section deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete scouting report section' });
  }
});

// Scouting Session routes
router.get('/scouting/sessions', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    const params: any = {};
    if (status) params.status = status as SessionStatus;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await scoutingSessionService.getAllSessions(params);
    res.json({ success: true, data: result.sessions, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting sessions' });
  }
});

router.get('/scouting/sessions/:id', async (req, res) => {
  try {
    const session = await scoutingSessionService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Scouting session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting session' });
  }
});

router.post('/scouting/sessions', async (req, res) => {
  try {
    const input: ScoutingSessionCreateInput = req.body;
    const session = await scoutingSessionService.createSession(input);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create scouting session' });
  }
});

router.put('/scouting/sessions/:id', async (req, res) => {
  try {
    const input: ScoutingSessionUpdateInput = req.body;
    const session = await scoutingSessionService.updateSession(req.params.id, input);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update scouting session' });
  }
});

router.patch('/scouting/sessions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const session = await scoutingSessionService.updateSession(req.params.id, { status });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update scouting session status' });
  }
});

router.post('/scouting/sessions/:id/start', async (req, res) => {
  try {
    const session = await scoutingSessionService.startSession(req.params.id);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start scouting session' });
  }
});

router.post('/scouting/sessions/:id/complete', async (req, res) => {
  try {
    const session = await scoutingSessionService.completeSession(req.params.id);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete scouting session' });
  }
});

router.delete('/scouting/sessions/:id', async (req, res) => {
  try {
    const deleted = await scoutingSessionService.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Scouting session not found' });
    }
    res.json({ success: true, message: 'Scouting session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete scouting session' });
  }
});

// Scouting Session Player routes
router.get('/scouting/sessions/:sessionId/players', async (req, res) => {
  try {
    const players = await scoutingSessionPlayerService.getPlayersBySession(req.params.sessionId);
    res.json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting session players' });
  }
});

router.get('/scouting/sessions/:sessionId/players/:playerId', async (req, res) => {
  try {
    const player = await scoutingSessionPlayerService.getPlayerBySession(req.params.sessionId, req.params.playerId);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Scouting session player not found' });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting session player' });
  }
});

router.post('/scouting/sessions/:sessionId/players', async (req, res) => {
  try {
    const input: ScoutingSessionPlayerCreateInput = { ...req.body, sessionId: req.params.sessionId };
    const player = await scoutingSessionPlayerService.createSessionPlayer(input);
    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create scouting session player' });
  }
});

router.put('/scouting/session-players/:id', async (req, res) => {
  try {
    const player = await scoutingSessionPlayerService.updateSessionPlayer(req.params.id, req.body);
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update scouting session player' });
  }
});

router.post('/scouting/session-players/:id/complete', async (req, res) => {
  try {
    const player = await scoutingSessionPlayerService.completePlayerAssessment(req.params.id);
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete player assessment' });
  }
});

// Player Ranking routes
router.get('/scouting/players/:playerId/rankings', async (req, res) => {
  try {
    const rankings = await playerRankingService.getRankingsByPlayer(req.params.playerId);
    res.json({ success: true, data: rankings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player rankings' });
  }
});

router.get('/scouting/rankings/format/:format', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const params: any = {};
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await playerRankingService.getRankingsByFormat(req.params.format as CricketFormat, params);
    res.json({ success: true, data: result.rankings, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rankings by format' });
  }
});

router.get('/scouting/players/:playerId/rankings/format/:format', async (req, res) => {
  try {
    const ranking = await playerRankingService.getRankingByPlayerAndFormat(
      req.params.playerId,
      req.params.format as CricketFormat
    );
    if (!ranking) {
      return res.status(404).json({ success: false, error: 'Player ranking not found' });
    }
    res.json({ success: true, data: ranking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player ranking' });
  }
});

router.post('/scouting/players/:playerId/rankings', async (req, res) => {
  try {
    const input: PlayerRankingCreateInput = { ...req.body, playerId: req.params.playerId };
    const ranking = await playerRankingService.createRanking(input);
    res.status(201).json({ success: true, data: ranking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create player ranking' });
  }
});

router.put('/scouting/player-rankings/:id', async (req, res) => {
  try {
    const ranking = await playerRankingService.updateRanking(req.params.id, req.body);
    res.json({ success: true, data: ranking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update player ranking' });
  }
});

// Scouting Note routes
router.get('/scouting/players/:playerId/notes', async (req, res) => {
  try {
    const { noteType, limit, offset } = req.query;
    const params: any = {};
    if (noteType) params.noteType = noteType as NoteType;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await scoutingNoteService.getNotesByPlayer(req.params.playerId, params);
    res.json({ success: true, data: result.notes, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scouting notes' });
  }
});

router.post('/scouting/players/:playerId/notes', async (req, res) => {
  try {
    const input: ScoutingNoteCreateInput = { ...req.body, playerId: req.params.playerId };
    const note = await scoutingNoteService.createNote(input);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create scouting note' });
  }
});

router.delete('/scouting/notes/:id', async (req, res) => {
  try {
    const deleted = await scoutingNoteService.deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Scouting note not found' });
    }
    res.json({ success: true, message: 'Scouting note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete scouting note' });
  }
});

export default router;
