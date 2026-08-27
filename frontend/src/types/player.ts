/**
 * Player Domain Types
 * ============================================
 * Participants domain — players, their roles, styles, and career statistics.
 * All cricket metrics (runs, wickets, overs, average, strike rate, economy,
 * ranking, price) are numeric and rendered with tabular numbers, right-aligned.
 */

/* ── Enums / Unions ─────────────────────────────────────── */

export type PlayerRole = 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';

export type BattingStyle = 'right_hand' | 'left_hand';

export type BowlingStyle =
  | 'right_arm_fast'
  | 'right_arm_fast_medium'
  | 'right_arm_medium'
  | 'left_arm_fast'
  | 'left_arm_fast_medium'
  | 'left_arm_medium'
  | 'right_arm_off_break'
  | 'left_arm_orthodox'
  | 'leg_break'
  | 'left_arm_chinaman'
  | 'none';

export type PlayerStatus = 'active' | 'injured' | 'suspended' | 'retired' | 'released';

export type PlayerAvailability = 'available' | 'unavailable' | 'probable';

/* ── Core Player ────────────────────────────────────────── */

export interface Player {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  /** Display name (e.g. "V. Kohli") */
  displayName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  nationality?: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  status: PlayerStatus;
  availability: PlayerAvailability;
  /** Primary team id */
  teamId?: string;
  teamName?: string;
  /** Jersey number */
  jerseyNumber?: number;
  /** Market value / auction price (numeric, tabular) */
  price?: number;
  /** Current ranking (numeric, tabular) */
  ranking?: number;
  /** Career statistics */
  stats: PlayerStats;
  /** Tags for filtering (e.g. 'captain', 'vice-captain', 'keeper') */
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/* ── Career Statistics ──────────────────────────────────── */

export interface PlayerStats {
  /** Batting */
  matches: number;
  innings: number;
  runs: number;
  ballsFaced: number;
  notOuts: number;
  highestScore: number;
  hundreds: number;
  fifties: number;
  /** Bowling */
  ballsBowled: number;
  wickets: number;
  runsConceded: number;
  bestBowling?: string;
  fiveWicketHauls: number;
  /** Fielding */
  catches: number;
  stumpings: number;
}

/* ── Derived metrics (computed, not stored) ─────────────── */

export interface PlayerMetrics {
  /** Batting average (runs / dismissals) */
  battingAverage: number;
  /** Strike rate (runs / balls * 100) */
  strikeRate: number;
  /** Bowling average (runs conceded / wickets) */
  bowlingAverage: number;
  /** Economy rate (runs conceded / overs) */
  economyRate: number;
  /** Bowling strike rate (balls / wickets) */
  bowlingStrikeRate: number;
}

/* ── Request / Response ─────────────────────────────────── */

export interface CreatePlayerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  status?: PlayerStatus;
  teamId?: string;
  jerseyNumber?: number;
  price?: number;
  ranking?: number;
  tags?: string[];
}

export interface UpdatePlayerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  role?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  status?: PlayerStatus;
  availability?: PlayerAvailability;
  teamId?: string;
  jerseyNumber?: number;
  price?: number;
  ranking?: number;
  tags?: string[];
}

export interface PlayerListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: PlayerRole;
  status?: PlayerStatus;
  teamId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/* ── Bulk operations ────────────────────────────────────── */

export interface BulkPlayerUpdateRequest {
  ids: string[];
  data: UpdatePlayerRequest;
}

/* ── Labels ─────────────────────────────────────────────── */

export const PLAYER_ROLE_LABELS: Record<PlayerRole, string> = {
  batsman: 'Batsman',
  bowler: 'Bowler',
  all_rounder: 'All-rounder',
  wicket_keeper: 'Wicket-keeper',
};

export const PLAYER_STATUS_LABELS: Record<PlayerStatus, string> = {
  active: 'Active',
  injured: 'Injured',
  suspended: 'Suspended',
  retired: 'Retired',
  released: 'Released',
};

export const BATTING_STYLE_LABELS: Record<BattingStyle, string> = {
  right_hand: 'Right-hand',
  left_hand: 'Left-hand',
};

export const BOWLING_STYLE_LABELS: Record<BowlingStyle, string> = {
  right_arm_fast: 'Right-arm fast',
  right_arm_fast_medium: 'Right-arm fast-medium',
  right_arm_medium: 'Right-arm medium',
  left_arm_fast: 'Left-arm fast',
  left_arm_fast_medium: 'Left-arm fast-medium',
  left_arm_medium: 'Left-arm medium',
  right_arm_off_break: 'Right-arm off-break',
  left_arm_orthodox: 'Left-arm orthodox',
  leg_break: 'Leg-break',
  left_arm_chinaman: 'Left-arm chinaman',
  none: '—',
};
