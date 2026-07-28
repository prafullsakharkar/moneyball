// Match model for Match Service

export interface Match {
  id: string;
  externalId?: string;
  tournamentId?: string;
  competitionId?: string;
  team1Id: string;
  team2Id: string;
  venueId?: string;
  format: CricketFormat;
  matchType: MatchType;
  matchStatus: MatchStatus;
  scheduledStart?: string;
  actualStart?: string;
  actualEnd?: string;
  tossWinnerId?: string;
  tossDecision?: string;
  firstInningsTeamId?: string;
  secondInningsTeamId?: string;
  result?: string;
  winnerId?: string;
  margin?: string;
  playerOfTheMatch?: string;
  weather: Weather;
  matchNotes?: string;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type CricketFormat = 'Test' | 'ODI' | 'T20' | 'Hundred' | 'Exhibition';
export type MatchType = 'International' | 'Domestic' | 'Club' | 'Academy' | 'School' | 'Corporate' | 'Friendly';
export type MatchStatus = 'Scheduled' | 'Live' | 'Completed' | 'Abandoned' | 'Postponed' | 'Cancelled';
export type WeatherType = 'Sunny' | 'Cloudy' | 'Overcast' | 'Rain' | 'Drizzle' | 'Thunderstorm';

export interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: WeatherType;
  description?: string;
}

export interface MatchOfficial {
  id: string;
  matchId: string;
  officialId: string;
  role: OfficialRole;
  assignedAt: string;
  endedAt?: string;
}

export type OfficialRole = 'Umpire1' | 'Umpire2' | 'ThirdUmpire' | 'FourthUmpire' | 'Referee' | 'MatchReferee';

export interface MatchPlayingXI {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  isStarter: boolean;
  battingOrder?: number;
  bowlingOrder?: number;
  createdAt: string;
}

export interface MatchSchedule {
  id: string;
  matchId: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  createdAt: string;
}

export interface MatchNote {
  id: string;
  matchId: string;
  note: string;
  noteType: NoteType;
  createdBy?: string;
  createdAt: string;
}

export type NoteType = 'General' | 'Toss' | 'PlayingXI' | 'Innings' | 'Weather' | 'Other';

export interface MatchCreateInput {
  team1Id: string;
  team2Id: string;
  venueId?: string;
  format: CricketFormat;
  matchType: MatchType;
  scheduledStart: string;
  tournamentId?: string;
  competitionId?: string;
}

export interface MatchUpdateInput {
  venueId?: string;
  scheduledStart?: string;
  actualStart?: string;
  actualEnd?: string;
  tossWinnerId?: string;
  tossDecision?: string;
  firstInningsTeamId?: string;
  secondInningsTeamId?: string;
  result?: string;
  winnerId?: string;
  margin?: string;
  playerOfTheMatch?: string;
  weather?: Weather;
  matchNotes?: string;
  matchStatus?: MatchStatus;
}

export interface MatchOfficialInput {
  officialId: string;
  role: OfficialRole;
}

export interface MatchPlayingXIInput {
  playerId: string;
  isStarter?: boolean;
  battingOrder?: number;
  bowlingOrder?: number;
}

export interface MatchNoteInput {
  note: string;
  noteType: NoteType;
}
