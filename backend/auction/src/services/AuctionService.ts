// Services for Auction Service

import { pool } from '../config/database';
import {
  Auction,
  AuctionPlayer,
  AuctionTeam,
  AuctionBid,
  AuctionLog,
  AuctionCreateInput,
  AuctionUpdateInput,
  AuctionPlayerCreateInput,
  AuctionPlayerUpdateInput,
  AuctionTeamCreateInput,
  AuctionTeamUpdateInput,
  AuctionBidCreateInput,
  AuctionLogCreateInput,
  AuctionType,
  AuctionStatus,
  PlayerStatus
} from '../models/Auction';

export class AuctionService {
  async getAllAuctions(params?: {
    status?: AuctionStatus;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; total: number }> {
    const { status, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM auctions
      ${status ? 'WHERE status = $1' : ''}
      ORDER BY start_date DESC
      LIMIT $${status ? 2 : 1}
      OFFSET $${status ? 3 : 2}
    `;

    const values = status ? [status, limit, offset] : [limit, offset];
    const result = await pool.query(query, values);

    const countQuery = `
      SELECT COUNT(*) FROM auctions
      ${status ? 'WHERE status = $1' : ''}
    `;
    const countResult = await pool.query(countQuery, status ? [status] : []);
    const total = parseInt(countResult.rows[0].count);

    return {
      auctions: result.rows,
      total
    };
  }

  async getAuctionById(id: string): Promise<Auction | null> {
    const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createAuction(input: AuctionCreateInput): Promise<Auction> {
    const { name, description, auctionType, startDate, endDate, venueId, organizerId, createdBy } = input;
    const query = `
      INSERT INTO auctions (id, name, description, auction_type, status, start_date, end_date, venue_id, organizer_id, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      name,
      description || null,
      auctionType,
      AuctionStatus.Scheduled,
      startDate,
      endDate || null,
      venueId || null,
      organizerId || null,
      createdBy
    ]);
    return result.rows[0];
  }

  async updateAuction(id: string, input: AuctionUpdateInput): Promise<Auction> {
    const { name, description, status, endDate } = input;
    const query = `
      UPDATE auctions
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          end_date = COALESCE($4, end_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      status || undefined,
      endDate || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteAuction(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM auctions WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async startAuction(id: string): Promise<Auction> {
    const query = `
      UPDATE auctions
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [AuctionStatus.Active, id]);
    return result.rows[0];
  }

  async pauseAuction(id: string): Promise<Auction> {
    const query = `
      UPDATE auctions
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [AuctionStatus.Paused, id]);
    return result.rows[0];
  }

  async endAuction(id: string): Promise<Auction> {
    const query = `
      UPDATE auctions
      SET status = $1, end_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [AuctionStatus.Completed, id]);
    return result.rows[0];
  }

  async logAuctionAction(input: AuctionLogCreateInput): Promise<AuctionLog> {
    const { auctionId, action, entityType, entityId, userId, details } = input;
    const query = `
      INSERT INTO auction_logs (id, auction_id, action, entity_type, entity_id, user_id, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      auctionId,
      action,
      entityType || null,
      entityId || null,
      userId || null,
      details ? JSON.stringify(details) : null
    ]);
    return result.rows[0];
  }
}

export class AuctionPlayerService {
  async getAllPlayersByAuction(auctionId: string, params?: {
    status?: PlayerStatus;
    page?: number;
    limit?: number;
  }): Promise<{ players: AuctionPlayer[]; total: number }> {
    const { status, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM auction_players
      WHERE auction_id = $1
      ${status ? 'AND status = $2' : ''}
      ORDER BY current_price DESC, base_price DESC
      LIMIT $${status ? 3 : 2}
      OFFSET $${status ? 4 : 3}
    `;

    const values = status ? [auctionId, status, limit, offset] : [auctionId, limit, offset];
    const result = await pool.query(query, values);

    const countQuery = `
      SELECT COUNT(*) FROM auction_players
      WHERE auction_id = $1
      ${status ? 'AND status = $2' : ''}
    `;
    const countResult = await pool.query(countQuery, status ? [auctionId, status] : [auctionId]);
    const total = parseInt(countResult.rows[0].count);

    return {
      players: result.rows,
      total
    };
  }

  async getPlayerById(auctionId: string, playerId: string): Promise<AuctionPlayer | null> {
    const result = await pool.query(
      'SELECT * FROM auction_players WHERE auction_id = $1 AND player_id = $2',
      [auctionId, playerId]
    );
    return result.rows[0] || null;
  }

  async addPlayerToAuction(input: AuctionPlayerCreateInput): Promise<AuctionPlayer> {
    const { auctionId, playerId, basePrice } = input;
    const query = `
      INSERT INTO auction_players (id, auction_id, player_id, base_price, current_price, status, bid_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (auction_id, player_id) DO UPDATE SET
        base_price = $4,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      auctionId,
      playerId,
      basePrice,
      0,
      PlayerStatus.Available,
      0
    ]);
    return result.rows[0];
  }

  async updatePlayerStatus(auctionId: string, playerId: string, input: AuctionPlayerUpdateInput): Promise<AuctionPlayer> {
    const { currentPrice, status, teamId, bidCount } = input;
    const query = `
      UPDATE auction_players
      SET current_price = COALESCE($1, current_price),
          status = COALESCE($2, status),
          team_id = COALESCE($3, team_id),
          bid_count = COALESCE($4, bid_count),
          updated_at = CURRENT_TIMESTAMP
      WHERE auction_id = $5 AND player_id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [
      currentPrice || undefined,
      status || undefined,
      teamId || undefined,
      bidCount || undefined,
      auctionId,
      playerId
    ]);
    return result.rows[0];
  }

  async removePlayerFromAuction(auctionId: string, playerId: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM auction_players WHERE auction_id = $1 AND player_id = $2 RETURNING id',
      [auctionId, playerId]
    );
    return result.rows.length > 0;
  }

  async getSoldPlayers(auctionId: string): Promise<AuctionPlayer[]> {
    const result = await pool.query(
      'SELECT * FROM auction_players WHERE auction_id = $1 AND status = $2',
      [auctionId, PlayerStatus.Sold]
    );
    return result.rows;
  }

  async getUnsoldPlayers(auctionId: string): Promise<AuctionPlayer[]> {
    const result = await pool.query(
      'SELECT * FROM auction_players WHERE auction_id = $1 AND status = $2',
      [auctionId, PlayerStatus.Unsold]
    );
    return result.rows;
  }
}

export class AuctionTeamService {
  async getAllTeamsByAuction(auctionId: string): Promise<AuctionTeam[]> {
    const result = await pool.query('SELECT * FROM auction_teams WHERE auction_id = $1', [auctionId]);
    return result.rows;
  }

  async getTeamByAuction(auctionId: string, teamId: string): Promise<AuctionTeam | null> {
    const result = await pool.query(
      'SELECT * FROM auction_teams WHERE auction_id = $1 AND team_id = $2',
      [auctionId, teamId]
    );
    return result.rows[0] || null;
  }

  async registerTeam(input: AuctionTeamCreateInput): Promise<AuctionTeam> {
    const { auctionId, teamId, budget, maxPlayers = 25 } = input;
    const query = `
      INSERT INTO auction_teams (id, auction_id, team_id, budget, spent, players_hired, max_players)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (auction_id, team_id) DO UPDATE SET
        budget = $4,
        max_players = $7,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      auctionId,
      teamId,
      budget,
      0,
      0,
      maxPlayers
    ]);
    return result.rows[0];
  }

  async updateTeamBudget(auctionId: string, teamId: string, input: AuctionTeamUpdateInput): Promise<AuctionTeam> {
    const { budget, spent, playersHired, maxPlayers } = input;
    const query = `
      UPDATE auction_teams
      SET budget = COALESCE($1, budget),
          spent = COALESCE($2, spent),
          players_hired = COALESCE($3, players_hired),
          max_players = COALESCE($4, max_players),
          updated_at = CURRENT_TIMESTAMP
      WHERE auction_id = $5 AND team_id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [
      budget || undefined,
      spent || undefined,
      playersHired || undefined,
      maxPlayers || undefined,
      auctionId,
      teamId
    ]);
    return result.rows[0];
  }

  async removeTeamFromAuction(auctionId: string, teamId: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM auction_teams WHERE auction_id = $1 AND team_id = $2 RETURNING id',
      [auctionId, teamId]
    );
    return result.rows.length > 0;
  }

  async getTeamBudgetRemaining(auctionId: string, teamId: string): Promise<number> {
    const result = await pool.query(
      'SELECT budget - spent AS remaining FROM auction_teams WHERE auction_id = $1 AND team_id = $2',
      [auctionId, teamId]
    );
    return parseFloat(result.rows[0]?.remaining || '0');
  }

  async getTeamPlayersHired(auctionId: string, teamId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM auction_players WHERE auction_id = $1 AND team_id = $2 AND status = $3',
      [auctionId, teamId, PlayerStatus.Sold]
    );
    return parseInt(result.rows[0]?.count || '0');
  }
}

export class AuctionBidService {
  async getAllBidsByPlayer(auctionId: string, playerId: string): Promise<AuctionBid[]> {
    const result = await pool.query(
      'SELECT * FROM auction_bids WHERE auction_id = $1 AND player_id = $2 ORDER BY amount DESC, timestamp ASC',
      [auctionId, playerId]
    );
    return result.rows;
  }

  async getHighestBid(auctionId: string, playerId: string): Promise<AuctionBid | null> {
    const result = await pool.query(
      'SELECT * FROM auction_bids WHERE auction_id = $1 AND player_id = $2 ORDER BY amount DESC LIMIT 1',
      [auctionId, playerId]
    );
    return result.rows[0] || null;
  }

  async placeBid(input: AuctionBidCreateInput): Promise<AuctionBid> {
    const { auctionId, playerId, teamId, bidderId, amount } = input;
    const query = `
      INSERT INTO auction_bids (id, auction_id, player_id, team_id, bidder_id, amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      auctionId,
      playerId,
      teamId,
      bidderId,
      amount
    ]);
    return result.rows[0];
  }

  async updatePlayerPrice(auctionId: string, playerId: string, newPrice: number): Promise<AuctionPlayer> {
    const query = `
      UPDATE auction_players
      SET current_price = $1, bid_count = bid_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE auction_id = $2 AND player_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [newPrice, auctionId, playerId]);
    return result.rows[0];
  }
}
