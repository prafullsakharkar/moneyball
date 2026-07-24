import { Identifiable, Timestamped, Nameable } from '../shared';

// Player types
export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper';
export type PlayerStatus = 'available' | 'injured' | 'suspended' | 'retired' | 'unavailable';
export type BattingStyle = 'right-handed' | 'left-handed';
export type BowlingStyle = 'right-arm-fast' | 'left-arm-fast' | 'right-arm-medium' | 'left-arm-medium' | 'right-arm-spin' | 'left-arm-spin' | 'leg-spin' | 'off-spin';

export interface Player extends Identifiable, Timestamped, Nameable {
  photoUrl?: string;
  role: PlayerRole;
  status: PlayerStatus;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female';
  nationality: string;
  countryCode?: string;
  heightCm?: number;
  weightKg?: number;
  
  // Playing styles
  battingStyle: BattingStyle;
  bowlingStyle?: BowlingStyle;
  
  // Batting stats
  battingStats?: BattingStats;
  
  // Bowling stats
  bowlingStats?: BowlingStats;
  
  // Fielding stats
  fieldingStats?: FieldingStats;
  
  // Career info
  teams: PlayerTeamHistory[];
  currentTeamId?: string;
  currentTeamName?: string;
  draftInfo?: DraftInfo;
  contractInfo?: ContractInfo;
}

export interface BattingStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: string; // e.g., "124*" or "98"
  average: number;
  strikeRate: number;
  centuries: number;
  halfCenturies: number;
  ducks: number;
  fours: number;
  sixes: number;
}

export interface BowlingStats {
  matches: number;
  innings: number;
  wickets: number;
  bestFigures: string; // e.g., "4/28"
  average: number;
  economy: number;
  strikeRate: number;
  fiveWickets: number;
  fourWickets: number;
  runsConceded: number;
}

export interface FieldingStats {
  matches: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  directHits: number;
  fieldingAverage: number;
}

export interface PlayerTeamHistory extends Identifiable {
  teamId: string;
  teamName: string;
  joinDate: string;
  leaveDate?: string;
  roles: PlayerRole[];
  jerseyNumber?: number;
}

export interface DraftInfo {
  draftYear: number;
  draftRound: number;
  pickNumber: number;
  teamId: string;
  teamName: string;
  basePrice: number;
  soldPrice?: number;
}

export interface ContractInfo {
  startDate: string;
  endDate: string;
  teamId: string;
  teamName: string;
  annualSalary: number;
  signingBonus?: number;
  options: ContractOption[];
}

export interface ContractOption {
  type: 'team' | 'player';
  year: number;
  value: number;
  optionDate: string;
}