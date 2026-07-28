// Analytics Service with CRUD operations and analytics calculations

import { pool } from '../config/database';
import {
  PlayerStats,
  TeamStats,
  MatchAnalytics,
  PlayerPerformance,
  Leaderboard,
  SearchIndex,
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

// Player Analytics Service
export class PlayerAnalyticsService {
  // Get player stats by format
  async getPlayerStats(playerId: string, format: CricketFormat): Promise<PlayerStats | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_stats WHERE player_id = $1 AND format = $2',
        [playerId, format]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get all player stats
  async getAllPlayerStats(playerId: string): Promise<PlayerStats[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_stats WHERE player_id = $1',
        [playerId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create or update player stats
  async upsertPlayerStats(input: PlayerStatsCreateInput): Promise<PlayerStats> {
    const client = await pool.connect();
    try {
      const {
        playerId,
        format,
        matches = 0,
        innings = 0,
        runs = 0,
        highestScore,
        average = 0,
        strikeRate = 0,
        centuries = 0,
        fifties = 0,
        ducks = 0,
        wickets = 0,
        bestBowling,
        economyRate = 0,
        catches = 0,
        stumpings = 0,
        matchesAsCaptain = 0
      } = input;

      const result = await client.query(
        `
        INSERT INTO player_stats (
          id, player_id, format, matches, innings, runs, highest_score, average, strike_rate,
          centuries, fifties, ducks, wickets, best_bowling, economy_rate, catches, stumpings,
          matches_as_captain, last_updated
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP
        )
        ON CONFLICT (player_id, format) DO UPDATE SET
          matches = EXCLUDED.matches,
          innings = EXCLUDED.innings,
          runs = EXCLUDED.runs,
          highest_score = EXCLUDED.highest_score,
          average = EXCLUDED.average,
          strike_rate = EXCLUDED.strike_rate,
          centuries = EXCLUDED.centuries,
          fifties = EXCLUDED.fifties,
          ducks = EXCLUDED.ducks,
          wickets = EXCLUDED.wickets,
          best_bowling = EXCLUDED.best_bowling,
          economy_rate = EXCLUDED.economy_rate,
          catches = EXCLUDED.catches,
          stumpings = EXCLUDED.stumpings,
          matches_as_captain = EXCLUDED.matches_as_captain,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [
          playerId, format, matches, innings, runs, highestScore, average, strikeRate,
          centuries, fifties, ducks, wickets, bestBowling, economyRate, catches, stumpings, matchesAsCaptain
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update player stats
  async updatePlayerStats(id: string, input: PlayerStatsUpdateInput): Promise<PlayerStats> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.matches !== undefined) {
        updates.push(`matches = $${paramIndex++}`);
        values.push(input.matches);
      }
      if (input.innings !== undefined) {
        updates.push(`innings = $${paramIndex++}`);
        values.push(input.innings);
      }
      if (input.runs !== undefined) {
        updates.push(`runs = $${paramIndex++}`);
        values.push(input.runs);
      }
      if (input.highestScore) {
        updates.push(`highest_score = $${paramIndex++}`);
        values.push(input.highestScore);
      }
      if (input.average !== undefined) {
        updates.push(`average = $${paramIndex++}`);
        values.push(input.average);
      }
      if (input.strikeRate !== undefined) {
        updates.push(`strike_rate = $${paramIndex++}`);
        values.push(input.strikeRate);
      }
      if (input.centuries !== undefined) {
        updates.push(`centuries = $${paramIndex++}`);
        values.push(input.centuries);
      }
      if (input.fifties !== undefined) {
        updates.push(`fifties = $${paramIndex++}`);
        values.push(input.fifties);
      }
      if (input.ducks !== undefined) {
        updates.push(`ducks = $${paramIndex++}`);
        values.push(input.ducks);
      }
      if (input.wickets !== undefined) {
        updates.push(`wickets = $${paramIndex++}`);
        values.push(input.wickets);
      }
      if (input.bestBowling) {
        updates.push(`best_bowling = $${paramIndex++}`);
        values.push(input.bestBowling);
      }
      if (input.economyRate !== undefined) {
        updates.push(`economy_rate = $${paramIndex++}`);
        values.push(input.economyRate);
      }
      if (input.catches !== undefined) {
        updates.push(`catches = $${paramIndex++}`);
        values.push(input.catches);
      }
      if (input.stumpings !== undefined) {
        updates.push(`stumpings = $${paramIndex++}`);
        values.push(input.stumpings);
      }
      if (input.matchesAsCaptain !== undefined) {
        updates.push(`matches_as_captain = $${paramIndex++}`);
        values.push(input.matchesAsCaptain);
      }

      updates.push(`last_updated = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM player_stats WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE player_stats SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Calculate career stats from match performances
  async calculateCareerStats(playerId: string): Promise<PlayerStats> {
    const client = await pool.connect();
    try {
      // Get all match performances for this player
      const performancesResult = await client.query(
        `
        SELECT 
          m.format,
          pp.runs_scored,
          pp.balls_faced,
          pp.fours,
          pp.sixes,
          pp.wickets_taken,
          pp.runs_conceded,
          pp.catches,
          pp.stumpings,
          CASE WHEN pp.runs_scored >= 100 THEN 1 ELSE 0 END as century,
          CASE WHEN pp.runs_scored >= 50 AND pp.runs_scored < 100 THEN 1 ELSE 0 END as fifty,
          CASE WHEN pp.runs_scored = 0 THEN 1 ELSE 0 END as duck
        FROM player_performance pp
        JOIN matches m ON pp.match_id = m.id
        WHERE pp.player_id = $1
        `,
        [playerId]
      );

      const stats: any = {
        playerId,
        format: 'All' as CricketFormat,
        matches: 0,
        innings: 0,
        runs: 0,
        highestScore: '0',
        centuries: 0,
        fifties: 0,
        ducks: 0,
        wickets: 0,
        bestBowling: '0/0',
        economyRate: 0,
        catches: 0,
        stumpings: 0,
        matchesAsCaptain: 0
      };

      let totalBallsFaced = 0;
      let totalRunsConceded = 0;
      let totalOversBowled = 0;

      for (const perf of performancesResult.rows) {
        stats.matches++;
        if (perf.runs_scored > 0) {
          stats.innings++;
        }
        stats.runs += perf.runs_scored;
        totalBallsFaced += perf.balls_faced;

        if (perf.runs_scored > parseInt(stats.highestScore || '0')) {
          stats.highestScore = perf.runs_scored.toString();
        }

        stats.centuries += perf.century;
        stats.fifties += perf.fifty;
        stats.ducks += perf.duck;
        stats.wickets += perf.wickets_taken;
        stats.catches += perf.catches;
        stats.stumpings += perf.stumpings;

        totalRunsConceded += perf.runs_conceded;
        // Calculate overs bowled (6 balls = 1 over)
        totalOversBowled += Math.floor(perf.balls_faced / 6);
      }

      // Calculate averages
      if (stats.innings > 0) {
        stats.average = (stats.runs / stats.innings).toFixed(2);
      }
      if (totalBallsFaced > 0) {
        stats.strikeRate = ((stats.runs / totalBallsFaced) * 100).toFixed(2);
      }
      if (totalOversBowled > 0) {
        stats.economyRate = (totalRunsConceded / totalOversBowled).toFixed(2);
      }

      return stats;
    } finally {
      client.release();
    }
  }
}

// Team Analytics Service
export class TeamAnalyticsService {
  // Get team stats by format
  async getTeamStats(teamId: string, format: CricketFormat): Promise<TeamStats | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM team_stats WHERE team_id = $1 AND format = $2',
        [teamId, format]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get all team stats
  async getAllTeamStats(teamId: string): Promise<TeamStats[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM team_stats WHERE team_id = $1',
        [teamId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create or update team stats
  async upsertTeamStats(input: TeamStatsCreateInput): Promise<TeamStats> {
    const client = await pool.connect();
    try {
      const {
        teamId,
        format,
        matches = 0,
        wins = 0,
        losses = 0,
        ties = 0,
        noResults = 0,
        winPercentage = 0,
        homeMatches = 0,
        homeWins = 0,
        awayMatches = 0,
        awayWins = 0
      } = input;

      const result = await client.query(
        `
        INSERT INTO team_stats (
          id, team_id, format, matches, wins, losses, ties, no_results, win_percentage,
          home_matches, home_wins, away_matches, away_wins, last_updated
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP
        )
        ON CONFLICT (team_id, format) DO UPDATE SET
          matches = EXCLUDED.matches,
          wins = EXCLUDED.wins,
          losses = EXCLUDED.losses,
          ties = EXCLUDED.ties,
          no_results = EXCLUDED.no_results,
          win_percentage = EXCLUDED.win_percentage,
          home_matches = EXCLUDED.home_matches,
          home_wins = EXCLUDED.home_wins,
          away_matches = EXCLUDED.away_matches,
          away_wins = EXCLUDED.away_wins,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [
          teamId, format, matches, wins, losses, ties, noResults, winPercentage,
          homeMatches, homeWins, awayMatches, awayWins
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Calculate team stats from match analytics
  async calculateTeamStats(teamId: string): Promise<TeamStats> {
    const client = await pool.connect();
    try {
      // Get all matches involving this team
      const matchesResult = await client.query(
        `
        SELECT 
          m.format,
          ma.result,
          ma.winning_margin,
          CASE WHEN ma.toss_winner_id = $1 THEN 1 ELSE 0 END as toss_won
        FROM match_analytics ma
        JOIN matches m ON ma.match_id = m.id
        WHERE ma.team1_id = $1 OR ma.team2_id = $1
        `,
        [teamId]
      );

      const stats: any = {
        teamId,
        format: 'All' as CricketFormat,
        matches: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        noResults: 0,
        winPercentage: 0,
        homeMatches: 0,
        homeWins: 0,
        awayMatches: 0,
        awayWins: 0
      };

      for (const match of matchesResult.rows) {
        stats.matches++;

        // Determine if team won
        if (match.result && match.result.includes(teamId)) {
          stats.wins++;
        } else if (match.result === 'Tie' || match.result === 'No Result') {
          stats.ties++;
        } else {
          stats.losses++;
        }
      }

      // Calculate win percentage
      if (stats.matches > 0) {
        stats.winPercentage = ((stats.wins / stats.matches) * 100).toFixed(2);
      }

      return stats;
    } finally {
      client.release();
    }
  }
}

// Match Analytics Service
export class MatchAnalyticsService {
  // Get match analytics by match ID
  async getMatchAnalytics(matchId: string): Promise<MatchAnalytics | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM match_analytics WHERE match_id = $1',
        [matchId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create or update match analytics
  async upsertMatchAnalytics(input: MatchAnalyticsCreateInput): Promise<MatchAnalytics> {
    const client = await pool.connect();
    try {
      const {
        matchId,
        team1Id,
        team2Id,
        venueId,
        tossWinnerId,
        tossDecision,
        firstInningsScore,
        secondInningsScore,
        result,
        winningMargin,
        playerOfTheMatchId,
        crowdCount,
        weatherConditions
      } = input;

      const resultRow = await client.query(
        `
        INSERT INTO match_analytics (
          id, match_id, team1_id, team2_id, venue_id, toss_winner_id, toss_decision,
          first_innings_score, second_innings_score, result, winning_margin,
          player_of_the_match, crowd_count, weather_conditions
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        ON CONFLICT (match_id) DO UPDATE SET
          toss_winner_id = EXCLUDED.toss_winner_id,
          toss_decision = EXCLUDED.toss_decision,
          first_innings_score = EXCLUDED.first_innings_score,
          second_innings_score = EXCLUDED.second_innings_score,
          result = EXCLUDED.result,
          winning_margin = EXCLUDED.winning_margin,
          player_of_the_match = EXCLUDED.player_of_the_match,
          crowd_count = EXCLUDED.crowd_count,
          weather_conditions = EXCLUDED.weather_conditions
        RETURNING *
        `,
        [
          matchId, team1Id, team2Id, venueId, tossWinnerId, tossDecision,
          firstInningsScore, secondInningsScore, result, winningMargin,
          playerOfTheMatchId, crowdCount, weatherConditions
        ]
      );
      return resultRow.rows[0];
    } finally {
      client.release();
    }
  }

  // Calculate match analytics from scoring data
  async calculateMatchAnalytics(matchId: string): Promise<MatchAnalytics> {
    const client = await pool.connect();
    try {
      // Get match details
      const matchResult = await client.query(
        'SELECT * FROM matches WHERE id = $1',
        [matchId]
      );
      const match = matchResult.rows[0];

      // Get scoring data
      const scoringResult = await client.query(
        `
        SELECT * FROM scoring_sessions WHERE match_id = $1 ORDER BY innings
        `,
        [matchId]
      );

      const analytics: any = {
        matchId,
        team1Id: match.team1_id,
        team2Id: match.team2_id,
        venueId: match.venue_id,
        tossWinnerId: match.toss_winner_id,
        tossDecision: match.toss_decision,
        firstInningsScore: 0,
        secondInningsScore: 0,
        result: match.result,
        winningMargin: match.winning_margin,
        playerOfTheMatchId: match.player_of_the_match_id,
        crowdCount: match.crowd_count,
        weatherConditions: match.weather_conditions
      };

      // Calculate scores from scoring sessions
      for (const session of scoringResult.rows) {
        if (session.innings === 1) {
          analytics.firstInningsScore = session.total_runs;
        } else if (session.innings === 2) {
          analytics.secondInningsScore = session.total_runs;
        }
      }

      return analytics;
    } finally {
      client.release();
    }
  }
}

// Player Performance Service
export class PlayerPerformanceService {
  // Get player performance by match
  async getPlayerPerformance(playerId: string, matchId: string): Promise<PlayerPerformance | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_performance WHERE player_id = $1 AND match_id = $2',
        [playerId, matchId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get all player performances for a match
  async getMatchPerformances(matchId: string): Promise<PlayerPerformance[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM player_performance WHERE match_id = $1',
        [matchId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Create or update player performance
  async upsertPlayerPerformance(input: PlayerPerformanceCreateInput): Promise<PlayerPerformance> {
    const client = await pool.connect();
    try {
      const {
        playerId,
        matchId,
        runsScored = 0,
        ballsFaced = 0,
        fours = 0,
        sixes = 0,
        wicketsTaken = 0,
        runsConceded = 0,
        catches = 0,
        stumpings = 0,
        catchesAsCaptain = 0,
        stumpingsAsCaptain = 0,
        points = 0
      } = input;

      const result = await client.query(
        `
        INSERT INTO player_performance (
          id, player_id, match_id, runs_scored, balls_faced, fours, sixes, wickets_taken,
          runs_conceded, catches, stumpings, catches_as_captain, stumpings_as_captain, points
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        ON CONFLICT (player_id, match_id) DO UPDATE SET
          runs_scored = EXCLUDED.runs_scored,
          balls_faced = EXCLUDED.balls_faced,
          fours = EXCLUDED.fours,
          sixes = EXCLUDED.sixes,
          wickets_taken = EXCLUDED.wickets_taken,
          runs_conceded = EXCLUDED.runs_conceded,
          catches = EXCLUDED.catches,
          stumpings = EXCLUDED.stumpings,
          catches_as_captain = EXCLUDED.catches_as_captain,
          stumpings_as_captain = EXCLUDED.stumpings_as_captain,
          points = EXCLUDED.points
        RETURNING *
        `,
        [
          playerId, matchId, runsScored, ballsFaced, fours, sixes, wicketsTaken,
          runsConceded, catches, stumpings, catchesAsCaptain, stumpingsAsCaptain, points
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Calculate fantasy points for a performance
  calculateFantasyPoints(performance: PlayerPerformance): number {
    let points = 0;

    // Batting points
    points += performance.runsScored;
    points += performance.fours * 1;
    points += performance.sixes * 2;

    // Bowling points
    points += performance.wicketsTaken * 25;
    points += performance.runsConceded > 0 ? Math.floor(performance.runsConceded / 2) : 0;

    // Fielding points
    points += performance.catches * 8;
    points += performance.stumpings * 12;

    // Captain points (double)
    points += performance.catchesAsCaptain * 8;
    points += performance.stumpingsAsCaptain * 12;

    return points;
  }
}

// Leaderboard Service
export class LeaderboardService {
  // Get leaderboard by competition and category
  async getLeaderboard(
    competitionId: string,
    category: LeaderboardCategory,
    params?: { seasonId?: string; limit?: number; offset?: number }
  ): Promise<{ entries: Leaderboard[]; total: number }> {
    const client = await pool.connect();
    try {
      const { seasonId, limit = 10, offset = 0 } = params || {};
      const values: any[] = [competitionId, category];
      let paramIndex = 3;

      const conditions: string[] = ['competition_id = $1', 'category = $2'];
      if (seasonId) {
        conditions.push(`season_id = $${paramIndex++}`);
        values.push(seasonId);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM leaderboards WHERE ${whereClause}
        ORDER BY value DESC, rank ASC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM leaderboards WHERE ${whereClause}`,
        values
      );

      return {
        entries: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Update leaderboard rankings
  async updateLeaderboardRankings(
    competitionId: string,
    category: LeaderboardCategory,
    seasonId?: string
  ): Promise<void> {
    const client = await pool.connect();
    try {
      // Get all entries for this leaderboard, ordered by value
      const entriesResult = await client.query(
        `
        SELECT id, player_id, value FROM leaderboards
        WHERE competition_id = $1 AND category = $2
        ${seasonId ? 'AND season_id = $3' : ''}
        ORDER BY value DESC
        `,
        seasonId ? [competitionId, category, seasonId] : [competitionId, category]
      );

      // Update ranks
      for (let i = 0; i < entriesResult.rows.length; i++) {
        await client.query(
          `
          UPDATE leaderboards SET rank = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          `,
          [i + 1, entriesResult.rows[i].id]
        );
      }
    } finally {
      client.release();
    }
  }

  // Generate leaderboard for a competition
  async generateLeaderboard(
    competitionId: string,
    category: LeaderboardCategory,
    seasonId?: string
  ): Promise<void> {
    const client = await pool.connect();
    try {
      // Clear existing leaderboard for this category
      await client.query(
        `
        DELETE FROM leaderboards
        WHERE competition_id = $1 AND category = $2
        ${seasonId ? 'AND season_id = $3' : ''}
        `,
        seasonId ? [competitionId, category, seasonId] : [competitionId, category]
      );

      // Get player stats based on category
      let statsQuery = '';
      let valueColumn = '';

      switch (category) {
        case LeaderboardCategory.MostRuns:
          statsQuery = `
            SELECT player_id, SUM(runs) as value
            FROM player_stats
            WHERE format = 'T20'
            GROUP BY player_id
            ORDER BY value DESC
            LIMIT 100
          `;
          valueColumn = 'value';
          break;
        case LeaderboardCategory.MostWickets:
          statsQuery = `
            SELECT player_id, SUM(wickets) as value
            FROM player_stats
            WHERE format = 'T20'
            GROUP BY player_id
            ORDER BY value DESC
            LIMIT 100
          `;
          valueColumn = 'value';
          break;
        case LeaderboardCategory.HighestAverage:
          statsQuery = `
            SELECT player_id, AVG(average) as value
            FROM player_stats
            WHERE format = 'T20' AND average > 0
            GROUP BY player_id
            ORDER BY value DESC
            LIMIT 100
          `;
          valueColumn = 'value';
          break;
        default:
          statsQuery = `
            SELECT player_id, SUM(runs) as value
            FROM player_stats
            WHERE format = 'T20'
            GROUP BY player_id
            ORDER BY value DESC
            LIMIT 100
          `;
          valueColumn = 'value';
      }

      const statsResult = await client.query(statsQuery);

      // Insert leaderboard entries
      for (let i = 0; i < statsResult.rows.length; i++) {
        await client.query(
          `
          INSERT INTO leaderboards (
            id, competition_id, season_id, category, player_id, value, rank
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6
          )
          `,
          [
            competitionId,
            seasonId,
            category,
            statsResult.rows[i].player_id,
            statsResult.rows[i][valueColumn],
            i + 1
          ]
        );
      }
    } finally {
      client.release();
    }
  }
}

// Search Service
export class SearchService {
  // Search entities
  async searchEntities(
    query: string,
    params?: { entityType?: SearchEntityType; limit?: number; offset?: number }
  ): Promise<{ results: SearchIndex[]; total: number }> {
    const client = await pool.connect();
    try {
      const { entityType, limit = 10, offset = 0 } = params || {};
      const values: any[] = [];
      let paramIndex = 1;

      const conditions: string[] = [];
      if (entityType) {
        conditions.push(`entity_type = $${paramIndex++}`);
        values.push(entityType);
      }

      // Full-text search
      if (query) {
        conditions.push(`full_text_search @@ to_tsquery($${paramIndex})`);
        values.push(query);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const result = await client.query(
        `
        SELECT * FROM search_index ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM search_index ${whereClause}`,
        values
      );

      return {
        results: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Index an entity
  async indexEntity(input: SearchIndexCreateInput): Promise<SearchIndex> {
    const client = await pool.connect();
    try {
      const {
        entityType,
        entityId,
        name,
        description,
        tags = [],
        fullTextSearch
      } = input;

      const result = await client.query(
        `
        INSERT INTO search_index (
          id, entity_type, entity_id, name, description, tags, full_text_search
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, to_tsvector($6)
        )
        ON CONFLICT (entity_type, entity_id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          tags = EXCLUDED.tags,
          full_text_search = to_tsvector(EXCLUDED.name || ' ' || EXCLUDED.description),
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [entityType, entityId, name, description, JSON.stringify(tags), `${name} ${description}`]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Remove entity from search index
  async removeEntity(entityType: SearchEntityType, entityId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM search_index WHERE entity_type = $1 AND entity_id = $2 RETURNING id',
        [entityType, entityId]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Export all services
export const playerAnalyticsService = new PlayerAnalyticsService();
export const teamAnalyticsService = new TeamAnalyticsService();
export const matchAnalyticsService = new MatchAnalyticsService();
export const playerPerformanceService = new PlayerPerformanceService();
export const leaderboardService = new LeaderboardService();
export const searchService = new SearchService();
