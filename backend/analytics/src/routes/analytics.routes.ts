// Routes for Analytics Service

import { Router } from 'express';
import {
  playerAnalyticsService,
  teamAnalyticsService,
  matchAnalyticsService,
  playerPerformanceService,
  leaderboardService,
  searchService
} from '../services/AnalyticsService';
import {
  PlayerStatsCreateInput,
  PlayerStatsUpdateInput,
  TeamStatsCreateInput,
  TeamStatsUpdateInput,
  MatchAnalyticsCreateInput,
  MatchAnalyticsUpdateInput,
  PlayerPerformanceCreateInput,
  PlayerPerformanceUpdateInput,
  LeaderboardCreateInput,
  LeaderboardUpdateInput,
  SearchIndexCreateInput,
  SearchIndexUpdateInput,
  CricketFormat,
  LeaderboardCategory,
  SearchEntityType
} from '../models/Analytics';

const router = Router();

// Player Analytics routes
router.get('/players/:playerId/stats', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { format } = req.query;
    const stats = await playerAnalyticsService.getPlayerStats(
      playerId,
      format as CricketFormat
    );
    if (!stats) {
      return res.status(404).json({ success: false, error: 'Player stats not found' });
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player stats' });
  }
});

router.get('/players/:playerId/stats/all', async (req, res) => {
  try {
    const { playerId } = req.params;
    const stats = await playerAnalyticsService.getAllPlayerStats(playerId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player stats' });
  }
});

router.post('/players/:playerId/stats', async (req, res) => {
  try {
    const input: PlayerStatsCreateInput = { ...req.body, playerId: req.params.playerId };
    const stats = await playerAnalyticsService.upsertPlayerStats(input);
    res.status(201).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create player stats' });
  }
});

router.put('/player-stats/:id', async (req, res) => {
  try {
    const input: PlayerStatsUpdateInput = req.body;
    const stats = await playerAnalyticsService.updatePlayerStats(req.params.id, input);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update player stats' });
  }
});

router.get('/players/:playerId/calculate-stats', async (req, res) => {
  try {
    const { playerId } = req.params;
    const stats = await playerAnalyticsService.calculateCareerStats(playerId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate player stats' });
  }
});

// Team Analytics routes
router.get('/teams/:teamId/stats', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { format } = req.query;
    const stats = await teamAnalyticsService.getTeamStats(
      teamId,
      format as CricketFormat
    );
    if (!stats) {
      return res.status(404).json({ success: false, error: 'Team stats not found' });
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch team stats' });
  }
});

router.get('/teams/:teamId/stats/all', async (req, res) => {
  try {
    const { teamId } = req.params;
    const stats = await teamAnalyticsService.getAllTeamStats(teamId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch team stats' });
  }
});

router.post('/teams/:teamId/stats', async (req, res) => {
  try {
    const input: TeamStatsCreateInput = { ...req.body, teamId: req.params.teamId };
    const stats = await teamAnalyticsService.upsertTeamStats(input);
    res.status(201).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create team stats' });
  }
});

router.put('/team-stats/:id', async (req, res) => {
  try {
    const input: TeamStatsUpdateInput = req.body;
    const stats = await teamAnalyticsService.upsertTeamStats({ ...input, teamId: req.params.id });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update team stats' });
  }
});

router.get('/teams/:teamId/calculate-stats', async (req, res) => {
  try {
    const { teamId } = req.params;
    const stats = await teamAnalyticsService.calculateTeamStats(teamId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate team stats' });
  }
});

// Match Analytics routes
router.get('/matches/:matchId/analytics', async (req, res) => {
  try {
    const { matchId } = req.params;
    const analytics = await matchAnalyticsService.getMatchAnalytics(matchId);
    if (!analytics) {
      return res.status(404).json({ success: false, error: 'Match analytics not found' });
    }
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch match analytics' });
  }
});

router.post('/matches/:matchId/analytics', async (req, res) => {
  try {
    const input: MatchAnalyticsCreateInput = { ...req.body, matchId: req.params.matchId };
    const analytics = await matchAnalyticsService.upsertMatchAnalytics(input);
    res.status(201).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create match analytics' });
  }
});

router.put('/match-analytics/:id', async (req, res) => {
  try {
    const input: MatchAnalyticsUpdateInput = req.body;
    const analytics = await matchAnalyticsService.upsertMatchAnalytics({ ...input, matchId: req.params.id });
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update match analytics' });
  }
});

router.get('/matches/:matchId/calculate-analytics', async (req, res) => {
  try {
    const { matchId } = req.params;
    const analytics = await matchAnalyticsService.calculateMatchAnalytics(matchId);
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate match analytics' });
  }
});

// Player Performance routes
router.get('/players/:playerId/matches/:matchId/performance', async (req, res) => {
  try {
    const { playerId, matchId } = req.params;
    const performance = await playerPerformanceService.getPlayerPerformance(playerId, matchId);
    if (!performance) {
      return res.status(404).json({ success: false, error: 'Player performance not found' });
    }
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch player performance' });
  }
});

router.get('/matches/:matchId/performances', async (req, res) => {
  try {
    const { matchId } = req.params;
    const performances = await playerPerformanceService.getMatchPerformances(matchId);
    res.json({ success: true, data: performances });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch match performances' });
  }
});

router.post('/matches/:matchId/performances', async (req, res) => {
  try {
    const input: PlayerPerformanceCreateInput = { ...req.body, matchId: req.params.matchId };
    const performance = await playerPerformanceService.upsertPlayerPerformance(input);
    res.status(201).json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create player performance' });
  }
});

router.put('/player-performance/:id', async (req, res) => {
  try {
    const input: PlayerPerformanceUpdateInput = req.body;
    const performance = await playerPerformanceService.upsertPlayerPerformance({ ...input, playerId: req.params.id });
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update player performance' });
  }
});

router.get('/player-performance/:id/fantasy-points', async (req, res) => {
  try {
    const performance = await playerPerformanceService.getPlayerPerformance(
      req.params.id,
      req.query.matchId as string
    );
    if (!performance) {
      return res.status(404).json({ success: false, error: 'Player performance not found' });
    }
    const fantasyPoints = playerPerformanceService.calculateFantasyPoints(performance);
    res.json({ success: true, data: { fantasyPoints } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate fantasy points' });
  }
});

// Leaderboard routes
router.get('/competitions/:competitionId/leaderboards', async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { category, seasonId, limit, offset } = req.query;
    const params: any = {};
    if (seasonId) params.seasonId = seasonId;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const leaderboard = await leaderboardService.getLeaderboard(
      competitionId,
      category as LeaderboardCategory,
      params
    );
    res.json({ success: true, data: leaderboard.entries, meta: { total: leaderboard.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

router.post('/competitions/:competitionId/leaderboards/:category/generate', async (req, res) => {
  try {
    const { competitionId, category } = req.params;
    const { seasonId } = req.body;
    await leaderboardService.generateLeaderboard(competitionId, category as LeaderboardCategory, seasonId);
    res.json({ success: true, message: 'Leaderboard generated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate leaderboard' });
  }
});

router.post('/competitions/:competitionId/leaderboards/:category/update-ranks', async (req, res) => {
  try {
    const { competitionId, category } = req.params;
    const { seasonId } = req.body;
    await leaderboardService.updateLeaderboardRankings(competitionId, category as LeaderboardCategory, seasonId);
    res.json({ success: true, message: 'Leaderboard ranks updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update leaderboard ranks' });
  }
});

// Search routes
router.get('/search', async (req, res) => {
  try {
    const { query, entityType, limit, offset } = req.query;
    const params: any = {};
    if (entityType) params.entityType = entityType as SearchEntityType;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const results = await searchService.searchEntities(query as string, params);
    res.json({ success: true, data: results.results, meta: { total: results.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search' });
  }
});

router.post('/search/index', async (req, res) => {
  try {
    const input: SearchIndexCreateInput = req.body;
    const indexed = await searchService.indexEntity(input);
    res.status(201).json({ success: true, data: indexed });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to index entity' });
  }
});

router.delete('/search/index/:entityType/:entityId', async (req, res) => {
  try {
    const deleted = await searchService.removeEntity(
      req.params.entityType as SearchEntityType,
      req.params.entityId
    );
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Entity not found' });
    }
    res.json({ success: true, message: 'Entity removed from search index' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove entity from search index' });
  }
});

export default router;
