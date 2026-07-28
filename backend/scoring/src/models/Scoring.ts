// Scoring model for Scoring Service

export interface ScoringSession {
  id: string;
  matchId: string;
  sessionStatus: SessionStatus;
  inningsNumber: number;
  currentOver: number;
  currentBall: number;
  runs: number;
  wickets: number;
  extras: number;
  lastBallBy?: string;
  lastBallTo?: string;
  lastBallResult?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type SessionStatus = 'Active' | 'Completed' | 'Paused' | 'Abandoned';

export interface ScoringEvent {
  id: string;
  sessionId: string;
  matchId: string;
  overNumber: number;
  ballNumber: number;
  eventType: EventType;
  eventOutcome: EventOutcome;
  runsScored: number;
  isWicket: boolean;
  isExtras: boolean;
  extrasType?: string;
  extrasRuns: number;
  bowlerId?: string;
  batterId?: string;
  fielderId?: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

export type EventType = 'Ball' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye' | 'Four' | 'Six' | 'Wicket' | 'Over' | 'Innings';
export type EventOutcome = 'Dot' | 'Single' | 'Double' | 'Triple' | 'Four' | 'Six' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye' | 'Wicket';

export interface ScoringNote {
  id: string;
  sessionId: string;
  note: string;
  noteType: NoteType;
  createdBy?: string;
  createdAt: string;
}

export type NoteType = 'General' | 'Toss' | 'PlayingXI' | 'Innings' | 'Weather' | 'Other';

export interface ScoringAuditLog {
  id: string;
  sessionId: string;
  matchId: string;
  eventType: string;
  oldValue?: any;
  newValue?: any;
  createdBy?: string;
  createdAt: string;
}

export interface ScoringSessionCreateInput {
  matchId: string;
  inningsNumber: number;
}

export interface ScoringEventCreateInput {
  sessionId: string;
  matchId: string;
  overNumber: number;
  ballNumber: number;
  eventType: EventType;
  eventOutcome: EventOutcome;
  runsScored?: number;
  isWicket?: boolean;
  isExtras?: boolean;
  extrasType?: string;
  extrasRuns?: number;
  bowlerId?: string;
  batterId?: string;
  fielderId?: string;
  description?: string;
}

export interface ScoringNoteInput {
  note: string;
  noteType: NoteType;
}

export interface BallByBallScoringInput {
  sessionId: string;
  matchId: string;
  overNumber: number;
  ballNumber: number;
  runs: number;
  isWicket: boolean;
  isWide?: boolean;
  isNoBall?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
  bowlerId: string;
  batterId: string;
  fielderId?: string;
  description?: string;
}

export interface Scorecard {
  sessionId: string;
  matchId: string;
  inningsNumber: number;
  teamBattingId: string;
  teamBowlingId: string;
  runs: number;
  wickets: number;
  overs: number;
  extras: number;
  ballsBowled: number;
  runRate: number;
  events: ScoringEvent[];
}
