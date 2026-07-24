import { Identifiable, Timestamped } from '../shared';
import { Venue } from '../competition/venue';

// Broadcast types
export type BroadcastType = 'television' | 'digital' | 'radio' | 'OTT';
export type BroadcastStatus = 'active' | 'inactive' | 'expired' | 'pending';
export type BroadcastPartnerType = 'free_to_air' | 'subscription' | 'hybrid';

export interface Broadcast extends Identifiable, Timestamped {
  title: string;
  type: BroadcastType;
  status: BroadcastStatus;
  
  // Partner
  partnerId: string;
  partnerName: string;
  partnerType: BroadcastPartnerType;
  
  // Content
  matchId?: string;
  matchName?: string;
  tournamentId?: string;
  tournamentName?: string;
  
  // Schedule
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Coverage
  territories: string[]; // ISO 3166-1 alpha-2 codes
  isGeoBlocked: boolean;
  
  // Settings
  isLive: boolean;
  isReplayAvailable: boolean;
  replayDelayMinutes?: number;
  
  // Links
  websiteUrl?: string;
  appUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export interface BroadcastPartner extends Identifiable, Timestamped {
  name: string;
  type: BroadcastPartnerType;
  status: 'active' | 'inactive' | 'pending';
  
  // Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  
  // Technical
  streamUrl?: string;
  apiKey?: string;
  encryptionKey?: string;
  
  // Coverage
  territories: string[];
  broadcastRights: string[];
  
  // Stats
  activeBroadcasts: number;
  totalViewers: number;
}

export interface BroadcastRights extends Identifiable, Timestamped {
  broadcastId: string;
  broadcastName: string;
  
  matchId?: string;
  tournamentId?: string;
  
  territories: string[];
  rightsType: 'live' | 'replay' | 'highlights' | 'clips';
  expiryDate: string;
  
  // Compliance
  requiresWatermark: boolean;
  watermarkPosition?: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  requiresLogo: boolean;
  logoPosition?: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  
  // Pricing
  licenseFee?: number;
  revenueShare?: number;
}