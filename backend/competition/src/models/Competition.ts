// Models for Competition Service

export interface Competition {
  id: string;
  externalId?: string;
  organizationId: string;
  name: string;
  shortName: string;
  description?: string;
  format: CricketFormat;
  competitionType: CompetitionType;
  category: string;
  gender?: string;
  ageGroup?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  venueId?: string;
  prizePool?: Record<string, any>;
  sponsorIds?: string[];
  status: CompetitionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Season {
  id: string;
  competitionId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  competitionId: string;
  seasonId?: string;
  name: string;
  groupType: GroupType;
  teams: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Fixture {
  id: string;
  competitionId: string;
  seasonId?: string;
  groupId?: string;
  matchId?: string;
  round: number;
  stage: StageType;
  scheduledDate: string;
  scheduledTime?: string;
  venueId?: string;
  team1Id?: string;
  team2Id?: string;
  status: FixtureStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Standing {
  id: string;
  competitionId: string;
  seasonId?: string;
  groupId?: string;
  teamId: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesNoResult: number;
  points: number;
  netRunRate?: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentTeam {
  id: string;
  tournamentId: string;
  teamId: string;
  registeredDate: string;
  squad: string[];
  captainId?: string;
  coachId?: string;
  status: TournamentTeamStatus;
  createdAt: string;
  updatedAt: string;
}

// Enums
export enum CricketFormat {
  T20 = 'T20',
  ODI = 'ODI',
  Test = 'Test',
  FirstClass = 'FirstClass',
  ListA = 'ListA',
  T10 = 'T10',
  Other = 'Other'
}

export enum CompetitionType {
  League = 'League',
  Tournament = 'Tournament',
  Cup = 'Cup',
  Championship = 'Championship',
  Friendly = 'Friendly',
  Qualifier = 'Qualifier'
}

export enum CompetitionStatus {
  Draft = 'Draft',
  Active = 'Active',
  RegistrationOpen = 'RegistrationOpen',
  RegistrationClosed = 'RegistrationClosed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum SeasonStatus {
  Draft = 'Draft',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum GroupType {
  RoundRobin = 'RoundRobin',
  Knockout = 'Knockout',
  GroupA = 'GroupA',
  GroupB = 'GroupB',
  GroupC = 'GroupC',
  GroupD = 'GroupD'
}

export enum StageType {
  GroupStage = 'GroupStage',
  QuarterFinal = 'QuarterFinal',
  SemiFinal = 'SemiFinal',
  Final = 'Final',
  RoundRobin = 'RoundRobin',
  Knockout = 'Knockout',
  League = 'League',
  LeagueStage = 'LeagueStage'
}

export enum FixtureStatus {
  Scheduled = 'Scheduled',
  Live = 'Live',
  Completed = 'Completed',
  Abandoned = 'Abandoned',
  Postponed = 'Postponed',
  Cancelled = 'Cancelled'
}

export enum TournamentTeamStatus {
  Registered = 'Registered',
  Confirmed = 'Confirmed',
  Withdrawn = 'Withdrawn',
  Disqualified = 'Disqualified'
}

// Input types for CRUD operations
export interface CompetitionCreateInput {
  organizationId: string;
  name: string;
  shortName: string;
  description?: string;
  format: CricketFormat;
  competitionType: CompetitionType;
  category: string;
  gender?: string;
  ageGroup?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  venueId?: string;
  prizePool?: Record<string, any>;
  sponsorIds?: string[];
}

export interface CompetitionUpdateInput {
  name?: string;
  shortName?: string;
  description?: string;
  format?: CricketFormat;
  competitionType?: CompetitionType;
  category?: string;
  gender?: string;
  ageGroup?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  venueId?: string;
  prizePool?: Record<string, any>;
  sponsorIds?: string[];
  status?: CompetitionStatus;
}

export interface SeasonCreateInput {
  competitionId: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: SeasonStatus;
}

export interface SeasonUpdateInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: SeasonStatus;
}

export interface GroupCreateInput {
  competitionId: string;
  seasonId?: string;
  name: string;
  groupType: GroupType;
  teams?: string[];
}

export interface GroupUpdateInput {
  name?: string;
  groupType?: GroupType;
  teams?: string[];
}

export interface FixtureCreateInput {
  competitionId: string;
  seasonId?: string;
  groupId?: string;
  matchId?: string;
  round: number;
  stage: StageType;
  scheduledDate: string;
  scheduledTime?: string;
  venueId?: string;
  team1Id?: string;
  team2Id?: string;
}

export interface FixtureUpdateInput {
  matchId?: string;
  round?: number;
  stage?: StageType;
  scheduledDate?: string;
  scheduledTime?: string;
  venueId?: string;
  team1Id?: string;
  team2Id?: string;
  status?: FixtureStatus;
}

export interface TournamentTeamCreateInput {
  tournamentId: string;
  teamId: string;
  squad?: string[];
  captainId?: string;
  coachId?: string;
}

export interface TournamentTeamUpdateInput {
  squad?: string[];
  captainId?: string;
  coachId?: string;
  status?: TournamentTeamStatus;
}
