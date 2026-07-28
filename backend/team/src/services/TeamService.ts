// Team Service for Team Service

import { pool } from '../config/database.js';
import { generateId, getCurrentTimestamp } from '@shared/utils';
import { Team, TeamCreateInput, TeamUpdateInput, TeamRoster, TeamRosterInput, TeamCaptain, TeamCoach, TeamStats, TeamStatsUpdateInput } from '../models/index.js';

export class TeamService {
  // Get all teams
  async getAllTeams(params?: {
    organizationId?: string;
    status?: string;
    format?: string;
    type?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ teams: Team[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { organizationId, status, format, type, page = 1, limit = 10, search } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, external_id, organization_id, name, short_name, logo, colors, format, 
               team_type, team_category, gender, age_group, status, description, website, 
               social_media, created_at, updated_at, created_by, updated_by
        FROM teams
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

      if (format) {
        query += ` AND format = $${paramIndex}`;
        paramsArray.push(format);
        paramIndex++;
      }

      if (type) {
        query += ` AND team_type = $${paramIndex}`;
        paramsArray.push(type);
        paramIndex++;
      }

      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR short_name ILIKE $${paramIndex})`;
        paramsArray.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM teams WHERE 1=1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, paramIndex - 2));

      const teams = result.rows.map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        colors: row.colors,
        format: row.format,
        teamType: row.team_type,
        teamCategory: row.team_category,
        gender: row.gender,
        ageGroup: row.age_group,
        status: row.status,
        description: row.description,
        website: row.website,
        socialMedia: row.social_media,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));

      return {
        teams,
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

  // Get team by ID
  async getTeamById(id: string): Promise<Team | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, external_id, organization_id, name, short_name, logo, colors, format, 
                team_type, team_category, gender, age_group, status, description, website, 
                social_media, created_at, updated_at, created_by, updated_by
         FROM teams WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        colors: row.colors,
        format: row.format,
        teamType: row.team_type,
        teamCategory: row.team_category,
        gender: row.gender,
        ageGroup: row.age_group,
        status: row.status,
        description: row.description,
        website: row.website,
        socialMedia: row.social_media,
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

  // Get team roster
  async getTeamRoster(teamId: string): Promise<TeamRoster[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, team_id, player_id, role, jersey_number, status, joined_date, left_date, 
                created_at, updated_at
         FROM team_rosters WHERE team_id = $1 ORDER BY role, jersey_number`,
        [teamId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        teamId: row.team_id,
        playerId: row.player_id,
        role: row.role,
        jerseyNumber: row.jersey_number,
        status: row.status,
        joinedDate: row.joined_date,
        leftDate: row.left_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get team captain
  async getTeamCaptain(teamId: string): Promise<TeamCaptain | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, team_id, player_id, appointed_date, ended_date, created_at
         FROM team_captains WHERE team_id = $1 AND ended_date IS NULL`,
        [teamId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        teamId: row.team_id,
        playerId: row.player_id,
        appointedDate: row.appointed_date,
        endedDate: row.ended_date,
        createdAt: row.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get team coach
  async getTeamCoach(teamId: string): Promise<TeamCoach | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, team_id, coach_id, role, started_date, ended_date, created_at
         FROM team_coaches WHERE team_id = $1 AND ended_date IS NULL`,
        [teamId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        teamId: row.team_id,
        coachId: row.coach_id,
        role: row.role,
        startedDate: row.started_date,
        endedDate: row.ended_date,
        createdAt: row.created_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get team stats
  async getTeamStats(teamId: string): Promise<TeamStats | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, team_id, matches_played, matches_won, matches_lost, matches_tied, 
                matches_no_result, win_percentage, runs_scored, wickets_taken, 
                average_run_rate, average_opposition_run_rate, last_updated
         FROM team_stats WHERE team_id = $1`,
        [teamId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        teamId: row.team_id,
        matchesPlayed: row.matches_played,
        matchesWon: row.matches_won,
        matchesLost: row.matches_lost,
        matchesTied: row.matches_tied,
        matchesNoResult: row.matches_no_result,
        winPercentage: parseFloat(row.win_percentage),
        runsScored: row.runs_scored,
        wicketsTaken: row.wickets_taken,
        averageRunRate: parseFloat(row.average_run_rate),
        averageOppositionRunRate: parseFloat(row.average_opposition_run_rate),
        lastUpdated: row.last_updated
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Create team
  async createTeam(input: TeamCreateInput, userId: string): Promise<Team> {
    const client = await pool.connect();
    
    try {
      const teamId = generateId();

      const result = await client.query(
        `INSERT INTO teams (id, name, short_name, logo, colors, format, team_type, team_category, 
                            gender, age_group, description, website, social_media, organization_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING id, external_id, organization_id, name, short_name, logo, colors, format, 
                   team_type, team_category, gender, age_group, status, description, website, 
                   social_media, created_at, updated_at, created_by, updated_by`,
        [teamId, input.name, input.shortName, input.logo, JSON.stringify(input.colors), 
         input.format, input.teamType, input.teamCategory, input.gender, input.ageGroup, 
         input.description, input.website, JSON.stringify(input.socialMedia || {}), 
         input.organizationId, userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        colors: row.colors,
        format: row.format,
        teamType: row.team_type,
        teamCategory: row.team_category,
        gender: row.gender,
        ageGroup: row.age_group,
        status: row.status,
        description: row.description,
        website: row.website,
        socialMedia: row.social_media,
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

  // Update team
  async updateTeam(id: string, input: TeamUpdateInput, userId: string): Promise<Team> {
    const client = await pool.connect();
    
    try {
      const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [userId, id];
      let paramIndex = 3;

      if (input.name) {
        updates.push(`name = $${paramIndex}`);
        values.push(input.name);
        paramIndex++;
      }

      if (input.shortName) {
        updates.push(`short_name = $${paramIndex}`);
        values.push(input.shortName);
        paramIndex++;
      }

      if (input.logo) {
        updates.push(`logo = $${paramIndex}`);
        values.push(input.logo);
        paramIndex++;
      }

      if (input.colors) {
        updates.push(`colors = $${paramIndex}`);
        values.push(JSON.stringify(input.colors));
        paramIndex++;
      }

      if (input.description) {
        updates.push(`description = $${paramIndex}`);
        values.push(input.description);
        paramIndex++;
      }

      if (input.website) {
        updates.push(`website = $${paramIndex}`);
        values.push(input.website);
        paramIndex++;
      }

      if (input.socialMedia) {
        updates.push(`social_media = $${paramIndex}`);
        values.push(JSON.stringify(input.socialMedia));
        paramIndex++;
      }

      if (input.status) {
        updates.push(`status = $${paramIndex}`);
        values.push(input.status);
        paramIndex++;
      }

      const query = `
        UPDATE teams 
        SET ${updates.join(', ')}, updated_by = $1
        WHERE id = $2
        RETURNING id, external_id, organization_id, name, short_name, logo, colors, format, 
                  team_type, team_category, gender, age_group, status, description, website, 
                  social_media, created_at, updated_at, created_by, updated_by
      `;

      const result = await client.query(query, values);

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        colors: row.colors,
        format: row.format,
        teamType: row.team_type,
        teamCategory: row.team_category,
        gender: row.gender,
        ageGroup: row.age_group,
        status: row.status,
        description: row.description,
        website: row.website,
        socialMedia: row.social_media,
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

  // Add player to team roster
  async addPlayerToRoster(teamId: string, input: TeamRosterInput, userId: string): Promise<TeamRoster> {
    const client = await pool.connect();
    
    try {
      const rosterId = generateId();

      const result = await client.query(
        `INSERT INTO team_rosters (id, team_id, player_id, role, jersey_number, status, joined_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, team_id, player_id, role, jersey_number, status, joined_date, left_date, 
                   created_at, updated_at`,
        [rosterId, teamId, input.playerId, input.role, input.jerseyNumber, input.status || 'Active', 
         input.joinedDate || getCurrentTimestamp()]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        teamId: row.team_id,
        playerId: row.player_id,
        role: row.role,
        jerseyNumber: row.jersey_number,
        status: row.status,
        joinedDate: row.joined_date,
        leftDate: row.left_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Remove player from team roster
  async removePlayerFromRoster(teamId: string, playerId: string, userId: string): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query(
        `UPDATE team_rosters 
         SET left_date = $1, status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE team_id = $3 AND player_id = $4`,
        [getCurrentTimestamp(), 'Inactive', teamId, playerId]
      );
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Update team stats
  async updateTeamStats(teamId: string, input: TeamStatsUpdateInput, userId: string): Promise<TeamStats> {
    const client = await pool.connect();
    
    try {
      const statsResult = await client.query('SELECT id FROM team_stats WHERE team_id = $1', [teamId]);

      if (statsResult.rows.length === 0) {
        const statsId = generateId();
        const result = await client.query(
          `INSERT INTO team_stats (id, team_id, matches_played, matches_won, matches_lost, 
                                    matches_tied, matches_no_result, runs_scored, wickets_taken)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, team_id, matches_played, matches_won, matches_lost, matches_tied, 
                     matches_no_result, win_percentage, runs_scored, wickets_taken, 
                     average_run_rate, average_opposition_run_rate, last_updated`,
          [statsId, teamId, input.matchesPlayed || 0, input.matchesWon || 0, input.matchesLost || 0,
           input.matchesTied || 0, input.matchesNoResult || 0, input.runsScored || 0, input.wicketsTaken || 0]
        );
        const row = result.rows[0];
        return {
          id: row.id,
          teamId: row.team_id,
          matchesPlayed: row.matches_played,
          matchesWon: row.matches_won,
          matchesLost: row.matches_lost,
          matchesTied: row.matches_tied,
          matchesNoResult: row.matches_no_result,
          winPercentage: parseFloat(row.win_percentage),
          runsScored: row.runs_scored,
          wicketsTaken: row.wickets_taken,
          averageRunRate: parseFloat(row.average_run_rate),
          averageOppositionRunRate: parseFloat(row.average_opposition_run_rate),
          lastUpdated: row.last_updated
        };
      } else {
        const updates: string[] = ['last_updated = CURRENT_TIMESTAMP'];
        const values: any[] = [teamId];
        let paramIndex = 2;

        if (input.matchesPlayed !== undefined) {
          updates.push(`matches_played = $${paramIndex}`);
          values.push(input.matchesPlayed);
          paramIndex++;
        }

        if (input.matchesWon !== undefined) {
          updates.push(`matches_won = $${paramIndex}`);
          values.push(input.matchesWon);
          paramIndex++;
        }

        if (input.matchesLost !== undefined) {
          updates.push(`matches_lost = $${paramIndex}`);
          values.push(input.matchesLost);
          paramIndex++;
        }

        if (input.matchesTied !== undefined) {
          updates.push(`matches_tied = $${paramIndex}`);
          values.push(input.matchesTied);
          paramIndex++;
        }

        if (input.matchesNoResult !== undefined) {
          updates.push(`matches_no_result = $${paramIndex}`);
          values.push(input.matchesNoResult);
          paramIndex++;
        }

        if (input.runsScored !== undefined) {
          updates.push(`runs_scored = $${paramIndex}`);
          values.push(input.runsScored);
          paramIndex++;
        }

        if (input.wicketsTaken !== undefined) {
          updates.push(`wickets_taken = $${paramIndex}`);
          values.push(input.wicketsTaken);
          paramIndex++;
        }

        const query = `
          UPDATE team_stats 
          SET ${updates.join(', ')}
          WHERE team_id = $1
          RETURNING id, team_id, matches_played, matches_won, matches_lost, matches_tied, 
                    matches_no_result, win_percentage, runs_scored, wickets_taken, 
                    average_run_rate, average_opposition_run_rate, last_updated
        `;

        const result = await client.query(query, values);
        const row = result.rows[0];

        return {
          id: row.id,
          teamId: row.team_id,
          matchesPlayed: row.matches_played,
          matchesWon: row.matches_won,
          matchesLost: row.matches_lost,
          matchesTied: row.matches_tied,
          matchesNoResult: row.matches_no_result,
          winPercentage: parseFloat(row.win_percentage),
          runsScored: row.runs_scored,
          wicketsTaken: row.wickets_taken,
          averageRunRate: parseFloat(row.average_run_rate),
          averageOppositionRunRate: parseFloat(row.average_opposition_run_rate),
          lastUpdated: row.last_updated
        };
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export const teamService = new TeamService();
