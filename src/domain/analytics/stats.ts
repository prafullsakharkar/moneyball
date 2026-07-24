import { Identifiable, Timestamped, Nameable } from '../shared';
import { PlayerRole, BattingStyle, BowlingStyle } from '../competition/players';

// Stat types
export type StatCategory = 'batting' | 'bowling' | 'fielding' | 'all_round' | 'team' | 'tournament';
export type StatType = 'career' | 'season' | 'match' | 'series' | 'tournament';
export type StatPeriod = 'all_time' | 'year' | 'month' | 'week';

export interface PlayerStats extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamId?: string;
  teamName?: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  
  // Stat info
  category: StatCategory;
  statType: StatType;
  period?: StatPeriod;
  season?: number;
  
  // Batting stats
  matches?: number;
  innings?: number;
  notOuts?: number;
  runs?: number;
  highestScore?: number;
  battingAverage?: number;
  ballsFaced?: number;
  battingStrikeRate?: number;
  centuries?: number;
  halfCenturies?: number;
  ducks?: number;
  fours?: number;
  sixes?: number;
  
  // Bowling stats
  wickets?: number;
  oversBowled?: number;
  maidens?: number;
  runsConceded?: number;
  economy?: number;
  bowlingAverage?: number;
  bowlingStrikeRate?: number;
  bestBowling?: string;
  fiveWickets?: number;
  tenWickets?: number;
  
  // Fielding stats
  catches?: number;
  stumpings?: number;
  runOuts?: number;
  directHits?: number;
  
  // All round stats
  battingPoints?: number;
  bowlingPoints?: number;
  fieldingPoints?: number;
  totalPoints?: number;
  
  // Team stats
  wins?: number;
  losses?: number;
  ties?: number;
  noResult?: number;
}

export interface TournamentStats extends Identifiable, Timestamped {
  tournamentId: string;
  tournamentName: string;
  year: number;
  
  // Total stats
  matchesPlayed: number;
  totalRuns: number;
  totalWickets: number;
  totalBoundaries: number;
  totalSixes: number;
  highestTeamScore?: number;
  lowestTeamScore?: number;
  
  // Individual leaders
  topScorer?: Leader;
  topBowler?: Leader;
  topFielder?: Leader;
  bestAverage?: Leader;
  bestStrikeRate?: Leader;
  bestEconomy?: Leader;
  
  // Team stats
  teamStandings: TeamStats[];
}

export interface Leader extends Identifiable {
  playerId: string;
  playerName: string;
  teamId?: string;
  teamName?: string;
  value: number;
  rank: number;
}

export interface TeamStats extends Identifiable, Timestamped, Nameable {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr?: number;
  runRate?: number;
  position: number;
}