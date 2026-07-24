import { Identifiable, Timestamped } from '../shared';

// Stream management types
export type StreamStatus = 'idle' | 'ready' | 'streaming' | 'paused' | 'ended' | 'error';
export type StreamType = 'ingest' | 'distribution' | 'archive' | 'backup';

export interface StreamSession extends Identifiable, Timestamped {
  title: string;
  type: StreamType;
  status: StreamStatus;
  
  // Source
  sourceId: string;
  sourceName?: string;
  sourceType: 'camera' | 'encoder' | 'software' | 'device';
  
  // Stream info
  ingestUrl?: string;
  streamKey?: string;
  playbackUrl?: string;
  
  // Settings
  resolution: string;
  frameRate: number;
  bitrate: number; // kbps
  codec: string;
  
  // Timing
  startTime?: string;
  endTime?: string;
  duration?: number; // seconds
  
  // Stats
  bytesTransferred?: number;
  packetsSent?: number;
  errors?: number;
  
  // Metadata
  tags: string[];
  description?: string;
}

export interface Encoder extends Identifiable, Timestamped {
  name: string;
  type: 'hardware' | 'software';
  status: 'online' | 'offline' | 'maintenance';
  
  // Specs
  resolution: string;
  frameRate: number;
  supportedCodecs: string[];
  
  // Connection
  lastPing?: string;
  ipAddresses?: string[];
  
  // Usage
  currentlyStreaming: boolean;
  streamSessionId?: string;
}

export interface StreamAlert extends Identifiable, Timestamped {
  streamId: string;
  streamTitle?: string;
  
  alertType: 'bandwidth' | 'latency' | 'error_rate' | 'disconnection' | 'quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  message: string;
  timestamp: string;
  
  // Resolution
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  
  // Stats
  affectedViewers?: number;
  errorCount: number;
}