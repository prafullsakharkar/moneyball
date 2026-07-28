// Models for Auction Service

export enum AuctionType {
  Traditional = 'Traditional',
  Reverse = 'Reverse',
  Blind = 'Blind',
  Draft = 'Draft'
}

export enum AuctionStatus {
  Scheduled = 'Scheduled',
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum PlayerStatus {
  Available = 'Available',
  Sold = 'Sold',
  Unsold = 'Unsold',
  Retained = 'Retained',
  Nominated = 'Nominated'
}

export interface Auction {
  id: string;
  name: string;
  description: string | null;
  auctionType: AuctionType;
  status: AuctionStatus;
  startDate: string;
  endDate: string | null;
  venueId: string | null;
  organizerId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionPlayer {
  id: string;
  auctionId: string;
  playerId: string;
  basePrice: number;
  currentPrice: number;
  status: PlayerStatus;
  teamId: string | null;
  bidCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionTeam {
  id: string;
  auctionId: string;
  teamId: string;
  budget: number;
  spent: number;
  playersHired: number;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  playerId: string;
  teamId: string;
  bidderId: string;
  amount: number;
  timestamp: string;
}

export interface AuctionLog {
  id: string;
  auctionId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  userId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

// Input types for CRUD operations
export interface AuctionCreateInput {
  name: string;
  description?: string;
  auctionType: AuctionType;
  startDate: string;
  endDate?: string;
  venueId?: string;
  organizerId?: string;
  createdBy: string;
}

export interface AuctionUpdateInput {
  name?: string;
  description?: string;
  status?: AuctionStatus;
  endDate?: string;
}

export interface AuctionPlayerCreateInput {
  auctionId: string;
  playerId: string;
  basePrice: number;
}

export interface AuctionPlayerUpdateInput {
  currentPrice?: number;
  status?: PlayerStatus;
  teamId?: string;
  bidCount?: number;
}

export interface AuctionTeamCreateInput {
  auctionId: string;
  teamId: string;
  budget: number;
  maxPlayers?: number;
}

export interface AuctionTeamUpdateInput {
  budget?: number;
  spent?: number;
  playersHired?: number;
  maxPlayers?: number;
}

export interface AuctionBidCreateInput {
  auctionId: string;
  playerId: string;
  teamId: string;
  bidderId: string;
  amount: number;
}

export interface AuctionLogCreateInput {
  auctionId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, unknown>;
}
