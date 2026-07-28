// Fantasy domain exports - renamed to avoid conflicts
// Must import and re-export with aliases due to duplicate type names

// Re-export types from leagues.ts with FantasyPlayerSelection renamed to LeaguePlayerSelection
export type { FantasyLeague } from './leagues';
export type { FantasyPlayerSelection as LeaguePlayerSelection } from './leagues';
export type { LeagueTeam, Prize, LeagueSettings } from './leagues';

// Re-export types from contests.ts with FantasyPlayerSelection renamed to ContestPlayerSelection
export type { FantasyContest, ContestPrize, ContestTeam } from './contests';
export type { FantasyPlayerSelection as ContestPlayerSelection } from './contests';
export type { ContestLeaderboard, ContestLeaderboardEntry, PointsBreakdown } from './contests';

// Re-export remaining types directly
export * from './teams';
export * from './players';
export * from './scoreboards';