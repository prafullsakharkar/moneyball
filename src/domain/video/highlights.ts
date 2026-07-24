import { Identifiable, Timestamped } from '../shared';
import { BallOutcome } from './clips';

// Highlight types
export type HighlightCategory =
  | 'batting'
  | 'bowling'
  | 'fielding'
  | 'sixes'
  | 'boundaries'
  | 'wickets'
  | 'catches'
  | 'run_outs'
  | 'stumpings'
  | 'direct_hits';

export interface PlayerHighlight extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamId?: string;
  teamName?: string;
  teamShort?: string;
  
  category: HighlightCategory;
  subCategory?: string;
  
  // Clip info
  clipId: string;
  videoId?: string;
  matchId?: string;
  matchName?: string;
  matchDate?: string;
  
  // Ball info
  overLabel?: string;
  ballNumber?: number;
  outcome: BallOutcome;
  runs: number;
  
  // Stats
  speedKph?: number;
  distance?: number; // for fielding
  timeTaken?: number; // for fielding
  
  // Preview
  thumbnailUrl?: string;
  clipUrl?: string;
  duration: number; // seconds
  
  // Tags
  tags: string[];
  
  // Stats
  views: number;
  likes: number;
  shares: number;
  isFeatured: boolean;
}

export interface MatchHighlight extends Identifiable, Timestamped {
  matchId: string;
  matchName?: string;
  matchDate?: string;
  team1Short?: string;
  team2Short?: string;
  
  category: HighlightCategory;
  highlights: PlayerHighlight[];
  
  // Summary
  summary?: string;
  keyMoment?: string;
  
  // Preview
  thumbnailUrl?: string;
  previewUrl?: string;
  previewDuration: number;
  
  // Stats
  views: number;
  likes: number;
}

export interface HighlightAnalytics {
  highlightId: string;
  views: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  engagementScore: number;
  topCountries: Record<string, number>;
  topDevices: Record<string, number>;
}