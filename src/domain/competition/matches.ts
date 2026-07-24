import { Identifiable, Timestamped } from '../shared';
import { MatchFormat, MatchStatus } from '../shared';

// Match types
export type MatchType = 'league' | 'knockout' | 'friendly' | 'practice' | 'warmup';
export type InningsType = 'first' | 'second' | 'third' | 'fourth';
export type BattingSide = 'home' | 'away' | 'first' | 'second';

// Match details
export interface Match extends Identifiable, Timestamped {
  tournamentId: string;
  tournamentName?: string;
  round?: string;
  matchNumber?: number;
  type: MatchType;
  format: MatchFormat;
  status: MatchStatus;
  
  // Teams
  team1Id: string;
  team2Id: string;
  team1Name?: string;
  team2Name?: string;
  team1Logo?: string;
  team2Logo?: string;
  team1Color?: string;
  team2Color?: string;
  
  // Venue
  venueId: string;
  venueName?: string;
  city?: string;
  country?: string;
  pitchType?: 'flat' | 'green-top' | 'dry' | 'helpful-spin' | 'helpful-seamer';
  weather?: 'sunny' | 'cloudy' | 'overcast' | 'rain' | 'wet';
  
  // Schedule
  scheduledStartTime: string;
  actualStartTime?: string;
  endTime?: string;
  toss: TossResult;
  
  // Scorecards
  innings: Innings[];
  result?: MatchResult;
  playerOfTheMatch?: string;
  
  // Live tracking
  isLive?: boolean;
  currentOver?: string;
  currentRunRate?: number;
  requiredRate?: number;
  target?: number;
}

export interface TossResult {
  winner: string; // teamId
  decision: 'bat' | 'field';
  time: string;
}

export interface Innings extends Identifiable {
  matchId: string;
  inningsNumber: InningsType;
  battingTeamId: string;
  bowlingTeamId: string;
  battingTeamName?: string;
  bowlingTeamName?: string;
  
  // Score
  runs: number;
  wickets: number;
  overs: number; // e.g., "19.4"
  maidenOvers?: number;
  
  // Extras
  extras: number;
  wides?: number;
  noBalls?: number;
  byes?: number;
  legByes?: number;
  penalties?: number;
  
  // Powerplay
  powerplayRuns?: number;
  
  // Target (for chase)
  targetRuns?: number;
  
  // Batting
  batters: BatterStatus[];
  bowlers: BowlerStatus[];
  
  // Commentary
  commentary?: CommentaryEntry[];
}

export interface BatterStatus extends Identifiable {
  batterId: string;
  name: string;
  shortName: string;
  isBatting: boolean;
  isOnStrike: boolean;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  out: boolean;
  howOut?: HowOut;
  fielderId?: string;
  bowlerId?: string;
  fielderName?: string;
  bowlerName?: string;
}

export interface BowlerStatus extends Identifiable {
  bowlerId: string;
  name: string;
  shortName: string;
  isBowling: boolean;
  oversBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  wides: number;
  noBalls: number;
  economy: number;
}

export interface HowOut {
  type: 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket' | 'hit-ball-twice' | 'obstructing-field' | 'timed-out';
  description: string;
  fielderId?: string;
  fieldName?: string;
  bowlerId?: string;
  bowlerName?: string;
  runnerId?: string;
  runnerName?: string;
}

export interface CommentaryEntry extends Identifiable {
  overNumber: number;
  ballNumber: number;
  ballLabel: string; // e.g., "19.4"
  batterId: string;
  bowlerId: string;
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  isSix: boolean;
  isDot: boolean;
  isWide: boolean;
  isNoBall: boolean;
  text: string;
  timestamp: string;
  event?: 'boundary' | 'wicket' | 'milestone';
}

export interface MatchResult {
  type: 'normal' | 'tie' | 'no_result' | 'abandoned' | 'cancelled' | 'forfeit';
  winnerId?: string;
  margin?: string; // e.g., "by 6 wickets" or "by 50 runs"
  details?: string;
  dlsApplied?: boolean;
  superOver?: boolean;
}