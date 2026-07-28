// Models for Analytics Service

export interface PlayerStats {
  id: string;
  playerId: string;
  format: CricketFormat;
  matches: number;
  innings: number;
  runs: number;
  highestScore?: string;
  average: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  ducks: number;
  wickets: number;
  bestBowling?: string;
  economyRate: number;
  catches: number;
  stumpings: number;
  matchesAsCaptain: number;
  lastUpdated: string;
}

export interface TeamStats {
  id: string;
  teamId: string;
  format: CricketFormat;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
  noResults: number;
  winPercentage: number;
  homeMatches: number;
  homeWins: number;
  awayMatches: number;
  awayWins: number;
  lastUpdated: string;
}

export interface MatchAnalytics {
  id: string;
  matchId: string;
  team1Id: string;
  team2Id: string;
  venueId?: string;
  tossWinnerId?: string;
  tossDecision?: string;
  firstInningsScore?: number;
  secondInningsScore?: number;
  result?: string;
  winningMargin?: string;
  playerOfTheMatchId?: string;
  crowdCount?: number;
  weatherConditions?: string;
  createdAt: string;
}

export interface PlayerPerformance {
  id: string;
  playerId: string;
  matchId: string;
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  wicketsTaken: number;
  runsConceded: number;
  catches: number;
  stumpings: number;
  catchesAsCaptain: number;
  stumpingsAsCaptain: number;
  points: number;
  createdAt: string;
}

export interface Leaderboard {
  id: string;
  competitionId: string;
  seasonId?: string;
  category: LeaderboardCategory;
  playerId: string;
  value: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchIndex {
  id: string;
  entityType: SearchEntityType;
  entityId: string;
  name: string;
  description?: string;
  tags: string[];
  fullTextSearch: string;
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

export enum LeaderboardCategory {
  MostRuns = 'MostRuns',
  MostCenturies = 'MostCenturies',
  MostFifties = 'MostFifties',
  HighestAverage = 'HighestAverage',
  HighestStrikeRate = 'HighestStrikeRate',
  MostWickets = 'MostWickets',
  BestEconomy = 'BestEconomy',
  BestBowlingFigures = 'BestBowlingFigures',
  MostCatches = 'MostCatches',
  MostStumpings = 'MostStumpings',
  MostMatchesAsCaptain = 'MostMatchesAsCaptain',
  MostRunsInTournament = 'MostRunsInTournament',
  MostWicketsInTournament = 'MostWicketsInTournament',
  PlayerOfTheTournament = 'PlayerOfTheTournament'
}

export enum SearchEntityType {
  Player = 'Player',
  Team = 'Team',
  Match = 'Match',
  Tournament = 'Tournament',
  Venue = 'Venue',
  Organization = 'Organization'
}

// Input types
export interface PlayerStatsCreateInput {
  playerId: string;
  format: CricketFormat;
  matches?: number;
  innings?: number;
  runs?: number;
  highestScore?: string;
  average?: number;
  strikeRate?: number;
  centuries?: number;
  fifties?: number;
  ducks?: number;
  wickets?: number;
  bestBowling?: string;
  economyRate?: number;
  catches?: number;
  stumpings?: number;
  matchesAsCaptain?: number;
}

export interface PlayerStatsUpdateInput {
  matches?: number;
  innings?: number;
  runs?: number;
  highestScore?: string;
  average?: number;
  strikeRate?: number;
  centuries?: number;
  fifties?: number;
  ducks?: number;
  wickets?: number;
  bestBowling?: string;
  economyRate?: number;
  catches?: number;
  stumpings?: number;
  matchesAsCaptain?: number;
}

export interface TeamStatsCreateInput {
  teamId: string;
  format: CricketFormat;
  matches?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  noResults?: number;
  winPercentage?: number;
  homeMatches?: number;
  homeWins?: number;
  awayMatches?: number;
  awayWins?: number;
}

export interface TeamStatsUpdateInput {
  matches?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  noResults?: number;
  winPercentage?: number;
  homeMatches?: number;
  homeWins?: number;
  awayMatches?: number;
  awayWins?: number;
}

export interface MatchAnalyticsCreateInput {
  matchId: string;
  team1Id: string;
  team2Id: string;
  venueId?: string;
  tossWinnerId?: string;
  tossDecision?: string;
  firstInningsScore?: number;
  secondInningsScore?: number;
  result?: string;
  winningMargin?: string;
  playerOfTheMatchId?: string;
  crowdCount?: number;
  weatherConditions?: string;
}

export interface MatchAnalyticsUpdateInput {
  tossWinnerId?: string;
  tossDecision?: string;
  firstInningsScore?: number;
  secondInningsScore?: number;
  result?: string;
  winningMargin?: string;
  playerOfTheMatchId?: string;
  crowdCount?: number;
  weatherConditions?: string;
}

export interface PlayerPerformanceCreateInput {
  playerId: string;
  matchId: string;
  runsScored?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  wicketsTaken?: number;
  runsConceded?: number;
  catches?: number;
  stumpings?: number;
  catchesAsCaptain?: number;
  stumpingsAsCaptain?: number;
  points?: number;
}

export interface PlayerPerformanceUpdateInput {
  runsScored?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  wicketsTaken?: number;
  runsConceded?: number;
  catches?: number;
  stumpings?: number;
  catchesAsCaptain?: number;
  stumpingsAsCaptain?: number;
  points?: number;
}

export interface LeaderboardCreateInput {
  competitionId: string;
  seasonId?: string;
  category: LeaderboardCategory;
  playerId: string;
  value: number;
  rank: number;
}

export interface LeaderboardUpdateInput {
  value?: number;
  rank?: number;
}

export interface SearchIndexCreateInput {
  entityType: SearchEntityType;
  entityId: string;
  name: string;
  description?: string;
  tags?: string[];
  fullTextSearch?: string;
}

export interface SearchIndexUpdateInput {
  name?: string;
  description?: string;
  tags?: string[];
  fullTextSearch?: string;
}
