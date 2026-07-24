import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';

// Video types
export type VideoStatus = 'processing' | 'ready' | 'failed' | 'queued';
export type VideoQuality = '4K' | '1080p' | '720p' | '480p';
export type VideoSource = 'broadcast' | 'user_upload' | 'highlights' | 'clip' | 'training';
export type VideoType = 'full_match' | 'training' | 'drill' | 'tutorial' | 'highlights' | 'analysis';

export interface VideoFile extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName?: string;
  status: VideoStatus;
  type: VideoType;
  quality: VideoQuality;
  source: VideoSource;
  
  // Duration
  duration: number; // seconds
  
  // Files
  videoUrl: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  subtitlesUrl?: string;
  
  // Metadata
  matchId?: string;
  matchName?: string;
  team1Short?: string;
  team2Short?: string;
  date?: string;
  venue?: string;
  
  // Stats
  size: number; // MB
  views: number;
  downloads: number;
  likes: number;
  tags: string[];
  
  // Processing
  processingProgress?: number;
  processingError?: string;
  
  // Organization
  folderId?: string;
  folderName?: string;
  
  // Permissions
  visibility: 'public' | 'private' | 'protected';
  allowedUsers?: string[];
  
  // Metadata
  metadata?: VideoMetadata;
}

export interface VideoMetadata {
  dateRecorded?: string;
  location?: string;
  equipment?: string[];
  notes?: string;
  tags?: string[];
  players?: VideoPlayer[];
  coaches?: string[];
}

export interface VideoPlayer {
  playerId: string;
  playerName: string;
  teamId?: string;
  teamName?: string;
  role?: string;
}