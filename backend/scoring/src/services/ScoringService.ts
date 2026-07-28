// Scoring Service for Scoring Service

import { pool } from '../config/database.js';
import { generateId, getCurrentTimestamp } from '@shared/utils';
import { ScoringSession, ScoringSessionCreateInput, ScoringEvent, ScoringEventCreateInput, ScoringNote, ScoringNoteInput, BallByBallScoringInput, Scorecard } from '../models/index.js';

export class ScoringService {
  // Get all scoring sessions
  async getAllScoringSessions(params?: {
    matchId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ sessions: ScoringSession[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { matchId, status, page = 1, limit = 10 } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, match_id, session_status, innings_number, current_over, current_ball, 
               runs, wickets, extras, last_ball_by, last_ball_to, last_ball_result, 
               created_at, updated_at, created_by, updated_by
        FROM scoring_sessions
        WHERE 1=1
      `;
      const paramsArray: any[] = [];
      let paramIndex = 1;

      if (matchId) {
        query += ` AND match_id = $${paramIndex}`;
        paramsArray.push(matchId);
        paramIndex++;
      }

      if (status) {
        query += ` AND session_status = $${paramIndex}`;
        paramsArray.push(status);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM scoring_sessions WHERE 1=1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, paramIndex - 2));

      const sessions = result.rows.map((row: any) => ({
        id: row.id,
        matchId: row.match_id,
        sessionStatus: row.session_status,
        inningsNumber: row.innings_number,
        currentOver: row.current_over,
        currentBall: row.current_ball,
        runs: row.runs,
        wickets: row.wickets,
        extras: row.extras,
        lastBallBy: row.last_ball_by,
        lastBallTo: row.last_ball_to,
        lastBallResult: row.last_ball_result,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));

      return {
        sessions,
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

  // Get scoring session by ID
  async getScoringSessionById(id: string): Promise<ScoringSession | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, match_id, session_status, innings_number, current_over, current_ball, 
                runs, wickets, extras, last_ball_by, last_ball_to, last_ball_result, 
                created_at, updated_at, created_by, updated_by
         FROM scoring_sessions WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        sessionStatus: row.session_status,
        inningsNumber: row.innings_number,
        currentOver: row.current_over,
        currentBall: row.current_ball,
        runs: row.runs,
        wickets: row.wickets,
        extras: row.extras,
        lastBallBy: row.last_ball_by,
        lastBallTo: row.last_ball_to,
        lastBallResult: row.last_ball_result,
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

  // Get scoring events
  async getScoringEvents(sessionId: string, params?: {
    overFrom?: number;
    overTo?: number;
    page?: number;
    limit?: number;
  }): Promise<{ events: ScoringEvent[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { overFrom, overTo, page = 1, limit = 50 } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, session_id, match_id, over_number, ball_number, event_type, event_outcome, 
               runs_scored, is_wicket, is_extras, extras_type, extras_runs, bowler_id, 
               batter_id, fielder_id, description, created_at, created_by
        FROM scoring_events
        WHERE session_id = $1
      `;
      const paramsArray: any[] = [sessionId];
      let paramIndex = 2;

      if (overFrom) {
        query += ` AND over_number >= $${paramIndex}`;
        paramsArray.push(overFrom);
        paramIndex++;
      }

      if (overTo) {
        query += ` AND over_number <= $${paramIndex}`;
        paramsArray.push(overTo);
        paramIndex++;
      }

      query += ` ORDER BY over_number, ball_number LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM scoring_events WHERE session_id = $1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, 1));

      const events = result.rows.map((row: any) => ({
        id: row.id,
        sessionId: row.session_id,
        matchId: row.match_id,
        overNumber: row.over_number,
        ballNumber: row.ball_number,
        eventType: row.event_type,
        eventOutcome: row.event_outcome,
        runsScored: row.runs_scored,
        isWicket: row.is_wicket,
        isExtras: row.is_extras,
        extrasType: row.extras_type,
        extrasRuns: row.extras_runs,
        bowlerId: row.bowler_id,
        batterId: row.batter_id,
        fielderId: row.fielder_id,
        description: row.description,
        createdAt: row.created_at,
        createdBy: row.created_by
      }));

      return {
        events,
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

  // Get scoring notes
  async getScoringNotes(sessionId: string): Promise<ScoringNote[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, session_id, note, note_type, created_by, created_at
         FROM scoring_notes WHERE session_id = $1 ORDER BY created_at`,
        [sessionId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        sessionId: row.session_id,
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

  // Create scoring session
  async createScoringSession(input: ScoringSessionCreateInput, userId: string): Promise<ScoringSession> {
    const client = await pool.connect();
    
    try {
      const sessionId = generateId();

      const result = await client.query(
        `INSERT INTO scoring_sessions (id, match_id, innings_number, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING id, match_id, session_status, innings_number, current_over, current_ball, 
                   runs, wickets, extras, last_ball_by, last_ball_to, last_ball_result, 
                   created_at, updated_at, created_by, updated_by`,
        [sessionId, input.matchId, input.inningsNumber, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        sessionStatus: row.session_status,
        inningsNumber: row.innings_number,
        currentOver: row.current_over,
        currentBall: row.current_ball,
        runs: row.runs,
        wickets: row.wickets,
        extras: row.extras,
        lastBallBy: row.last_ball_by,
        lastBallTo: row.last_ball_to,
        lastBallResult: row.last_ball_result,
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

  // Update scoring session
  async updateScoringSession(id: string, input: Partial<ScoringSession>, userId: string): Promise<ScoringSession> {
    const client = await pool.connect();
    
    try {
      const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [userId, id];
      let paramIndex = 3;

      if (input.sessionStatus) {
        updates.push(`session_status = $${paramIndex}`);
        values.push(input.sessionStatus);
        paramIndex++;
      }

      if (input.currentOver !== undefined) {
        updates.push(`current_over = $${paramIndex}`);
        values.push(input.currentOver);
        paramIndex++;
      }

      if (input.currentBall !== undefined) {
        updates.push(`current_ball = $${paramIndex}`);
        values.push(input.currentBall);
        paramIndex++;
      }

      if (input.runs !== undefined) {
        updates.push(`runs = $${paramIndex}`);
        values.push(input.runs);
        paramIndex++;
      }

      if (input.wickets !== undefined) {
        updates.push(`wickets = $${paramIndex}`);
        values.push(input.wickets);
        paramIndex++;
      }

      if (input.extras !== undefined) {
        updates.push(`extras = $${paramIndex}`);
        values.push(input.extras);
        paramIndex++;
      }

      if (input.lastBallBy) {
        updates.push(`last_ball_by = $${paramIndex}`);
        values.push(input.lastBallBy);
        paramIndex++;
      }

      if (input.lastBallTo) {
        updates.push(`last_ball_to = $${paramIndex}`);
        values.push(input.lastBallTo);
        paramIndex++;
      }

      if (input.lastBallResult) {
        updates.push(`last_ball_result = $${paramIndex}`);
        values.push(input.lastBallResult);
        paramIndex++;
      }

      const query = `
        UPDATE scoring_sessions 
        SET ${updates.join(', ')}, updated_by = $1
        WHERE id = $2
        RETURNING id, match_id, session_status, innings_number, current_over, current_ball, 
                  runs, wickets, extras, last_ball_by, last_ball_to, last_ball_result, 
                  created_at, updated_at, created_by, updated_by
      `;

      const result = await client.query(query, values);

      const row = result.rows[0];
      return {
        id: row.id,
        matchId: row.match_id,
        sessionStatus: row.session_status,
        inningsNumber: row.innings_number,
        currentOver: row.current_over,
        currentBall: row.current_ball,
        runs: row.runs,
        wickets: row.wickets,
        extras: row.extras,
        lastBallBy: row.last_ball_by,
        lastBallTo: row.last_ball_to,
        lastBallResult: row.last_ball_result,
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

  // Add scoring event
  async addScoringEvent(sessionId: string, input: ScoringEventCreateInput, userId: string): Promise<ScoringEvent> {
    const client = await pool.connect();
    
    try {
      const eventId = generateId();

      const result = await client.query(
        `INSERT INTO scoring_events (id, session_id, match_id, over_number, ball_number, 
                                      event_type, event_outcome, runs_scored, is_wicket, 
                                      is_extras, extras_type, extras_runs, bowler_id, 
                                      batter_id, fielder_id, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING id, session_id, match_id, over_number, ball_number, event_type, event_outcome, 
                   runs_scored, is_wicket, is_extras, extras_type, extras_runs, bowler_id, 
                   batter_id, fielder_id, description, created_at, created_by`,
        [eventId, sessionId, input.matchId, input.overNumber, input.ballNumber, 
         input.eventType, input.eventOutcome, input.runsScored || 0, input.isWicket || false,
         input.isExtras || false, input.extrasType, input.extrasRuns || 0, input.bowlerId, 
         input.batterId, input.fielderId, input.description, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        sessionId: row.session_id,
        matchId: row.match_id,
        overNumber: row.over_number,
        ballNumber: row.ball_number,
        eventType: row.event_type,
        eventOutcome: row.event_outcome,
        runsScored: row.runs_scored,
        isWicket: row.is_wicket,
        isExtras: row.is_extras,
        extrasType: row.extras_type,
        extrasRuns: row.extras_runs,
        bowlerId: row.bowler_id,
        batterId: row.batter_id,
        fielderId: row.fielder_id,
        description: row.description,
        createdAt: row.created_at,
        createdBy: row.created_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Ball-by-ball scoring
  async ballByBallScoring(sessionId: string, input: BallByBallScoringInput, userId: string): Promise<ScoringEvent> {
    const client = await pool.connect();
    
    try {
      const eventId = generateId();
      
      // Calculate runs and extras
      let runsScored = input.runs;
      let isExtras = false;
      let extrasType: string | undefined;
      let extrasRuns = 0;

      if (input.isWide) {
        runsScored = input.runs + 1;
        isExtras = true;
        extrasType = 'Wide';
        extrasRuns = 1;
      } else if (input.isNoBall) {
        runsScored = input.runs + 1;
        isExtras = true;
        extrasType = 'NoBall';
        extrasRuns = 1;
      } else if (input.isBye) {
        isExtras = true;
        extrasType = 'Bye';
        extrasRuns = input.runs;
      } else if (input.isLegBye) {
        isExtras = true;
        extrasType = 'LegBye';
        extrasRuns = input.runs;
      }

      const result = await client.query(
        `INSERT INTO scoring_events (id, session_id, match_id, over_number, ball_number, 
                                      event_type, event_outcome, runs_scored, is_wicket, 
                                      is_extras, extras_type, extras_runs, bowler_id, 
                                      batter_id, fielder_id, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING id, session_id, match_id, over_number, ball_number, event_type, event_outcome, 
                   runs_scored, is_wicket, is_extras, extras_type, extras_runs, bowler_id, 
                   batter_id, fielder_id, description, created_at, created_by`,
        [eventId, sessionId, input.matchId, input.overNumber, input.ballNumber, 
         input.isWicket ? 'Wicket' : (isExtras ? 'Ball' : 'Ball'),
         input.isWicket ? 'Wicket' : (runsScored === 0 ? 'Dot' : (runsScored === 4 ? 'Four' : (runsScored === 6 ? 'Six' : 'Runs'))),
         runsScored, input.isWicket, isExtras, extrasType, extrasRuns, input.bowlerId, 
         input.batterId, input.fielderId, input.description, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        sessionId: row.session_id,
        matchId: row.match_id,
        overNumber: row.over_number,
        ballNumber: row.ball_number,
        eventType: row.event_type,
        eventOutcome: row.event_outcome,
        runsScored: row.runs_scored,
        isWicket: row.is_wicket,
        isExtras: row.is_extras,
        extrasType: row.extras_type,
        extrasRuns: row.extras_runs,
        bowlerId: row.bowler_id,
        batterId: row.batter_id,
        fielderId: row.fielder_id,
        description: row.description,
        createdAt: row.created_at,
        createdBy: row.created_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Add scoring note
  async addScoringNote(sessionId: string, input: ScoringNoteInput, userId: string): Promise<ScoringNote> {
    const client = await pool.connect();
    
    try {
      const noteId = generateId();

      const result = await client.query(
        `INSERT INTO scoring_notes (id, session_id, note, note_type, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, session_id, note, note_type, created_by, created_at`,
        [noteId, sessionId, input.note, input.noteType, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        sessionId: row.session_id,
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

  // Get scorecard
  async getScorecard(sessionId: string): Promise<Scorecard | null> {
    const client = await pool.connect();
    
    try {
      // Get session
      const sessionResult = await client.query(
        `SELECT id, match_id, innings_number, runs, wickets, extras, current_over, current_ball
         FROM scoring_sessions WHERE id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        return null;
      }

      const session = sessionResult.rows[0];

      // Get events
      const eventsResult = await client.query(
        `SELECT id, session_id, match_id, over_number, ball_number, event_type, event_outcome, 
                runs_scored, is_wicket, is_extras, extras_type, extras_runs, bowler_id, 
                batter_id, fielder_id, description, created_at, created_by
         FROM scoring_events WHERE session_id = $1 ORDER BY over_number, ball_number`,
        [sessionId]
      );

      const events = eventsResult.rows.map((row: any) => ({
        id: row.id,
        sessionId: row.session_id,
        matchId: row.match_id,
        overNumber: row.over_number,
        ballNumber: row.ball_number,
        eventType: row.event_type,
        eventOutcome: row.event_outcome,
        runsScored: row.runs_scored,
        isWicket: row.is_wicket,
        isExtras: row.is_extras,
        extrasType: row.extras_type,
        extrasRuns: row.extras_runs,
        bowlerId: row.bowler_id,
        batterId: row.batter_id,
        fielderId: row.fielder_id,
        description: row.description,
        createdAt: row.created_at,
        createdBy: row.created_by
      }));

      return {
        sessionId: session.id,
        matchId: session.match_id,
        inningsNumber: session.innings_number,
        teamBattingId: '', // Will be fetched from match
        teamBowlingId: '', // Will be fetched from match
        runs: session.runs,
        wickets: session.wickets,
        overs: session.current_over + (session.current_ball > 0 ? 1 : 0),
        extras: session.extras,
        ballsBowled: session.current_over * 6 + session.current_ball,
        runRate: 0, // Will be calculated
        events
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export const scoringService = new ScoringService();
