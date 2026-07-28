// Player Service for Player Service

import { pool } from '../config/database.js';
import { generateId, getCurrentTimestamp } from '@shared/utils';
import { Player, PlayerCreateInput, PlayerUpdateInput, PlayerStats, PlayerStatsUpdateInput, PlayerFitness, PlayerFitnessUpdateInput, PlayerMedical, PlayerMedicalUpdateInput, PlayerContract, PlayerDocument, PlayerMatchHistory } from '../models/index.js';

export class PlayerService {
  // Get all players
  async getAllPlayers(params?: {
    organizationId?: string;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ players: Player[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { organizationId, status, role, page = 1, limit = 10, search } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, external_id, user_id, organization_id, first_name, last_name, full_name, 
               display_name, date_of_birth, age, gender, primary_role, secondary_role, 
               batting_style, bowling_style, fielding_skills, profile_image, bio, status, 
               is_verified, created_at, updated_at, created_by, updated_by
        FROM players
        WHERE 1=1
      `;
      const paramsArray: any[] = [];
      let paramIndex = 1;

      if (organizationId) {
        query += ` AND organization_id = $${paramIndex}`;
        paramsArray.push(organizationId);
        paramIndex++;
      }

      if (status) {
        query += ` AND status = $${paramIndex}`;
        paramsArray.push(status);
        paramIndex++;
      }

      if (role) {
        query += ` AND primary_role = $${paramIndex}`;
        paramsArray.push(role);
        paramIndex++;
      }

      if (search) {
        query += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex})`;
        paramsArray.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM players WHERE 1=1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, paramIndex - 2));

      const players = result.rows.map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        userId: row.user_id,
        organizationId: row.organization_id,
        firstName: row.first_name,
        lastName: row.lastName,
        fullName: row.full_name,
        displayName: row.display_name,
        dateOfBirth: row.date_of_birth,
        age: row.age,
        gender: row.gender,
        primaryRole: row.primary_role,
        secondaryRole: row.secondary_role,
        battingStyle: row.batting_style,
        bowlingStyle: row.bowling_style,
        fieldingSkills: row.fielding_skills,
        profileImage: row.profile_image,
        bio: row.bio,
        status: row.status,
        isVerified: row.is_verified,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));

      return {
        players,
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

  // Get player by ID
  async getPlayerById(id: string): Promise<Player | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, external_id, user_id, organization_id, first_name, last_name, full_name, 
                display_name, date_of_birth, age, gender, primary_role, secondary_role, 
                batting_style, bowling_style, fielding_skills, profile_image, bio, status, 
                is_verified, created_at, updated_at, created_by, updated_by
         FROM players WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        userId: row.user_id,
        organizationId: row.organization_id,
        firstName: row.first_name,
        lastName: row.lastName,
        fullName: row.full_name,
        displayName: row.display_name,
        dateOfBirth: row.date_of_birth,
        age: row.age,
        gender: row.gender,
        primaryRole: row.primary_role,
        secondaryRole: row.secondary_role,
        battingStyle: row.batting_style,
        bowlingStyle: row.bowling_style,
        fieldingSkills: row.fielding_skills,
        profileImage: row.profile_image,
        bio: row.bio,
        status: row.status,
        isVerified: row.is_verified,
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

  // Get player stats
  async getPlayerStats(playerId: string): Promise<PlayerStats | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, player_id, matches_played, runs_scored, balls_faced, batting_average, 
                strike_rate, centuries, half_centuries, wickets_taken, balls_bowled, 
                bowling_average, economy_rate, catches, run_outs, last_updated
         FROM player_stats WHERE player_id = $1`,
        [playerId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        playerId: row.player_id,
        matchesPlayed: row.matches_played,
        runsScored: row.runs_scored,
        ballsFaced: row.balls_faced,
        battingAverage: parseFloat(row.batting_average),
        strikeRate: parseFloat(row.strike_rate),
        centuries: row.centuries,
        halfCenturies: row.half_centuries,
        wicketsTaken: row.wickets_taken,
        ballsBowled: row.balls_bowled,
        bowlingAverage: parseFloat(row.bowling_average),
        economyRate: parseFloat(row.economy_rate),
        catches: row.catches,
        runOuts: row.run_outs,
        lastUpdated: row.last_updated
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get player fitness
  async getPlayerFitness(playerId: string): Promise<PlayerFitness | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, player_id, height_cm, weight_kg, bmi, run_100m_time, run_20m_time, 
                throw_distance_m, bowling_speed_kmh, batting_strength, fitness_score, 
                last_assessment, created_at, updated_at
         FROM player_fitness WHERE player_id = $1`,
        [playerId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        playerId: row.player_id,
        heightCm: row.height_cm,
        weightKg: row.weight_kg ? parseFloat(row.weight_kg) : undefined,
        bmi: row.bmi ? parseFloat(row.bmi) : undefined,
        run100mTime: row.run_100m_time ? parseFloat(row.run_100m_time) : undefined,
        run20mTime: row.run_20m_time ? parseFloat(row.run_20m_time) : undefined,
        throwDistanceM: row.throw_distance_m ? parseFloat(row.throw_distance_m) : undefined,
        bowlingSpeedKmh: row.bowling_speed_kmh ? parseFloat(row.bowling_speed_kmh) : undefined,
        battingStrength: row.batting_strength,
        fitnessScore: row.fitness_score,
        lastAssessment: row.last_assessment,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get player medical
  async getPlayerMedical(playerId: string): Promise<PlayerMedical | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, player_id, blood_type, allergies, medical_conditions, current_medications, 
                injury_history, last_medical_checkup, medical_status, created_at, updated_at
         FROM player_medical WHERE player_id = $1`,
        [playerId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        playerId: row.player_id,
        bloodType: row.blood_type,
        allergies: row.allergies || [],
        medicalConditions: row.medical_conditions || [],
        currentMedications: row.current_medications || [],
        injuryHistory: row.injury_history || [],
        lastMedicalCheckup: row.last_medical_checkup,
        medicalStatus: row.medical_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Create player
  async createPlayer(input: PlayerCreateInput, userId: string): Promise<Player> {
    const client = await pool.connect();
    
    try {
      const playerId = generateId();

      const result = await client.query(
        `INSERT INTO players (id, first_name, last_name, full_name, date_of_birth, gender, 
                              primary_role, secondary_role, batting_style, bowling_style, 
                              fielding_skills, profile_image, bio, organization_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING id, external_id, user_id, organization_id, first_name, last_name, full_name, 
                   display_name, date_of_birth, age, gender, primary_role, secondary_role, 
                   batting_style, bowling_style, fielding_skills, profile_image, bio, status, 
                   is_verified, created_at, updated_at, created_by, updated_by`,
        [playerId, input.firstName, input.lastName, `${input.firstName} ${input.lastName}`, 
         input.dateOfBirth, input.gender, input.primaryRole, input.secondaryRole, 
         input.battingStyle, input.bowlingStyle, JSON.stringify(input.fieldingSkills || []), 
         input.profileImage, input.bio, input.organizationId, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        userId: row.user_id,
        organizationId: row.organization_id,
        firstName: row.first_name,
        lastName: row.lastName,
        fullName: row.full_name,
        displayName: row.display_name,
        dateOfBirth: row.date_of_birth,
        age: row.age,
        gender: row.gender,
        primaryRole: row.primary_role,
        secondaryRole: row.secondary_role,
        battingStyle: row.batting_style,
        bowlingStyle: row.bowling_style,
        fieldingSkills: row.fielding_skills,
        profileImage: row.profile_image,
        bio: row.bio,
        status: row.status,
        isVerified: row.is_verified,
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

  // Update player
  async updatePlayer(id: string, input: PlayerUpdateInput, userId: string): Promise<Player> {
    const client = await pool.connect();
    
    try {
      const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [userId, id];
      let paramIndex = 3;

      if (input.firstName) {
        updates.push(`first_name = $${paramIndex}`);
        values.push(input.firstName);
        paramIndex++;
      }

      if (input.lastName) {
        updates.push(`last_name = $${paramIndex}`);
        values.push(input.lastName);
        paramIndex++;
      }

      if (input.dateOfBirth) {
        updates.push(`date_of_birth = $${paramIndex}`);
        values.push(input.dateOfBirth);
        paramIndex++;
      }

      if (input.gender) {
        updates.push(`gender = $${paramIndex}`);
        values.push(input.gender);
        paramIndex++;
      }

      if (input.primaryRole) {
        updates.push(`primary_role = $${paramIndex}`);
        values.push(input.primaryRole);
        paramIndex++;
      }

      if (input.secondaryRole) {
        updates.push(`secondary_role = $${paramIndex}`);
        values.push(input.secondaryRole);
        paramIndex++;
      }

      if (input.battingStyle) {
        updates.push(`batting_style = $${paramIndex}`);
        values.push(input.battingStyle);
        paramIndex++;
      }

      if (input.bowlingStyle) {
        updates.push(`bowling_style = $${paramIndex}`);
        values.push(input.bowlingStyle);
        paramIndex++;
      }

      if (input.fieldingSkills) {
        updates.push(`fielding_skills = $${paramIndex}`);
        values.push(JSON.stringify(input.fieldingSkills));
        paramIndex++;
      }

      if (input.profileImage) {
        updates.push(`profile_image = $${paramIndex}`);
        values.push(input.profileImage);
        paramIndex++;
      }

      if (input.bio) {
        updates.push(`bio = $${paramIndex}`);
        values.push(input.bio);
        paramIndex++;
      }

      if (input.status) {
        updates.push(`status = $${paramIndex}`);
        values.push(input.status);
        paramIndex++;
      }

      const query = `
        UPDATE players 
        SET ${updates.join(', ')}, updated_by = $1
        WHERE id = $2
        RETURNING id, external_id, user_id, organization_id, first_name, last_name, full_name, 
                  display_name, date_of_birth, age, gender, primary_role, secondary_role, 
                  batting_style, bowling_style, fielding_skills, profile_image, bio, status, 
                  is_verified, created_at, updated_at, created_by, updated_by
      `;

      const result = await client.query(query, values);

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        userId: row.user_id,
        organizationId: row.organization_id,
        firstName: row.first_name,
        lastName: row.lastName,
        fullName: row.full_name,
        displayName: row.display_name,
        dateOfBirth: row.date_of_birth,
        age: row.age,
        gender: row.gender,
        primaryRole: row.primary_role,
        secondaryRole: row.secondary_role,
        battingStyle: row.batting_style,
        bowlingStyle: row.bowling_style,
        fieldingSkills: row.fielding_skills,
        profileImage: row.profile_image,
        bio: row.bio,
        status: row.status,
        isVerified: row.is_verified,
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

  // Update player stats
  async updatePlayerStats(playerId: string, input: PlayerStatsUpdateInput, userId: string): Promise<PlayerStats> {
    const client = await pool.connect();
    
    try {
      // Check if stats exist
      const statsResult = await client.query('SELECT id FROM player_stats WHERE player_id = $1', [playerId]);

      if (statsResult.rows.length === 0) {
        // Create new stats
        const statsId = generateId();
        const result = await client.query(
          `INSERT INTO player_stats (id, player_id, matches_played, runs_scored, balls_faced, 
                                      centuries, half_centuries, wickets_taken, balls_bowled, 
                                      catches, run_outs)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, player_id, matches_played, runs_scored, balls_faced, batting_average, 
                     strike_rate, centuries, half_centuries, wickets_taken, balls_bowled, 
                     bowling_average, economy_rate, catches, run_outs, last_updated`,
          [statsId, playerId, input.matchesPlayed || 0, input.runsScored || 0, input.ballsFaced || 0,
           input.centuries || 0, input.halfCenturies || 0, input.wicketsTaken || 0, input.ballsBowled || 0,
           input.catches || 0, input.runOuts || 0]
        );
        const row = result.rows[0];
        return {
          id: row.id,
          playerId: row.player_id,
          matchesPlayed: row.matches_played,
          runsScored: row.runs_scored,
          ballsFaced: row.balls_faced,
          battingAverage: parseFloat(row.batting_average),
          strikeRate: parseFloat(row.strike_rate),
          centuries: row.centuries,
          halfCenturies: row.half_centuries,
          wicketsTaken: row.wickets_taken,
          ballsBowled: row.balls_bowled,
          bowlingAverage: parseFloat(row.bowling_average),
          economyRate: parseFloat(row.economy_rate),
          catches: row.catches,
          runOuts: row.run_outs,
          lastUpdated: row.last_updated
        };
      } else {
        // Update existing stats
        const updates: string[] = ['last_updated = CURRENT_TIMESTAMP'];
        const values: any[] = [playerId];
        let paramIndex = 2;

        if (input.matchesPlayed !== undefined) {
          updates.push(`matches_played = $${paramIndex}`);
          values.push(input.matchesPlayed);
          paramIndex++;
        }

        if (input.runsScored !== undefined) {
          updates.push(`runs_scored = $${paramIndex}`);
          values.push(input.runsScored);
          paramIndex++;
        }

        if (input.ballsFaced !== undefined) {
          updates.push(`balls_faced = $${paramIndex}`);
          values.push(input.ballsFaced);
          paramIndex++;
        }

        if (input.battingAverage !== undefined) {
          updates.push(`batting_average = $${paramIndex}`);
          values.push(input.battingAverage);
          paramIndex++;
        }

        if (input.strikeRate !== undefined) {
          updates.push(`strike_rate = $${paramIndex}`);
          values.push(input.strikeRate);
          paramIndex++;
        }

        if (input.centuries !== undefined) {
          updates.push(`centuries = $${paramIndex}`);
          values.push(input.centuries);
          paramIndex++;
        }

        if (input.halfCenturies !== undefined) {
          updates.push(`half_centuries = $${paramIndex}`);
          values.push(input.halfCenturies);
          paramIndex++;
        }

        if (input.wicketsTaken !== undefined) {
          updates.push(`wickets_taken = $${paramIndex}`);
          values.push(input.wicketsTaken);
          paramIndex++;
        }

        if (input.ballsBowled !== undefined) {
          updates.push(`balls_bowled = $${paramIndex}`);
          values.push(input.ballsBowled);
          paramIndex++;
        }

        if (input.bowlingAverage !== undefined) {
          updates.push(`bowling_average = $${paramIndex}`);
          values.push(input.bowlingAverage);
          paramIndex++;
        }

        if (input.economyRate !== undefined) {
          updates.push(`economy_rate = $${paramIndex}`);
          values.push(input.economyRate);
          paramIndex++;
        }

        if (input.catches !== undefined) {
          updates.push(`catches = $${paramIndex}`);
          values.push(input.catches);
          paramIndex++;
        }

        if (input.runOuts !== undefined) {
          updates.push(`run_outs = $${paramIndex}`);
          values.push(input.runOuts);
          paramIndex++;
        }

        const query = `
          UPDATE player_stats 
          SET ${updates.join(', ')}
          WHERE player_id = $1
          RETURNING id, player_id, matches_played, runs_scored, balls_faced, batting_average, 
                    strike_rate, centuries, half_centuries, wickets_taken, balls_bowled, 
                    bowling_average, economy_rate, catches, run_outs, last_updated
        `;

        const result = await client.query(query, values);
        const row = result.rows[0];

        return {
          id: row.id,
          playerId: row.player_id,
          matchesPlayed: row.matches_played,
          runsScored: row.runs_scored,
          ballsFaced: row.balls_faced,
          battingAverage: parseFloat(row.batting_average),
          strikeRate: parseFloat(row.strike_rate),
          centuries: row.centuries,
          halfCenturies: row.half_centuries,
          wicketsTaken: row.wickets_taken,
          ballsBowled: row.balls_bowled,
          bowlingAverage: parseFloat(row.bowling_average),
          economyRate: parseFloat(row.economy_rate),
          catches: row.catches,
          runOuts: row.run_outs,
          lastUpdated: row.last_updated
        };
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get player match history
  async getPlayerMatchHistory(playerId: string): Promise<PlayerMatchHistory[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, player_id, match_id, team_id, runs_scored, balls_faced, wickets_taken, 
                overs_bowled, catches, run_outs, is_man_of_the_match, created_at
         FROM player_match_history WHERE player_id = $1 ORDER BY created_at DESC`,
        [playerId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        playerId: row.player_id,
        matchId: row.match_id,
        teamId: row.team_id,
        runsScored: row.runs_scored,
        ballsFaced: row.balls_faced,
        wicketsTaken: row.wickets_taken,
        oversBowled: row.overs_bowled,
        catches: row.catches,
        runOuts: row.run_outs,
        isManOfTheMatch: row.is_man_of_the_match,
        createdAt: row.created_at
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export const playerService = new PlayerService();
