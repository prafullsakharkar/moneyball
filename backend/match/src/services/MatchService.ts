// Match Service for Match Service

import { pool } from '../config/database.js';
import { generateId, getCurrentTimestamp } from '@shared/utils';
import { Match, MatchCreateInput, MatchUpdateInput, MatchOfficial, MatchOfficialInput, MatchPlayingXI, MatchPlayingXIInput, MatchNote, MatchNoteInput } from '../models/index.js';

export class MatchService {
  // Get all matches
  async getAllMatches(params?: {
    tournamentId?: string;
    competitionId?: string;
    teamId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ matches: Match[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { tournamentId, competitionId, teamId, status, dateFrom, dateTo, page = 1, limit = 10, search } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, external_id, tournament_id, competition_id, team1_id, team2_id, venue_id, 
               format, match_type, match_status, scheduled_start, actual_start, actual_end, 
               toss_winner_id, toss_decision, first_innings_team_id, second_innings_team_id, 
               result, winner_id, margin, player_of_the_match, weather, match_notes, status, 
               created_at, updated_at, created_by, updated_by
        FROM matches
        WHERE 1=1
      `;
      const paramsArray: any[] = [];
      let paramIndex = 1;

      if (tournamentId) {
        query += ` AND tournament_id = $${paramIndex}`;
        paramsArray.push(tournamentId);
        paramIndex++;
      }

      if (competitionId) {
        query += ` AND competition_id = $${paramIndex}`;
        paramsArray.push(competitionId);
        paramIndex++;
      }

      if (teamId) {
        query += ` AND (team1_id = $${paramIndex} OR team2_id = $${paramIndex})`;
        paramsArray.push(teamId);
        paramIndex++;
      }

      if (status) {
        query += ` AND match_status = $${paramIndex}`;
        paramsArray.push(status);
        paramIndex++;
      }

      if (dateFrom) {
        query += ` AND scheduled_start >= $${paramIndex}`;
        paramsArray.push(dateFrom);
        paramIndex++;
      }

      if (dateTo) {
        query += ` AND scheduled_start <= $${paramIndex}`;
        paramsArray.push(dateTo);
        paramIndex++;
      }

      if (search) {
        query += ` AND (team1_id IN (SELECT id FROM teams WHERE name ILIKE $${paramIndex}) 
                   OR team2_id IN (SELECT id FROM teams WHERE name ILIKE $${paramIndex}))`;
        paramsArray.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY scheduled_start DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM matches WHERE 1=1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, paramIndex - 2));

      const matches = result.rows.map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        tournamentId: row.tournament_id,
        competitionId: row.competition_id,
        team1Id: row.team1_id,
        team2Id: row.team2_id,
        venueId: row.venue_id,
        format: row.format,
        matchType: row.match_type,
        matchStatus: row.match_status,
        scheduledStart: row.scheduled_start,
        actualStart: row.actual_start,
        actualEnd: row.actual_end,
        tossWinnerId: row.toss_winner_id,
        tossDecision: row.toss_decision,
        firstInningsTeamId: row.first_innings_team_id,
        secondInningsTeamId: row.second_innings_team_id,
        result: row.result,
        winnerId: row.winner_id,
        margin: row.margin,
        playerOfTheMatch: row.player_of_the_match,
        weather: row.weather,
        matchNotes: row.match_notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));

      return {
        matches,
        meta: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
          hasMore: page * limit < parseInt(countResult.rows[0].count)
        }
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get match by ID
  async getMatchById(id: string): Promise<Match | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, external_id, tournament_id, competition_id, team1_id, team2_id, venue_id, 
                format, match_type, match_status, scheduled_start, actual_start, actual_end, 
                toss_winner_id, toss_decision, first_innings_team_id, second_innings_team_id, 
                result, winner_id, margin, player_of_the_match, weather, match_notes, status, 
                created_at, updated_at, created_by, updated_by
         FROM matches WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        tournamentId: row.tournament_id,
        competitionId: row.competition_id,
        team1Id: row.team1_id,
        team2Id: row.team2_id,
        venueId: row.venue_id,
        format: row.format,
        matchType: row.match_type,
        matchStatus: row.match_status,
        scheduledStart: row.scheduled_start,
        actualStart: row.actual_start,
        actualEnd: row.actual_end,
        tossWinnerId: row.toss_winner_id,
        tossDecision: row.toss_decision,
        firstInningsTeamId: row.first_innings_team_id,
        secondInningsTeamId: row.second_innings_team_id,
        result: row.result,
        winnerId: row.winner_id,
        margin: row.margin,
        playerOfTheMatch: row.player_of_the_match,
        weather: row.weather,
        matchNotes: row.match_notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get match officials
  async getMatchOfficials(matchId: string): Promise<MatchOfficial[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, match_id, official_id, role, assigned_at, ended_at
         FROM match_officials WHERE match_id = $1`,
        [matchId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        matchId: row.match_id,
        officialId: row.official_id,
        role: row.role,
        assignedAt: row.assigned_at,
        endedAt: row.ended_at
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get match playing XI
  async getMatchPlayingXI(matchId: string): Promise<MatchPlayingXI[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, match_id, team_id, player_id, is_starter, batting_order, bowling_order, created_at
         FROM match_playing_xi WHERE match_id = $1`,
        [matchId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        matchId: row.match_id,
        teamId: row.team_id,
        playerId: row.player_id,
        isStarter: row.is_starter,
        battingOrder: row.batting_order,
        bowlingOrder: row.bowling_order,
        createdAt: row.created_at
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get match notes
  async getMatchNotes(matchId: string): Promise<MatchNote[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, match_id, note, note_type, created_by, created_at
         FROM match_notes WHERE match_id = $1 ORDER BY created_at`,
        [matchId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        matchId: row.match_id,
        note: row.note,
        noteType: row.note_type,
        createdBy: row.created_by,
        createdAt: row.created_at
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Create match
  async createMatch(input: MatchCreateInput, userId: string): Promise<Match> {
    const client = await pool.connect();
    
    try {
      const matchId = generateId();

      const result = await client.query(
        `INSERT INTO matches (id, tournament_id, competition_id, team1_id, team2_id, venue_id, 
                              format, match_type, scheduled_start, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, external_id, tournament_id, competition_id, team1_id, team2_id, venue_id, 
                   format, match_type, match_status, scheduled_start, actual_start, actual_end, 
                   toss_winner_id, toss_decision, first_innings_team_id, second_innings_team_id, 
                   result, winner_id, margin, player_of_the_match, weather, match_notes, status, 
                   created_at, updated_at, created_by, updated_by`,
        [matchId, input.tournamentId, input.competitionId, input.team1Id, input.team2Id, 
         input.venueId, input.format, input.matchType, input.scheduledStart, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        tournamentId: row.tournament_id,
        competitionId: row.competition_id,
        team1Id: row.team1_id,
        team2Id: row.team2_id,
        venueId: row.venue_id,
        format: row.format,
        matchType: row.match_type,
        matchStatus: row.match_status,
        scheduledStart: row.scheduled_start,
        actualStart: row.actual_start,
        actualEnd: row.actual_end,
        tossWinnerId: row.toss_winner_id,
        tossDecision: row.toss_decision,
        firstInningsTeamId: row.first_innings_team_id,
        secondInningsTeamId: row.second_innings_team_id,
        result: row.result,
        winnerId: row.winner_id,
        margin: row.margin,
        playerOfTheMatch: row.player_of_the_match,
        weather: row.weather,
        matchNotes: row.match_notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Update match
  async updateMatch(id: string, input: MatchUpdateInput, userId: string): Promise<Match> {
    const client = await pool.connect();
    
    try {
      const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [userId, id];
      let paramIndex = 3;

      if (input.venueId) {
        updates.push(`venue_id = $${paramIndex}`);
        values.push(input.venueId);
        paramIndex++;
      }

      if (input.scheduledStart) {
        updates.push(`scheduled_start = $${paramIndex}`);
        values.push(input.scheduledStart);
        paramIndex++;
      }

      if (input.actualStart) {
        updates.push(`actual_start = $${paramIndex}`);
        values.push(input.actualStart);
        paramIndex++;
      }

      if (input.actualEnd) {
        updates.push(`actual_end = $${paramIndex}`);
        values.push(input.actualEnd);
        paramIndex++;
      }

      if (input.tossWinnerId) {
        updates.push(`toss_winner_id = $${paramIndex}`);
        values.push(input.tossWinnerId);
        paramIndex++;
      }

      if (input.tossDecision) {
        updates.push(`toss_decision = $${paramIndex}`);
        values.push(input.tossDecision);
        paramIndex++;
      }

      if (input.firstInningsTeamId) {
        updates.push(`first_innings_team_id = $${paramIndex}`);
        values.push(input.firstInningsTeamId);
        paramIndex++;
      }

      if (input.secondInningsTeamId) {
        updates.push(`second_innings_team_id = $${paramIndex}`);
        values.push(input.secondInningsTeamId);
        paramIndex++;
      }

      if (input.result) {
        updates.push(`result = $${paramIndex}`);
        values.push(input.result);
        paramIndex++;
      }

      if (input.winnerId) {
        updates.push(`winner_id = $${paramIndex}`);
        values.push(input.winnerId);
        paramIndex++;
      }

      if (input.margin) {
        updates.push(`margin = $${paramIndex}`);
        values.push(input.margin);
        paramIndex++;
      }

      if (input.playerOfTheMatch) {
        updates.push(`player_of_the_match = $${paramIndex}`);
        values.push(input.playerOfTheMatch);
        paramIndex++;
      }

      if (input.weather) {
        updates.push(`weather = $${paramIndex}`);
        values.push(JSON.stringify(input.weather));
        paramIndex++;
      }

      if (input.matchNotes) {
        updates.push(`match_notes = $${paramIndex}`);
        values.push(input.matchNotes);
        paramIndex++;
      }

      if (input.matchStatus) {
        updates.push(`match_status = $${paramIndex}`);
        values.push(input.matchStatus);
        paramIndex++;
      }

      const query = `
        UPDATE matches 
        SET ${updates.join(', ')}, updated_by = $1
        WHERE id = $2
        RETURNING id, external_id, tournament_id, competition_id, team1_id, team2_id, venue_id, 
                  format, match_type, match_status, scheduled_start, actual_start, actual_end, 
                  toss_winner_id, toss_decision, first_innings_team_id, second_innings_team_id, 
                  result, winner_id, margin, player_of_the_match, weather, match_notes, status, 
                  created_at, updated_at, created_by, updated_by
      `;

      const result = await client.query(query, values);

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        tournamentId: row.tournament_id,
        competitionId: row.competition_id,
        team1Id: row.team1_id,
        team2Id: row.team2_id,
        venueId: row.venue_id,
        format: row.format,
        matchType: row.match_type,
        matchStatus: row.match_status,
        scheduledStart: row.scheduled_start,
        actualStart: row.actual_start,
        actualEnd: row.actual_end,
        tossWinnerId: row.toss_winner_id,
        tossDecision: row.toss_decision,
        firstInningsTeamId: row.first_innings_team_id,
        secondInningsTeamId: row.second_innings_team_id,
        result: row.result,
        winnerId: row.winner_id,
        margin: row.margin,
        playerOfTheMatch: row.player_of_the_match,
        weather: row.weather,
        matchNotes: row.match_notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Add match official
  async addMatchOfficial(matchId: string, input: MatchOfficialInput, userId: string): Promise<MatchOfficial> {
    const client = await pool.connect();
    
    try {
      const officialId = generateId();

      const result = await client.query(
        `INSERT INTO match_officials (id, match_id, official_id, role, assigned_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, match_id, official_id, role, assigned_at, ended_at`,
        [officialId, matchId, input.officialId, input.role, getCurrentTimestamp()]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        officialId: row.official_id,
        role: row.role,
        assignedAt: row.assigned_at,
        endedAt: row.ended_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Add playing XI
  async addPlayingXI(matchId: string, input: MatchPlayingXIInput, userId: string): Promise<MatchPlayingXI> {
    const client = await pool.connect();
    
    try {
      const playingXIId = generateId();

      const result = await client.query(
        `INSERT INTO match_playing_xi (id, match_id, player_id, is_starter, batting_order, bowling_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, match_id, team_id, player_id, is_starter, batting_order, bowling_order, created_at`,
        [playingXIId, matchId, input.playerId, input.isStarter || true, input.battingOrder, input.bowlingOrder]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        teamId: row.team_id,
        playerId: row.player_id,
        isStarter: row.is_starter,
        battingOrder: row.batting_order,
        bowlingOrder: row.bowling_order,
        createdAt: row.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Add match note
  async addMatchNote(matchId: string, input: MatchNoteInput, userId: string): Promise<MatchNote> {
    const client = await pool.connect();
    
    try {
      const noteId = generateId();

      const result = await client.query(
        `INSERT INTO match_notes (id, match_id, note, note_type, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, match_id, note, note_type, created_by, created_at`,
        [noteId, matchId, input.note, input.noteType, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        note: row.note,
        noteType: row.note_type,
        createdBy: row.created_by,
        createdAt: row.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export const matchService = new MatchService();
