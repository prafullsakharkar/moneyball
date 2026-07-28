// Training Service with CRUD operations and training management

import { pool } from '../config/database';
import {
  TrainingSession,
  TrainingSessionPlayer,
  TrainingDrill,
  TrainingSessionDrill,
  PlayerFitness,
  TrainingReport,
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

// Training Session Service
export class TrainingSessionService {
  // Get sessions by team
  async getSessionsByTeam(teamId: string, params?: { status?: SessionStatus; date?: string; limit?: number; offset?: number }): Promise<{ sessions: TrainingSession[]; total: number }> {
    const client = await pool.connect();
    try {
      const { status, date, limit = 10, offset = 0 } = params || {};
      const values: any[] = [teamId];
      let paramIndex = 2;

      const conditions: string[] = ['team_id = $1'];
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }
      if (date) {
        conditions.push(`scheduled_date = $${paramIndex++}`);
        values.push(date);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM training_sessions WHERE ${whereClause}
        ORDER BY scheduled_date DESC, start_time ASC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM training_sessions WHERE ${whereClause}`,
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

  // Get sessions by coach
  async getSessionsByCoach(coachId: string): Promise<TrainingSession[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM training_sessions WHERE coach_id = $1 ORDER BY scheduled_date DESC',
        [coachId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get session by ID
  async getSessionById(id: string): Promise<TrainingSession | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM training_sessions WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create session
  async createSession(input: TrainingSessionCreateInput): Promise<TrainingSession> {
    const client = await pool.connect();
    try {
      const {
        teamId,
        coachId,
        title,
        description,
        sessionType,
        scheduledDate,
        startTime,
        endTime,
        venueId,
        durationMinutes,
        equipment,
        notes
      } = input;

      const result = await client.query(
        `
        INSERT INTO training_sessions (
          id, team_id, coach_id, title, description, session_type,
          scheduled_date, start_time, end_time, venue_id, status,
          duration_minutes, equipment, notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'Scheduled',
          $10, $11, $12
        )
        RETURNING *
        `,
        [
          teamId, coachId, title, description, sessionType, scheduledDate,
          startTime, endTime, venueId, durationMinutes,
          equipment ? JSON.stringify(equipment) : null, notes
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update session
  async updateSession(id: string, input: TrainingSessionUpdateInput): Promise<TrainingSession> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.title) {
        updates.push(`title = $${paramIndex++}`);
        values.push(input.title);
      }
      if (input.description) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.sessionType) {
        updates.push(`session_type = $${paramIndex++}`);
        values.push(input.sessionType);
      }
      if (input.scheduledDate) {
        updates.push(`scheduled_date = $${paramIndex++}`);
        values.push(input.scheduledDate);
      }
      if (input.startTime) {
        updates.push(`start_time = $${paramIndex++}`);
        values.push(input.startTime);
      }
      if (input.endTime) {
        updates.push(`end_time = $${paramIndex++}`);
        values.push(input.endTime);
      }
      if (input.venueId) {
        updates.push(`venue_id = $${paramIndex++}`);
        values.push(input.venueId);
      }
      if (input.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
      }
      if (input.durationMinutes !== undefined) {
        updates.push(`duration_minutes = $${paramIndex++}`);
        values.push(input.durationMinutes);
      }
      if (input.equipment) {
        updates.push(`equipment = $${paramIndex++}`);
        values.push(JSON.stringify(input.equipment));
      }
      if (input.notes) {
        updates.push(`notes = $${paramIndex++}`);
        values.push(input.notes);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM training_sessions WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE training_sessions SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
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
      const result = await client.query('DELETE FROM training_sessions WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Mark session as completed
  async completeSession(id: string): Promise<TrainingSession> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE training_sessions SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Training Session Player Service
export class TrainingSessionPlayerService {
  // Get players by session
  async getPlayersBySession(sessionId: string): Promise<TrainingSessionPlayer[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM training_session_players WHERE session_id = $1',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get player attendance by session
  async getPlayerAttendance(sessionId: string, playerId: string): Promise<TrainingSessionPlayer | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM training_session_players WHERE session_id = $1 AND player_id = $2',
        [sessionId, playerId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create player attendance
  async createPlayerAttendance(input: TrainingSessionPlayerCreateInput): Promise<TrainingSessionPlayer> {
    const client = await pool.connect();
    try {
      const { sessionId, playerId, attendanceStatus = 'NotScheduled', performanceNotes } = input;

      const result = await client.query(
        `
        INSERT INTO training_session_players (
          id, session_id, player_id, attendance_status, performance_notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4
        )
        ON CONFLICT (session_id, player_id) DO UPDATE SET
          attendance_status = EXCLUDED.attendance_status,
          performance_notes = EXCLUDED.performance_notes,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [sessionId, playerId, attendanceStatus, performanceNotes]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update player attendance
  async updatePlayerAttendance(id: string, input: Partial<TrainingSessionPlayer>): Promise<TrainingSessionPlayer> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.attendanceStatus) {
        updates.push(`attendance_status = $${paramIndex++}`);
        values.push(input.attendanceStatus);
      }
      if (input.performanceNotes) {
        updates.push(`performance_notes = $${paramIndex++}`);
        values.push(input.performanceNotes);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM training_session_players WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE training_session_players SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Training Drill Service
export class TrainingDrillService {
  // Get all drills
  async getAllDrills(params?: { drillType?: DrillType; difficultyLevel?: DifficultyLevel }): Promise<TrainingDrill[]> {
    const client = await pool.connect();
    try {
      const { drillType, difficultyLevel } = params || {};
      const conditions: string[] = [];
      const values: any[] = [];

      if (drillType) {
        conditions.push(`drill_type = $${values.length + 1}`);
        values.push(drillType);
      }
      if (difficultyLevel) {
        conditions.push(`difficulty_level = $${values.length + 1}`);
        values.push(difficultyLevel);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const result = await client.query(
        `SELECT * FROM training_drills ${whereClause} ORDER BY name`,
        values
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get drill by ID
  async getDrillById(id: string): Promise<TrainingDrill | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM training_drills WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create drill
  async createDrill(input: TrainingDrillCreateInput): Promise<TrainingDrill> {
    const client = await pool.connect();
    try {
      const {
        name,
        description,
        drillType,
        difficultyLevel,
        durationMinutes,
        equipmentRequired,
        objectives,
        instructions
      } = input;

      const result = await client.query(
        `
        INSERT INTO training_drills (
          id, name, description, drill_type, difficulty_level,
          duration_minutes, equipment_required, objectives, instructions
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING *
        `,
        [
          name, description, drillType, difficultyLevel, durationMinutes,
          equipmentRequired.length > 0 ? JSON.stringify(equipmentRequired) : null,
          objectives.length > 0 ? JSON.stringify(objectives) : null, instructions
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update drill
  async updateDrill(id: string, input: TrainingDrillUpdateInput): Promise<TrainingDrill> {
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
      if (input.drillType) {
        updates.push(`drill_type = $${paramIndex++}`);
        values.push(input.drillType);
      }
      if (input.difficultyLevel) {
        updates.push(`difficulty_level = $${paramIndex++}`);
        values.push(input.difficultyLevel);
      }
      if (input.durationMinutes !== undefined) {
        updates.push(`duration_minutes = $${paramIndex++}`);
        values.push(input.durationMinutes);
      }
      if (input.equipmentRequired) {
        updates.push(`equipment_required = $${paramIndex++}`);
        values.push(JSON.stringify(input.equipmentRequired));
      }
      if (input.objectives) {
        updates.push(`objectives = $${paramIndex++}`);
        values.push(JSON.stringify(input.objectives));
      }
      if (input.instructions) {
        updates.push(`instructions = $${paramIndex++}`);
        values.push(input.instructions);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM training_drills WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE training_drills SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete drill
  async deleteDrill(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM training_drills WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Training Session Drill Service
export class TrainingSessionDrillService {
  // Get drills by session
  async getDrillsBySession(sessionId: string): Promise<TrainingSessionDrill[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM training_session_drills WHERE session_id = $1 ORDER BY order_number',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create session drill
  async createSessionDrill(input: TrainingSessionDrillCreateInput): Promise<TrainingSessionDrill> {
    const client = await pool.connect();
    try {
      const { sessionId, drillId, orderNumber, durationMinutes, notes } = input;

      const result = await client.query(
        `
        INSERT INTO training_session_drills (
          id, session_id, drill_id, order_number, duration_minutes, notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5
        )
        RETURNING *
        `,
        [sessionId, drillId, orderNumber, durationMinutes, notes]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete session drill
  async deleteSessionDrill(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM training_session_drills WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Player Fitness Service
export class PlayerFitnessService {
  // Get fitness by player
  async getFitnessByPlayer(playerId: string, params?: { limit?: number; offset?: number }): Promise<{ fitness: PlayerFitness[]; total: number }> {
    const client = await pool.connect();
    try {
      const { limit = 10, offset = 0 } = params || {};
      const result = await client.query(
        `
        SELECT * FROM player_fitness WHERE player_id = $1
        ORDER BY date DESC
        LIMIT $2 OFFSET $3
        `,
        [playerId, limit, offset]
      );

      const countResult = await client.query(
        'SELECT COUNT(*) FROM player_fitness WHERE player_id = $1',
        [playerId]
      );

      return {
        fitness: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get fitness by type
  async getFitnessByType(playerId: string, fitnessType: FitnessType): Promise<PlayerFitness[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_fitness WHERE player_id = $1 AND fitness_type = $2 ORDER BY date DESC',
        [playerId, fitnessType]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create fitness record
  async createFitness(input: PlayerFitnessCreateInput): Promise<PlayerFitness> {
    const client = await pool.connect();
    try {
      const { playerId, sessionId, date, fitnessType, value, unit, notes } = input;

      const result = await client.query(
        `
        INSERT INTO player_fitness (
          id, player_id, session_id, date, fitness_type, value, unit, notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING *
        `,
        [playerId, sessionId, date, fitnessType, value, unit, notes]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update fitness record
  async updateFitness(id: string, input: Partial<PlayerFitness>): Promise<PlayerFitness> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.value !== undefined) {
        updates.push(`value = $${paramIndex++}`);
        values.push(input.value);
      }
      if (input.notes) {
        updates.push(`notes = $${paramIndex++}`);
        values.push(input.notes);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM player_fitness WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE player_fitness SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Training Report Service
export class TrainingReportService {
  // Get reports by session
  async getReportsBySession(sessionId: string): Promise<TrainingReport[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM training_reports WHERE session_id = $1 ORDER BY generated_at DESC',
        [sessionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create report
  async createReport(input: TrainingReportCreateInput): Promise<TrainingReport> {
    const client = await pool.connect();
    try {
      const { sessionId, reportType, data } = input;

      const result = await client.query(
        `
        INSERT INTO training_reports (
          id, session_id, report_type, data
        ) VALUES (
          gen_random_uuid(), $1, $2, $3
        )
        RETURNING *
        `,
        [sessionId, reportType, JSON.stringify(data)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Generate attendance report
  async generateAttendanceReport(sessionId: string): Promise<TrainingReport> {
    const client = await pool.connect();
    try {
      // Get session players attendance
      const playersResult = await client.query(
        `
        SELECT 
          p.name as player_name,
          tsp.attendance_status,
          tsp.performance_notes
        FROM training_session_players tsp
        JOIN players p ON tsp.player_id = p.id
        WHERE tsp.session_id = $1
        `,
        [sessionId]
      );

      // Calculate attendance statistics
      const stats = {
        totalPlayers: 0,
        attended: 0,
        absent: 0,
        late: 0,
        injured: 0,
        excused: 0
      };

      for (const row of playersResult.rows) {
        stats.totalPlayers++;
        switch (row.attendance_status) {
          case 'Attended':
            stats.attended++;
            break;
          case 'Absent':
            stats.absent++;
            break;
          case 'Late':
            stats.late++;
            break;
          case 'Injured':
            stats.injured++;
            break;
          case 'Excused':
            stats.excused++;
            break;
        }
      }

      const reportData = {
        players: playersResult.rows,
        statistics: stats,
        generated_at: new Date().toISOString()
      };

      const result = await client.query(
        `
        INSERT INTO training_reports (
          id, session_id, report_type, data
        ) VALUES (
          gen_random_uuid(), $1, 'Attendance', $2
        )
        RETURNING *
        `,
        [sessionId, JSON.stringify(reportData)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Generate performance report
  async generatePerformanceReport(sessionId: string): Promise<TrainingReport> {
    const client = await pool.connect();
    try {
      // Get session players with performance notes
      const playersResult = await client.query(
        `
        SELECT 
          p.name as player_name,
          tsp.attendance_status,
          tsp.performance_notes,
          tsp.updated_at
        FROM training_session_players tsp
        JOIN players p ON tsp.player_id = p.id
        WHERE tsp.session_id = $1
        `,
        [sessionId]
      );

      const reportData = {
        players: playersResult.rows,
        generated_at: new Date().toISOString()
      };

      const result = await client.query(
        `
        INSERT INTO training_reports (
          id, session_id, report_type, data
        ) VALUES (
          gen_random_uuid(), $1, 'Performance', $2
        )
        RETURNING *
        `,
        [sessionId, JSON.stringify(reportData)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Export all services
export const trainingSessionService = new TrainingSessionService();
export const trainingSessionPlayerService = new TrainingSessionPlayerService();
export const trainingDrillService = new TrainingDrillService();
export const trainingSessionDrillService = new TrainingSessionDrillService();
export const playerFitnessService = new PlayerFitnessService();
export const trainingReportService = new TrainingReportService();
