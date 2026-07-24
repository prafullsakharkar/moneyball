import { Identifiable, Timestamped } from '../shared';

// Live streaming types
export type LiveStatus = 'upcoming' | 'live' | 'ended' | 'cancelled';
export type LiveType = 'match' | 'training' | 'press_conference' | 'event';
export type StreamProtocol = 'hls' | 'dash' | 'webrtc' | 'rtmp';
export type StreamQuality = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '4K';

export interface LiveStream extends Identifiable, Timestamped {
  title: string;
  type: LiveType;
  status: LiveStatus;
  
  // Context
  matchId?: string;
  matchName?: string;
  tournamentId?: string;
  tournamentName?: string;
  venueId?: string;
  venueName?: string;
  
  // Teams
  homeTeamId?: string;
  homeTeamName?: string;
  awayTeamId?: string;
  awayTeamName?: string;
  
  // Schedule
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  
  // Stream info
  streams: StreamInfo[];
  thumbnailUrl?: string;
  posterUrl?: string;
  
  // Stats
  viewers: number;
  peakViewers?: number;
  totalWatchTime?: number;
  
  // Settings
  isPublic: boolean;
  isPremium: boolean;
  isHighlighted: boolean;
  
  // Playback
  duration?: number; // seconds
  vodId?: string;
}

export interface StreamInfo {
  id: string;
  protocol: StreamProtocol;
  url: string;
  quality: StreamQuality;
  isPrimary: boolean;
  isFallback: boolean;
  bitrate?: number; // kbps
}

export interface LiveStats {
  liveId: string;
  timestamp: string;
  
  // Current stats
  viewers: number;
  connections: number;
  
  // Quality
  avgBitrate: number;
  avgLatency: number;
  bufferEvents: number;
  
  // Errors
  errors: number;
  errorsByType?: Record<string, number>;
}

export interface LiveCommentary {
  streamId: string;
  timestamp: number;
  text: string;
  authorId?: string;
  authorName?: string;
  isVerified: boolean;
  likes: number;
  replies: number;
  isPinned: boolean;
  isDeleted: boolean;
}