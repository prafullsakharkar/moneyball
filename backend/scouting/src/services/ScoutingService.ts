// Scouting Service with CRUD operations and scouting management

import { pool } from '../config/database';
import {
  ScoutingReport,
  ScoutingReportSection,
  ScoutingSession,
  ScoutingSessionPlayer,
  PlayerRanking,
  ScoutingNote,
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

// Scouting Report Service
export class ScoutingReportService {
  // Get reports by player
  async getReportsByPlayer(playerId: string, params?: { status?: ReportStatus; limit?: number; offset?: number }): Promise<{ reports: ScoutingReport[]; total: number }> {
    const client = await pool.connect();
    try {
      const { status, limit = 10, offset = 0 } = params || {};
      const values: any[] = [playerId];
      let paramIndex = 2;

      const conditions: string[] = ['player_id = $1'];
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM scouting_reports WHERE ${whereClause}
        ORDER BY report_date DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM scouting_reports WHERE ${whereClause}`,
        values
      );

      return {
        reports: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get reports by scout
  async getReportsByScout(scoutId: string): Promise<ScoutingReport[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM scouting_reports WHERE scout_id = $1 ORDER BY report_date DESC',
        [scoutId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get report by ID
  async getReportById(id: string): Promise<ScoutingReport | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM scouting_reports WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create report
  async createReport(input: ScoutingReportCreateInput): Promise<ScoutingReport> {
    const client = await pool.connect();
    try {
      const {
        playerId,
        scoutId,
        reportDate,
        reportType,
        summary,
        overallRating,
        strengths,
        weaknesses,
        recommendations,
        metadata
      } = input;

      const result = await client.query(
        `
        INSERT INTO scouting_reports (
          id, player_id, scout_id, report_date, report_type, status,
          summary, overall_rating, strengths, weaknesses, recommendations, metadata
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'Draft', $5, $6, $7, $8, $9, $10
        )
        RETURNING *
        `,
        [
          playerId, scoutId, reportDate, reportType, summary, overallRating,
          strengths ? JSON.stringify(strengths) : null,
          weaknesses ? JSON.stringify(weaknesses) : null,
          recommendations ? JSON.stringify(recommendations) : null,
          metadata ? JSON.stringify(metadata) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update report
  async updateReport(id: string, input: ScoutingReportUpdateInput): Promise<ScoutingReport> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.reportType) {
        updates.push(`report_type = $${paramIndex++}`);
        values.push(input.reportType);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }
      if (input.summary) {
        updates.push(`summary = $${paramIndex++}`);
        values.push(input.summary);
      }
      if (input.overallRating !== undefined) {
        updates.push(`overall_rating = $${paramIndex++}`);
        values.push(input.overallRating);
      }
      if (input.strengths) {
        updates.push(`strengths = $${paramIndex++}`);
        values.push(JSON.stringify(input.strengths));
      }
      if (input.weaknesses) {
        updates.push(`weaknesses = $${paramIndex++}`);
        values.push(JSON.stringify(input.weaknesses));
      }
      if (input.recommendations) {
        updates.push(`recommendations = $${paramIndex++}`);
        values.push(JSON.stringify(input.recommendations));
      }
      if (input.metadata) {
        updates.push(`metadata = $${paramIndex++}`);
        values.push(JSON.stringify(input.metadata));
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM scouting_reports WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE scouting_reports SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete report
  async deleteReport(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM scouting_reports WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Submit report
  async submitReport(id: string): Promise<ScoutingReport> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE scouting_reports SET status = 'InReview', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Complete report
  async completeReport(id: string): Promise<ScoutingReport> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE scouting_reports SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Scouting Report Section Service
export class ScoutingReportSectionService {
  // Get sections by report
  async getSectionsByReport(reportId: string): Promise<ScoutingReportSection[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM scouting_report_sections WHERE report_id = $1 ORDER BY created_at',
        [reportId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create section
  async createSection(input: ScoutingReportSectionCreateInput): Promise<ScoutingReportSection> {
    const client = await pool.connect();
    try {
      const { reportId, sectionName, content, rating } = input;

      const result = await client.query(
        `
        INSERT INTO scouting_report_sections (
          id, report_id, section_name, content, rating
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4
        )
        RETURNING *
        `,
        [reportId, sectionName, content, rating]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete section
  async deleteSection(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM scouting_report_sections WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Scouting Session Service
export class ScoutingSessionService {
  // Get all sessions
  async getAllSessions(params?: { status?: SessionStatus; limit?: number; offset?: number }): Promise<{ sessions: ScoutingSession[]; total: number }> {
    const client = await pool.connect();
    try {
      const { status, limit = 10, offset = 0 } = params || {};
      const values: any[] = [];
      let paramIndex = 1;

      const conditions: string[] = [];
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM scouting_sessions ${whereClause ? 'WHERE ' + whereClause : ''}
        ORDER BY start_date DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM scouting_sessions ${whereClause ? 'WHERE ' + whereClause : ''}`,
        values
      );

      return {
        sessions: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get session by ID
  async getSessionById(id: string): Promise<ScoutingSession | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM scouting_sessions WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create session
  async createSession(input: ScoutingSessionCreateInput): Promise<ScoutingSession> {
    const client = await pool.connect();
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        location,
        status = 'Planned'
      } = input;

      const result = await client.query(
        `
        INSERT INTO scouting_sessions (
          id, name, description, start_date, end_date, location, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6
        )
        RETURNING *
        `,
        [name, description, startDate, endDate, location, status]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update session
  async updateSession(id: string, input: ScoutingSessionUpdateInput): Promise<ScoutingSession> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.description) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.startDate) {
        updates.push(`start_date = $${paramIndex++}`);
        values.push(input.startDate);
      }
      if (input.endDate) {
        updates.push(`end_date = $${paramIndex++}`);
        values.push(input.endDate);
      }
      if (input.location) {
        updates.push(`location = $${paramIndex++}`);
        values.push(input.location);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM scouting_sessions WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE scouting_sessions SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete session
  async deleteSession(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM scouting_sessions WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Start session
  async startSession(id: string): Promise<ScoutingSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE scouting_sessions SET status = 'Active', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Complete session
  async completeSession(id: string): Promise<ScoutingSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE scouting_sessions SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Scouting Session Player Service
export class ScoutingSessionPlayerService {
  // Get players by session
  async getPlayersBySession(sessionId: string): Promise<ScoutingSessionPlayer[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM scouting_session_players WHERE session_id = $1',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get player by session
  async getPlayerBySession(sessionId: string, playerId: string): Promise<ScoutingSessionPlayer | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM scouting_session_players WHERE session_id = $1 AND player_id = $2',
        [sessionId, playerId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create session player
  async createSessionPlayer(input: ScoutingSessionPlayerCreateInput): Promise<ScoutingSessionPlayer> {
    const client = await pool.connect();
    try {
      const { sessionId, playerId, status = 'Pending' } = input;

      const result = await client.query(
        `
        INSERT INTO scouting_session_players (
          id, session_id, player_id, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3
        )
        ON CONFLICT (session_id, player_id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [sessionId, playerId, status]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update session player
  async updateSessionPlayer(id: string, input: Partial<ScoutingSessionPlayer>): Promise<ScoutingSessionPlayer> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM scouting_session_players WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE scouting_session_players SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Complete player assessment
  async completePlayerAssessment(id: string): Promise<ScoutingSessionPlayer> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE scouting_session_players SET status = 'Completed', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Player Ranking Service
export class PlayerRankingService {
  // Get rankings by player
  async getRankingsByPlayer(playerId: string): Promise<PlayerRanking[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_rankings WHERE player_id = $1',
        [playerId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get rankings by format
  async getRankingsByFormat(format: CricketFormat, params?: { limit?: number; offset?: number }): Promise<{ rankings: PlayerRanking[]; total: number }> {
    const client = await pool.connect();
    try {
      const { limit = 10, offset = 0 } = params || {};
      const result = await client.query(
        `
        SELECT * FROM player_rankings WHERE format = $1
        ORDER BY ranking DESC
        LIMIT $2 OFFSET $3
        `,
        [format, limit, offset]
      );

      const countResult = await client.query(
        'SELECT COUNT(*) FROM player_rankings WHERE format = $1',
        [format]
      );

      return {
        rankings: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get ranking by player and format
  async getRankingByPlayerAndFormat(playerId: string, format: CricketFormat): Promise<PlayerRanking | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_rankings WHERE player_id = $1 AND format = $2',
        [playerId, format]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create ranking
  async createRanking(input: PlayerRankingCreateInput): Promise<PlayerRanking> {
    const client = await pool.connect();
    try {
      const {
        playerId,
        format,
        position,
        ranking,
        totalPlayers,
        percentile,
        evaluationDate,
        criteria
      } = input;

      const result = await client.query(
        `
        INSERT INTO player_rankings (
          id, player_id, format, position, ranking, total_players, percentile, evaluation_date, criteria
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
        )
        ON CONFLICT (player_id, format, position) DO UPDATE SET
          ranking = EXCLUDED.ranking,
          total_players = EXCLUDED.total_players,
          percentile = EXCLUDED.percentile,
          evaluation_date = EXCLUDED.evaluation_date,
          criteria = EXCLUDED.criteria,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [
          playerId, format, position, ranking, totalPlayers,
          percentile, evaluationDate, criteria ? JSON.stringify(criteria) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update ranking
  async updateRanking(id: string, input: Partial<PlayerRanking>): Promise<PlayerRanking> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.ranking !== undefined) {
        updates.push(`ranking = $${paramIndex++}`);
        values.push(input.ranking);
      }
      if (input.totalPlayers !== undefined) {
        updates.push(`total_players = $${paramIndex++}`);
        values.push(input.totalPlayers);
      }
      if (input.percentile !== undefined) {
        updates.push(`percentile = $${paramIndex++}`);
        values.push(input.percentile);
      }
      if (input.criteria) {
        updates.push(`criteria = $${paramIndex++}`);
        values.push(JSON.stringify(input.criteria));
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM player_rankings WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE player_rankings SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Scouting Note Service
export class ScoutingNoteService {
  // Get notes by player
  async getNotesByPlayer(playerId: string, params?: { noteType?: NoteType; limit?: number; offset?: number }): Promise<{ notes: ScoutingNote[]; total: number }> {
    const client = await pool.connect();
    try {
      const { noteType, limit = 10, offset = 0 } = params || {};
      const values: any[] = [playerId];
      let paramIndex = 2;

      const conditions: string[] = ['player_id = $1'];
      if (noteType) {
        conditions.push(`note_type = $${paramIndex++}`);
        values.push(noteType);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM scouting_notes WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM scouting_notes WHERE ${whereClause}`,
        values
      );

      return {
        notes: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Create note
  async createNote(input: ScoutingNoteCreateInput): Promise<ScoutingNote> {
    const client = await pool.connect();
    try {
      const { playerId, scoutId, noteType, content, isPublic = false } = input;

      const result = await client.query(
        `
        INSERT INTO scouting_notes (
          id, player_id, scout_id, note_type, content, is_public
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5
        )
        RETURNING *
        `,
        [playerId, scoutId, noteType, content, isPublic]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete note
  async deleteNote(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM scouting_notes WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Export all services
export const scoutingReportService = new ScoutingReportService();
export const scoutingReportSectionService = new ScoutingReportSectionService();
export const scoutingSessionService = new ScoutingSessionService();
export const scoutingSessionPlayerService = new ScoutingSessionPlayerService();
export const playerRankingService = new PlayerRankingService();
export const scoutingNoteService = new ScoutingNoteService();
