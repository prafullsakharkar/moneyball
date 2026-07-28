// Models for Scouting Service

export enum CricketFormat {
  T20 = 'T20',
  ODI = 'ODI',
  Test = 'Test',
  FirstClass = 'FirstClass',
  ListA = 'ListA',
  T10 = 'T10',
  Other = 'Other'
}

export interface ScoutingReport {
  id: string;
  playerId: string;
  scoutId?: string;
  reportDate: string;
  reportType: ReportType;
  status: ReportStatus;
  summary?: string;
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ScoutingReportSection {
  id: string;
  reportId: string;
  sectionName: string;
  content?: string;
  rating?: number;
  createdAt: string;
}

export interface ScoutingSession {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScoutingSessionPlayer {
  id: string;
  sessionId: string;
  playerId: string;
  assignedAt: string;
  completedAt?: string;
  status: SessionPlayerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerRanking {
  id: string;
  playerId: string;
  format: CricketFormat;
  position: string;
  ranking: number;
  totalPlayers: number;
  percentile?: number;
  evaluationDate: string;
  criteria?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ScoutingNote {
  id: string;
  playerId: string;
  scoutId?: string;
  noteType: NoteType;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

// Enums
export enum ReportType {
  PlayerAssessment = 'PlayerAssessment',
  MatchAnalysis = 'MatchAnalysis',
  TournamentEvaluation = 'TournamentEvaluation',
  PerformanceReview = 'PerformanceReview',
  DevelopmentPlan = 'DevelopmentPlan'
}

export enum ReportStatus {
  Draft = 'Draft',
  InReview = 'InReview',
  Completed = 'Completed',
  Archived = 'Archived'
}

export enum SessionStatus {
  Planned = 'Planned',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum SessionPlayerStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  NotApplicable = 'NotApplicable'
}

export enum NoteType {
  General = 'General',
  Technical = 'Technical',
  Tactical = 'Tactical',
  Physical = 'Physical',
  Mental = 'Mental',
  Performance = 'Performance'
}

// Input types
export interface ScoutingReportCreateInput {
  playerId: string;
  scoutId?: string;
  reportDate: string;
  reportType: ReportType;
  summary?: string;
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
}

export interface ScoutingReportUpdateInput {
  reportType?: ReportType;
  status?: ReportStatus;
  summary?: string;
  overallRating?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
}

export interface ScoutingReportSectionCreateInput {
  reportId: string;
  sectionName: string;
  content?: string;
  rating?: number;
}

export interface ScoutingSessionCreateInput {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  status?: SessionStatus;
}

export interface ScoutingSessionUpdateInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: SessionStatus;
}

export interface ScoutingSessionPlayerCreateInput {
  sessionId: string;
  playerId: string;
  status?: SessionPlayerStatus;
}

export interface PlayerRankingCreateInput {
  playerId: string;
  format: CricketFormat;
  position: string;
  ranking: number;
  totalPlayers: number;
  percentile?: number;
  evaluationDate: string;
  criteria?: Record<string, any>;
}

export interface ScoutingNoteCreateInput {
  playerId: string;
  scoutId?: string;
  noteType: NoteType;
  content: string;
  isPublic?: boolean;
}
