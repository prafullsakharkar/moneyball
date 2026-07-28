// Competition Service with CRUD operations and business logic

import { pool } from '../config/database';
import {
  Competition,
  Season,
  Group,
  Fixture,
  Standing,
  TournamentTeam,
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
  CricketFormat,
  CompetitionType,
  CompetitionStatus,
  SeasonStatus,
  GroupType,
  StageType,
  FixtureStatus,
  TournamentTeamStatus
} from '../models/Competition';

// Competition Service
export class CompetitionService {
  // Get all competitions
  async getAllCompetitions(params?: {
    organizationId?: string;
    status?: CompetitionStatus;
    format?: CricketFormat;
    page?: number;
    limit?: number;
  }): Promise<{ competitions: Competition[]; total: number }> {
    const client = await pool.connect();
    try {
      const { organizationId, status, format, page = 1, limit = 10 } = params || {};
      const offset = (page - 1) * limit;

      const conditions: string[] = [];
      const values: any[] = [];

      if (organizationId) {
        conditions.push('organization_id = $' + (values.length + 1));
        values.push(organizationId);
      }

      if (status) {
        conditions.push('status = $' + (values.length + 1));
        values.push(status);
      }

      if (format) {
        conditions.push('format = $' + (values.length + 1));
        values.push(format);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT * FROM competitions ${whereClause}
        ORDER BY start_date DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `;
      values.push(limit, offset);

      const result = await client.query(query, values);
      const countQuery = `SELECT COUNT(*) FROM competitions ${whereClause}`;
      const countResult = await client.query(countQuery, values.slice(0, -2));

      return {
        competitions: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get competition by ID
  async getCompetitionById(id: string): Promise<Competition | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM competitions WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create competition
  async createCompetition(input: CompetitionCreateInput): Promise<Competition> {
    const client = await pool.connect();
    try {
      const {
        organizationId,
        name,
        shortName,
        description,
        format,
        competitionType,
        category,
        gender,
        ageGroup,
        startDate,
        endDate,
        registrationDeadline,
        venueId,
        prizePool,
        sponsorIds
      } = input;

      const result = await client.query(
        `
        INSERT INTO competitions (
          id, organization_id, name, short_name, description, format,
          competition_type, category, gender, age_group, start_date, end_date,
          registration_deadline, venue_id, prize_pool, sponsor_ids, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, 'Draft'
        )
        RETURNING *
        `,
        [
          organizationId, name, shortName, description, format, competitionType,
          category, gender, ageGroup, startDate, endDate, registrationDeadline,
          venueId, prizePool ? JSON.stringify(prizePool) : null,
          sponsorIds ? JSON.stringify(sponsorIds) : null
        ]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update competition
  async updateCompetition(id: string, input: CompetitionUpdateInput): Promise<Competition> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.shortName) {
        updates.push(`short_name = $${paramIndex++}`);
        values.push(input.shortName);
      }
      if (input.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.format) {
        updates.push(`format = $${paramIndex++}`);
        values.push(input.format);
      }
      if (input.competitionType) {
        updates.push(`competition_type = $${paramIndex++}`);
        values.push(input.competitionType);
      }
      if (input.category) {
        updates.push(`category = $${paramIndex++}`);
        values.push(input.category);
      }
      if (input.gender) {
        updates.push(`gender = $${paramIndex++}`);
        values.push(input.gender);
      }
      if (input.ageGroup) {
        updates.push(`age_group = $${paramIndex++}`);
        values.push(input.ageGroup);
      }
      if (input.startDate) {
        updates.push(`start_date = $${paramIndex++}`);
        values.push(input.startDate);
      }
      if (input.endDate) {
        updates.push(`end_date = $${paramIndex++}`);
        values.push(input.endDate);
      }
      if (input.registrationDeadline) {
        updates.push(`registration_deadline = $${paramIndex++}`);
        values.push(input.registrationDeadline);
      }
      if (input.venueId) {
        updates.push(`venue_id = $${paramIndex++}`);
        values.push(input.venueId);
      }
      if (input.prizePool) {
        updates.push(`prize_pool = $${paramIndex++}`);
        values.push(JSON.stringify(input.prizePool));
      }
      if (input.sponsorIds) {
        updates.push(`sponsor_ids = $${paramIndex++}`);
        values.push(JSON.stringify(input.sponsorIds));
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        // Only updated_at, return current record
        const result = await client.query(
          'SELECT * FROM competitions WHERE id = $1',
          [id]
        );
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE competitions SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete competition
  async deleteCompetition(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM competitions WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Update competition status
  async updateCompetitionStatus(id: string, status: CompetitionStatus): Promise<Competition> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE competitions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Season Service
export class SeasonService {
  // Get all seasons for a competition
  async getSeasonsByCompetition(competitionId: string): Promise<Season[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM seasons WHERE competition_id = $1 ORDER BY start_date',
        [competitionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get season by ID
  async getSeasonById(id: string): Promise<Season | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM seasons WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create season
  async createSeason(input: SeasonCreateInput): Promise<Season> {
    const client = await pool.connect();
    try {
      const { competitionId, name, startDate, endDate, status = 'Draft' } = input;
      const result = await client.query(
        `
        INSERT INTO seasons (id, competition_id, name, start_date, end_date, status)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING *
        `,
        [competitionId, name, startDate, endDate, status]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update season
  async updateSeason(id: string, input: SeasonUpdateInput): Promise<Season> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.startDate) {
        updates.push(`start_date = $${paramIndex++}`);
        values.push(input.startDate);
      }
      if (input.endDate) {
        updates.push(`end_date = $${paramIndex++}`);
        values.push(input.endDate);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM seasons WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE seasons SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete season
  async deleteSeason(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM seasons WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Group Service
export class GroupService {
  // Get all groups for a competition/season
  async getGroupsByCompetition(competitionId: string, seasonId?: string): Promise<Group[]> {
    const client = await pool.connect();
    try {
      let result;
      if (seasonId) {
        result = await client.query(
          'SELECT * FROM groups WHERE competition_id = $1 AND season_id = $2 ORDER BY name',
          [competitionId, seasonId]
        );
      } else {
        result = await client.query(
          'SELECT * FROM groups WHERE competition_id = $1 AND season_id IS NULL ORDER BY name',
          [competitionId]
        );
      }
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get group by ID
  async getGroupById(id: string): Promise<Group | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM groups WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create group
  async createGroup(input: GroupCreateInput): Promise<Group> {
    const client = await pool.connect();
    try {
      const { competitionId, seasonId, name, groupType, teams = [] } = input;
      const result = await client.query(
        `
        INSERT INTO groups (id, competition_id, season_id, name, group_type, teams)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING *
        `,
        [competitionId, seasonId, name, groupType, JSON.stringify(teams)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update group
  async updateGroup(id: string, input: GroupUpdateInput): Promise<Group> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.groupType) {
        updates.push(`group_type = $${paramIndex++}`);
        values.push(input.groupType);
      }
      if (input.teams) {
        updates.push(`teams = $${paramIndex++}`);
        values.push(JSON.stringify(input.teams));
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM groups WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE groups SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete group
  async deleteGroup(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM groups WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Fixture Service
export class FixtureService {
  // Get all fixtures for a competition/season
  async getFixturesByCompetition(
    competitionId: string,
    params?: { seasonId?: string; groupId?: string; status?: FixtureStatus }
  ): Promise<Fixture[]> {
    const client = await pool.connect();
    try {
      const { seasonId, groupId, status } = params || {};
      const conditions: string[] = ['competition_id = $1'];
      const values: any[] = [competitionId];
      let paramIndex = 2;

      if (seasonId) {
        conditions.push(`season_id = $${paramIndex++}`);
        values.push(seasonId);
      }
      if (groupId) {
        conditions.push(`group_id = $${paramIndex++}`);
        values.push(groupId);
      }
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      const result = await client.query(
        `SELECT * FROM fixtures WHERE ${conditions.join(' AND ')} ORDER BY scheduled_date`,
        values
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get fixture by ID
  async getFixtureById(id: string): Promise<Fixture | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM fixtures WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create fixture
  async createFixture(input: FixtureCreateInput): Promise<Fixture> {
    const client = await pool.connect();
    try {
      const {
        competitionId,
        seasonId,
        groupId,
        matchId,
        round,
        stage,
        scheduledDate,
        scheduledTime,
        venueId,
        team1Id,
        team2Id
      } = input;

      const result = await client.query(
        `
        INSERT INTO fixtures (
          id, competition_id, season_id, group_id, match_id, round, stage,
          scheduled_date, scheduled_time, venue_id, team1_id, team2_id, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Scheduled'
        )
        RETURNING *
        `,
        [
          competitionId, seasonId, groupId, matchId, round, stage,
          scheduledDate, scheduledTime, venueId, team1Id, team2Id
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update fixture
  async updateFixture(id: string, input: FixtureUpdateInput): Promise<Fixture> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.matchId) {
        updates.push(`match_id = $${paramIndex++}`);
        values.push(input.matchId);
      }
      if (input.round) {
        updates.push(`round = $${paramIndex++}`);
        values.push(input.round);
      }
      if (input.stage) {
        updates.push(`stage = $${paramIndex++}`);
        values.push(input.stage);
      }
      if (input.scheduledDate) {
        updates.push(`scheduled_date = $${paramIndex++}`);
        values.push(input.scheduledDate);
      }
      if (input.scheduledTime) {
        updates.push(`scheduled_time = $${paramIndex++}`);
        values.push(input.scheduledTime);
      }
      if (input.venueId) {
        updates.push(`venue_id = $${paramIndex++}`);
        values.push(input.venueId);
      }
      if (input.team1Id) {
        updates.push(`team1_id = $${paramIndex++}`);
        values.push(input.team1Id);
      }
      if (input.team2Id) {
        updates.push(`team2_id = $${paramIndex++}`);
        values.push(input.team2Id);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM fixtures WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE fixtures SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete fixture
  async deleteFixture(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM fixtures WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Generate round-robin fixtures
  async generateRoundRobinFixtures(
    competitionId: string,
    seasonId: string,
    groupId: string,
    teams: string[]
  ): Promise<Fixture[]> {
    const fixtures: Fixture[] = [];
    const numTeams = teams.length;

    if (numTeams < 2) {
      throw new Error('At least 2 teams are required for round-robin fixtures');
    }

    // Round-robin algorithm (circle method)
    const teamList: (string | null)[] = [...teams];
    const isOdd = numTeams % 2 !== 0;

    if (isOdd) {
      teamList.push(null); // Add a dummy team for bye
    }

    const numRounds = teamList.length - 1;
    const matchesPerRound = teamList.length / 2;

    for (let round = 0; round < numRounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const team1Index = (match === 0) ? 0 : (match + round) % (teamList.length - 1);
        const team2Index = (teamList.length - 1 - match + round + 1) % (teamList.length - 1);

        if (match === 0) {
          // First match of round
          const team1 = teamList[0];
          const team2 = teamList[teamList.length - 1];

          if (team1 && team2) {
            fixtures.push({
              id: '',
              competitionId,
              seasonId,
              groupId,
              matchId: undefined,
              round: round + 1,
              stage: StageType.RoundRobin,
              scheduledDate: new Date().toISOString().split('T')[0],
              scheduledTime: '10:00',
              venueId: undefined,
              team1Id: team1,
              team2Id: team2,
              status: FixtureStatus.Scheduled,
              createdAt: '',
              updatedAt: ''
            });
          }
        } else {
          const team1 = teamList[team1Index];
          const team2 = teamList[team2Index];

          if (team1 && team2) {
            fixtures.push({
              id: '',
              competitionId,
              seasonId,
              groupId,
              matchId: undefined,
              round: round + 1,
              stage: StageType.RoundRobin,
              scheduledDate: new Date().toISOString().split('T')[0],
              scheduledTime: '10:00',
              venueId: undefined,
              team1Id: team1,
              team2Id: team2,
              status: FixtureStatus.Scheduled,
              createdAt: '',
              updatedAt: ''
            });
          }
        }
      }
    }

    return fixtures;
  }
}

// Standing Service
export class StandingService {
  // Get standings for a competition/season/group
  async getStandings(
    competitionId: string,
    params?: { seasonId?: string; groupId?: string }
  ): Promise<Standing[]> {
    const client = await pool.connect();
    try {
      const { seasonId, groupId } = params || {};
      const conditions: string[] = ['competition_id = $1'];
      const values: any[] = [competitionId];
      let paramIndex = 2;

      if (seasonId) {
        conditions.push(`season_id = $${paramIndex++}`);
        values.push(seasonId);
      }
      if (groupId) {
        conditions.push(`group_id = $${paramIndex++}`);
        values.push(groupId);
      }

      const result = await client.query(
        `SELECT * FROM standings WHERE ${conditions.join(' AND ')} ORDER BY position`,
        values
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Calculate standings based on fixtures
  async calculateStandings(
    competitionId: string,
    seasonId: string,
    groupId?: string
  ): Promise<Standing[]> {
    const client = await pool.connect();
    try {
      // Get all completed fixtures for this group
      const fixturesResult = await client.query(
        `
        SELECT f.*, 
               t1.name as team1_name, t2.name as team2_name,
               s1.score as team1_score, s2.score as team2_score
        FROM fixtures f
        LEFT JOIN teams t1 ON f.team1_id = t1.id
        LEFT JOIN teams t2 ON f.team2_id = t2.id
        LEFT JOIN scoring_sessions s1 ON f.match_id = s1.match_id AND s1.innings = 1
        LEFT JOIN scoring_sessions s2 ON f.match_id = s2.match_id AND s2.innings = 2
        WHERE f.competition_id = $1 
          AND f.season_id = $2 
          ${groupId ? 'AND f.group_id = $3' : ''}
          AND f.status = 'Completed'
        `,
        groupId ? [competitionId, seasonId, groupId] : [competitionId, seasonId]
      );

      const standingsMap: Record<string, Standing> = {};

      // Initialize standings for all teams
      const teamsResult = await client.query(
        `
        SELECT DISTINCT team_id FROM tournament_teams 
        WHERE tournament_id = $1
        ${seasonId ? 'AND team_id IN (SELECT team_id FROM standings WHERE competition_id = $1 AND season_id = $2)' : ''}
        `,
        [competitionId]
      );

      for (const row of teamsResult.rows) {
        standingsMap[row.team_id] = {
          id: '',
          competitionId,
          seasonId: seasonId || '',
          groupId: groupId || '',
          teamId: row.team_id,
          matchesPlayed: 0,
          matchesWon: 0,
          matchesLost: 0,
          matchesTied: 0,
          matchesNoResult: 0,
          points: 0,
          netRunRate: 0,
          position: 0,
          createdAt: '',
          updatedAt: ''
        };
      }

      // Process each fixture
      for (const fixture of fixturesResult.rows) {
        if (!fixture.team1_id || !fixture.team2_id) continue;

        // Update matches played
        if (!standingsMap[fixture.team1_id]) {
          standingsMap[fixture.team1_id] = {
            id: '',
            competitionId,
            seasonId: seasonId || '',
            groupId: groupId || '',
            teamId: fixture.team1_id,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            matchesTied: 0,
            matchesNoResult: 0,
            points: 0,
            netRunRate: 0,
            position: 0,
            createdAt: '',
            updatedAt: ''
          };
        }
        if (!standingsMap[fixture.team2_id]) {
          standingsMap[fixture.team2_id] = {
            id: '',
            competitionId,
            seasonId: seasonId || '',
            groupId: groupId || '',
            teamId: fixture.team2_id,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            matchesTied: 0,
            matchesNoResult: 0,
            points: 0,
            netRunRate: 0,
            position: 0,
            createdAt: '',
            updatedAt: ''
          };
        }

        standingsMap[fixture.team1_id].matchesPlayed++;
        standingsMap[fixture.team2_id].matchesPlayed++;

        // Determine winner (simplified - would need actual score data)
        // For now, assume team1 wins if scores are available
        if (fixture.team1_score && fixture.team2_score) {
          const score1 = parseInt(fixture.team1_score) || 0;
          const score2 = parseInt(fixture.team2_score) || 0;

          if (score1 > score2) {
            standingsMap[fixture.team1_id].matchesWon++;
            standingsMap[fixture.team1_id].points += 2;
            standingsMap[fixture.team2_id].matchesLost++;
          } else if (score2 > score1) {
            standingsMap[fixture.team2_id].matchesWon++;
            standingsMap[fixture.team2_id].points += 2;
            standingsMap[fixture.team1_id].matchesLost++;
          } else {
            standingsMap[fixture.team1_id].matchesTied++;
            standingsMap[fixture.team1_id].points += 1;
            standingsMap[fixture.team2_id].matchesTied++;
            standingsMap[fixture.team2_id].points += 1;
          }
        } else {
          // No result
          standingsMap[fixture.team1_id].matchesNoResult++;
          standingsMap[fixture.team2_id].matchesNoResult++;
          standingsMap[fixture.team1_id].points += 1;
          standingsMap[fixture.team2_id].points += 1;
        }
      }

      // Convert to array and sort
      const standings = Object.values(standingsMap);
      standings.sort((a, b) => b.points - a.points || (b.matchesWon - a.matchesWon));

      // Update positions
      standings.forEach((standing, index) => {
        standing.position = index + 1;
      });

      return standings;
    } finally {
      client.release();
    }
  }

  // Save standings to database
  async saveStandings(standings: Standing[]): Promise<void> {
    const client = await pool.connect();
    try {
      for (const standing of standings) {
        await client.query(
          `
          INSERT INTO standings (
            id, competition_id, season_id, group_id, team_id,
            matches_played, matches_won, matches_lost, matches_tied, matches_no_result,
            points, net_run_rate, position
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
          )
          ON CONFLICT (competition_id, season_id, group_id, team_id) DO UPDATE SET
            matches_played = EXCLUDED.matches_played,
            matches_won = EXCLUDED.matches_won,
            matches_lost = EXCLUDED.matches_lost,
            matches_tied = EXCLUDED.matches_tied,
            matches_no_result = EXCLUDED.matches_no_result,
            points = EXCLUDED.points,
            net_run_rate = EXCLUDED.net_run_rate,
            position = EXCLUDED.position,
            updated_at = CURRENT_TIMESTAMP
          `,
          [
            standing.competitionId,
            standing.seasonId,
            standing.groupId,
            standing.teamId,
            standing.matchesPlayed,
            standing.matchesWon,
            standing.matchesLost,
            standing.matchesTied,
            standing.matchesNoResult,
            standing.points,
            standing.netRunRate || 0,
            standing.position
          ]
        );
      }
    } finally {
      client.release();
    }
  }
}

// Tournament Team Service
export class TournamentTeamService {
  // Get all teams for a tournament
  async getTeamsByTournament(tournamentId: string): Promise<TournamentTeam[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tournament_teams WHERE tournament_id = $1 ORDER BY registered_date',
        [tournamentId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get team by ID
  async getTeamById(id: string): Promise<TournamentTeam | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tournament_teams WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Register team to tournament
  async registerTeam(input: TournamentTeamCreateInput): Promise<TournamentTeam> {
    const client = await pool.connect();
    try {
      const { tournamentId, teamId, squad = [], captainId, coachId } = input;
      const result = await client.query(
        `
        INSERT INTO tournament_teams (
          id, tournament_id, team_id, registered_date, squad, captain_id, coach_id, status
        ) VALUES (
          gen_random_uuid(), $1, $2, CURRENT_DATE, $3, $4, $5, 'Registered'
        )
        ON CONFLICT (tournament_id, team_id) DO UPDATE SET
          squad = EXCLUDED.squad,
          captain_id = EXCLUDED.captain_id,
          coach_id = EXCLUDED.coach_id,
          status = 'Registered',
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [tournamentId, teamId, JSON.stringify(squad), captainId, coachId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update team registration
  async updateTeamRegistration(id: string, input: TournamentTeamUpdateInput): Promise<TournamentTeam> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.squad) {
        updates.push(`squad = $${paramIndex++}`);
        values.push(JSON.stringify(input.squad));
      }
      if (input.captainId) {
        updates.push(`captain_id = $${paramIndex++}`);
        values.push(input.captainId);
      }
      if (input.coachId) {
        updates.push(`coach_id = $${paramIndex++}`);
        values.push(input.coachId);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query(
          'SELECT * FROM tournament_teams WHERE id = $1',
          [id]
        );
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE tournament_teams SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete team from tournament
  async deleteTeamFromTournament(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM tournament_teams WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Export all services
export const competitionService = new CompetitionService();
export const seasonService = new SeasonService();
export const groupService = new GroupService();
export const fixtureService = new FixtureService();
export const standingService = new StandingService();
export const tournamentTeamService = new TournamentTeamService();
