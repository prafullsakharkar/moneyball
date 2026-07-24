import { Identifiable, Timestamped } from '../shared';

// Clip types
export type BallOutcome =
  | 'dot'
  | 'single'
  | 'double'
  | 'triple'
  | 'four'
  | 'six'
  | 'wicket'
  | 'wide'
  | 'no_ball'
  | 'bye'
  | 'leg_bye';

export type ShotTag =
  | 'Cover Drive'
  | 'Pull'
  | 'Cut'
  | 'Sweep'
  | 'Reverse Sweep'
  | 'Yorker'
  | 'Bouncer'
  | 'Slower Ball'
  | 'Edge'
  | 'Catch'
  | 'LBW'
  | 'Run Out';

export interface BallClip extends Identifiable, Timestamped {
  videoId: string;
  videoTitle?: string;
  matchId?: string;
  matchName?: string;
  
  // Ball info
  overNumber: number;
  ballNumber: number;
  ballLabel: string; // e.g., "10.3"
  
  // Timing
  startTime: number; // seconds
  endTime: number; // seconds
  length: number; // seconds
  
  // Ball details
  speedKph?: number;
  outcome: BallOutcome;
  runs: number;
  tags: ShotTag[];
  
  // Players
  batsmanId?: string;
  batsmanName?: string;
  bowlerId?: string;
  bowlerName?: string;
  
  // Comments
  comments: string[];
  bookmarked: boolean;
  
  // URLs
  thumbnailUrl?: string;
  clipUrl?: string;
}

export interface ClipTag {
  id: string;
  clipId: string;
  type: 'shot' | 'delivery' | 'event';
  label: string;
  timestamp: number;
  confidence?: number;
  isManual: boolean;
}

export interface ClipComment extends Identifiable {
  clipId: string;
  authorId: string;
  authorName?: string;
  timestamp: number; // seconds into clip
  text: string;
  createdAt: string;
  reactions?: Record<string, number>;
}

export interface ClipAnalytics {
  clipId: string;
  views: number;
  likes: number;
  shares: number;
  averageWatchTime: number;
  completionRate: number;
  tagCounts: Record<string, number>;
}