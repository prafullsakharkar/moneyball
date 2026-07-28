// Routes for Competition Service

import { Router } from 'express';
import {
  competitionService,
  seasonService,
  groupService,
  fixtureService,
  standingService,
  tournamentTeamService
} from '../services/CompetitionService';
import {
  CompetitionCreateInput,
  CompetitionUpdateInput,
  SeasonCreateInput,
  SeasonUpdateInput,
  GroupCreateInput,
  GroupUpdateInput,
  FixtureCreateInput,
  FixtureUpdateInput,
  TournamentTeamCreateInput,
  TournamentTeamUpdateInput,
  CompetitionStatus,
  FixtureStatus
} from '../models/Competition';

const router = Router();

// Competition routes
router.get('/competitions', async (req, res) => {
  try {
    const { organizationId, status, format, page, limit } = req.query;
    const params: any = {};
    if (organizationId) params.organizationId = organizationId;
    if (status) params.status = status as CompetitionStatus;
    if (format) params.format = format;
    if (page) params.page = parseInt(page as string);
    if (limit) params.limit = parseInt(limit as string);

    const result = await competitionService.getAllCompetitions(params);
    res.json({ success: true, data: result.competitions, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch competitions' });
  }
});

router.get('/competitions/:id', async (req, res) => {
  try {
    const competition = await competitionService.getCompetitionById(req.params.id);
    if (!competition) {
      return res.status(404).json({ success: false, error: 'Competition not found' });
    }
    res.json({ success: true, data: competition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch competition' });
  }
});

router.post('/competitions', async (req, res) => {
  try {
    const input: CompetitionCreateInput = req.body;
    const competition = await competitionService.createCompetition(input);
    res.status(201).json({ success: true, data: competition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create competition' });
  }
});

router.put('/competitions/:id', async (req, res) => {
  try {
    const input: CompetitionUpdateInput = req.body;
    const competition = await competitionService.updateCompetition(req.params.id, input);
    res.json({ success: true, data: competition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update competition' });
  }
});

router.patch('/competitions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const competition = await competitionService.updateCompetitionStatus(req.params.id, status);
    res.json({ success: true, data: competition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update competition status' });
  }
});

router.delete('/competitions/:id', async (req, res) => {
  try {
    const deleted = await competitionService.deleteCompetition(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Competition not found' });
    }
    res.json({ success: true, message: 'Competition deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete competition' });
  }
});

// Season routes
router.get('/competitions/:competitionId/seasons', async (req, res) => {
  try {
    const seasons = await seasonService.getSeasonsByCompetition(req.params.competitionId);
    res.json({ success: true, data: seasons });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch seasons' });
  }
});

router.get('/seasons/:id', async (req, res) => {
  try {
    const season = await seasonService.getSeasonById(req.params.id);
    if (!season) {
      return res.status(404).json({ success: false, error: 'Season not found' });
    }
    res.json({ success: true, data: season });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch season' });
  }
});

router.post('/competitions/:competitionId/seasons', async (req, res) => {
  try {
    const input: SeasonCreateInput = { ...req.body, competitionId: req.params.competitionId };
    const season = await seasonService.createSeason(input);
    res.status(201).json({ success: true, data: season });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create season' });
  }
});

router.put('/seasons/:id', async (req, res) => {
  try {
    const input: SeasonUpdateInput = req.body;
    const season = await seasonService.updateSeason(req.params.id, input);
    res.json({ success: true, data: season });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update season' });
  }
});

router.delete('/seasons/:id', async (req, res) => {
  try {
    const deleted = await seasonService.deleteSeason(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Season not found' });
    }
    res.json({ success: true, message: 'Season deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete season' });
  }
});

// Group routes
router.get('/competitions/:competitionId/seasons/:seasonId/groups', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const groups = await groupService.getGroupsByCompetition(req.params.competitionId, seasonId);
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch groups' });
  }
});

router.get('/groups/:id', async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch group' });
  }
});

router.post('/competitions/:competitionId/seasons/:seasonId/groups', async (req, res) => {
  try {
    const input: GroupCreateInput = {
      ...req.body,
      competitionId: req.params.competitionId,
      seasonId: req.params.seasonId
    };
    const group = await groupService.createGroup(input);
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create group' });
  }
});

router.put('/groups/:id', async (req, res) => {
  try {
    const input: GroupUpdateInput = req.body;
    const group = await groupService.updateGroup(req.params.id, input);
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update group' });
  }
});

router.delete('/groups/:id', async (req, res) => {
  try {
    const deleted = await groupService.deleteGroup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    res.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete group' });
  }
});

// Fixture routes
router.get('/competitions/:competitionId/fixtures', async (req, res) => {
  try {
    const { seasonId, groupId, status } = req.query;
    const params: any = {};
    if (seasonId) params.seasonId = seasonId;
    if (groupId) params.groupId = groupId;
    if (status) params.status = status as FixtureStatus;

    const fixtures = await fixtureService.getFixturesByCompetition(req.params.competitionId, params);
    res.json({ success: true, data: fixtures });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch fixtures' });
  }
});

router.get('/fixtures/:id', async (req, res) => {
  try {
    const fixture = await fixtureService.getFixtureById(req.params.id);
    if (!fixture) {
      return res.status(404).json({ success: false, error: 'Fixture not found' });
    }
    res.json({ success: true, data: fixture });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch fixture' });
  }
});

router.post('/competitions/:competitionId/fixtures', async (req, res) => {
  try {
    const input: FixtureCreateInput = { ...req.body, competitionId: req.params.competitionId };
    const fixture = await fixtureService.createFixture(input);
    res.status(201).json({ success: true, data: fixture });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create fixture' });
  }
});

router.put('/fixtures/:id', async (req, res) => {
  try {
    const input: FixtureUpdateInput = req.body;
    const fixture = await fixtureService.updateFixture(req.params.id, input);
    res.json({ success: true, data: fixture });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update fixture' });
  }
});

router.delete('/fixtures/:id', async (req, res) => {
  try {
    const deleted = await fixtureService.deleteFixture(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Fixture not found' });
    }
    res.json({ success: true, message: 'Fixture deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete fixture' });
  }
});

// Generate round-robin fixtures
router.post('/competitions/:competitionId/seasons/:seasonId/groups/:groupId/generate-fixtures', async (req, res) => {
  try {
    const { teams } = req.body;
    if (!teams || !Array.isArray(teams) || teams.length < 2) {
      return res.status(400).json({ success: false, error: 'At least 2 teams are required' });
    }

    const fixtures = await fixtureService.generateRoundRobinFixtures(
      req.params.competitionId,
      req.params.seasonId,
      req.params.groupId,
      teams
    );
    res.status(201).json({ success: true, data: fixtures });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate fixtures' });
  }
});

// Standing routes
router.get('/competitions/:competitionId/standings', async (req, res) => {
  try {
    const { seasonId, groupId } = req.query;
    const params: any = {};
    if (seasonId) params.seasonId = seasonId;
    if (groupId) params.groupId = groupId;

    const standings = await standingService.getStandings(req.params.competitionId, params);
    res.json({ success: true, data: standings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch standings' });
  }
});

// Calculate standings
router.post('/competitions/:competitionId/seasons/:seasonId/calculate-standings', async (req, res) => {
  try {
    const { groupId } = req.query;
    const standings = await standingService.calculateStandings(
      req.params.competitionId,
      req.params.seasonId,
      groupId as string
    );
    res.json({ success: true, data: standings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate standings' });
  }
});

// Tournament Team routes
router.get('/tournaments/:tournamentId/teams', async (req, res) => {
  try {
    const teams = await tournamentTeamService.getTeamsByTournament(req.params.tournamentId);
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tournament teams' });
  }
});

router.get('/tournament-teams/:id', async (req, res) => {
  try {
    const team = await tournamentTeamService.getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tournament team' });
  }
});

router.post('/tournaments/:tournamentId/teams', async (req, res) => {
  try {
    const input: TournamentTeamCreateInput = {
      ...req.body,
      tournamentId: req.params.tournamentId
    };
    const team = await tournamentTeamService.registerTeam(input);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register team' });
  }
});

router.put('/tournament-teams/:id', async (req, res) => {
  try {
    const input: TournamentTeamUpdateInput = req.body;
    const team = await tournamentTeamService.updateTeamRegistration(req.params.id, input);
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update team registration' });
  }
});

router.delete('/tournament-teams/:id', async (req, res) => {
  try {
    const deleted = await tournamentTeamService.deleteTeamFromTournament(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    res.json({ success: true, message: 'Team removed from tournament' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove team' });
  }
});

export default router;
