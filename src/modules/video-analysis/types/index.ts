export type VideoStatus = 'processing' | 'ready' | 'failed' | 'queued';

export type VideoQuality = '4K' | '1080p' | '720p' | '480p';

export type VideoSource = 'broadcast' | 'user_upload' | 'highlights' | 'clip';

export interface VideoFile {
  id: string;
  title: string;
  matchId?: string;
  matchName?: string;
  team1Short?: string;
  team2Short?: string;
  duration: number; // seconds
  size: number; // MB
  quality: VideoQuality;
  source: VideoSource;
  status: VideoStatus;
  uploadedAt: string; // ISO string
  thumbnailUrl: string;
  videoUrl: string;
  taggedBalls: number;
  taggedPlayers: number;
  aiClips: number;
  views: number;
  description?: string;
}

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

export type HighlightCategory =
  | 'batting'
  | 'bowling'
  | 'fielding'
  | 'sixes'
  | 'boundaries'
  | 'wickets'
  | 'catches'
  | 'run_outs';

export interface BallClip {
  id: string;
  videoId: string;
  matchId?: string;
  overNumber: number;
  ballNumber: number;
  ballLabel: string; // e.g. "10.3"
  startTime: number; // seconds
  endTime: number; // seconds
  length: number; // seconds
  speedKph?: number;
  outcome: BallOutcome;
  runs: number;
  tags: ShotTag[];
  batsman?: string;
  bowler?: string;
  comments: string[];
  bookmarked: boolean;
  thumbnailUrl: string;
  clipUrl: string;
}

export interface TimelineEvent {
  id: string;
  time: number; // seconds
  over: number;
  ball: number;
  type: 'boundary' | 'wicket' | 'six' | 'dot' | 'wide' | 'no_ball' | 'review' | 'timeout';
  label: string;
  description?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  author: string;
  authorInitials: string;
  timestamp: number; // seconds into video
  text: string;
  createdAt: string; // ISO string
}

export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type AIJobType =
  | 'highlights'
  | 'shot_detection'
  | 'player_tracking'
  | 'auto_tagging'
  | 'clip_generation';

export interface AIJob {
  id: string;
  type: AIJobType;
  videoId: string;
  videoTitle: string;
  status: AIJobStatus;
  progress: number; // 0-100
  startedAt: string; // ISO string
  completedAt?: string; // ISO string
  resultCount?: number;
  error?: string;
}

export interface PlayerHighlight {
  id: string;
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamShort: string;
  category: HighlightCategory;
  clipId: string;
  matchName: string;
  overLabel: string;
  outcome: BallOutcome;
  runs: number;
  thumbnailUrl: string;
  clipUrl: string;
  duration: number;
  tags: ShotTag[];
}

export interface VideoDashboardMetrics {
  totalVideos: number;
  taggedBalls: number;
  taggedPlayers: number;
  aiClips: number;
  storageUsed: number; // GB
  storageTotal: number; // GB
}
