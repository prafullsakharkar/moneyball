import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';
import { PlayerId, UserId } from '../shared';

// Team types
export type TeamType = 'professional' | 'academy' | 'club' | 'school' | 'youth';
export type TeamStatus = 'active' | 'inactive' | 'dissolved';

export interface Team extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName: string;
  type: TeamType;
  status: TeamStatus;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  foundedYear?: number;
  homeVenueId?: string;
  captainId?: PlayerId;
  coachId?: UserId;
  managerId?: UserId;
  maxPlayers: number;
  currentPlayerCount: number;
  roster: TeamPlayer[];
  socialMedia?: SocialMedia;
  stats?: TeamStats;
}

export interface TeamPlayer extends Identifiable {
  playerId: PlayerId;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper';
  status: 'active' | 'injured' | 'suspended' | 'rested';
  jerseyNumber: number;
  joinedDate: string;
  contractExpires?: string;
  salary?: number;
}

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface TeamStats {
  totalMatches: number;
  won: number;
  lost: number;
  tied: number;
  winPercentage: number;
  currentStreak: number;
  bestWinStreak: number;
  avgScore: number;
  avgOpponentScore: number;
  homeRecord: RecordStats;
  awayRecord: RecordStats;
}

export interface RecordStats {
  played: number;
  won: number;
  lost: number;
  winPercentage: number;
}