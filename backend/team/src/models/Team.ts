// Team model for Team Service

export interface Team {
  id: string;
  externalId?: string;
  organizationId: string;
  name: string;
  shortName: string;
  logo?: string;
  colors: TeamColors;
  format: CricketFormat;
  teamType: TeamType;
  teamCategory: TeamCategory;
  gender?: string;
  ageGroup?: string;
  status: TeamStatus;
  description?: string;
  website?: string;
  socialMedia: SocialMedia;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type CricketFormat = 'Test' | 'ODI' | 'T20' | 'Hundred' | 'Exhibition';
export type TeamType = 'Senior' | 'Junior' | 'Women' | 'Academy' | 'Corporate' | 'Development';
export type TeamCategory = 'International' | 'Domestic' | 'Club' | 'Academy' | 'School' | 'Corporate';
export type TeamStatus = 'Active' | 'Inactive' | 'Suspended' | 'Dissolved';

export interface TeamColors {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface TeamRoster {
  id: string;
  teamId: string;
  playerId: string;
  role: PlayerRole;
  jerseyNumber?: number;
  status: RosterStatus;
  joinedDate: string;
  leftDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | 'Wicket-Keeper-Batsman';
export type RosterStatus = 'Active' | 'Inactive' | 'Injured' | 'Suspended';

export interface TeamCaptain {
  id: string;
  teamId: string;
  playerId: string;
  appointedDate: string;
  endedDate?: string;
  createdAt: string;
}

export interface TeamCoach {
  id: string;
  teamId: string;
  coachId: string;
  role: CoachRole;
  startedDate: string;
  endedDate?: string;
  createdAt: string;
}

export type CoachRole = 'Head-Coach' | 'Batting-Coach' | 'Bowling-Coach' | 'Fielding-Coach' | 'Fitness-Coach';

export interface TeamStats {
  id: string;
  teamId: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesNoResult: number;
  winPercentage: number;
  runsScored: number;
  wicketsTaken: number;
  averageRunRate: number;
  averageOppositionRunRate: number;
  lastUpdated: string;
}

export interface TeamCreateInput {
  name: string;
  shortName: string;
  logo?: string;
  colors: TeamColors;
  format: CricketFormat;
  teamType: TeamType;
  teamCategory: TeamCategory;
  gender?: string;
  ageGroup?: string;
  description?: string;
  website?: string;
  socialMedia?: SocialMedia;
  organizationId: string;
}

export interface TeamUpdateInput {
  name?: string;
  shortName?: string;
  logo?: string;
  colors?: TeamColors;
  description?: string;
  website?: string;
  socialMedia?: SocialMedia;
  status?: TeamStatus;
}

export interface TeamRosterInput {
  playerId: string;
  role: PlayerRole;
  jerseyNumber?: number;
  status?: RosterStatus;
  joinedDate?: string;
  leftDate?: string;
}

export interface TeamStatsUpdateInput {
  matchesPlayed?: number;
  matchesWon?: number;
  matchesLost?: number;
  matchesTied?: number;
  matchesNoResult?: number;
  runsScored?: number;
  wicketsTaken?: number;
  averageRunRate?: number;
  averageOppositionRunRate?: number;
}
