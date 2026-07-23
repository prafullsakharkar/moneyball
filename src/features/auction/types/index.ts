export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
export type PlayerStatus = 'available' | 'sold' | 'unsold' | 'in_auction';
export type Country = 'India' | 'Australia' | 'England' | 'South Africa' | 'New Zealand' | 'West Indies' | 'Pakistan' | 'Sri Lanka' | 'Bangladesh' | 'Afghanistan';

export interface AuctionPlayer {
  id: string;
  name: string;
  initials: string;
  photoUrl: string;
  role: PlayerRole;
  country: Country;
  countryFlag: string;
  age: number;
  basePrice: number;
  currentBid: number;
  currentBidder?: string;
  status: PlayerStatus;
  soldTo?: string;
  soldPrice?: number;
  rating: number;
  matches: number;
  runs?: number;
  wickets?: number;
  avg?: number;
  strikeRate?: number;
  economy?: number;
  best?: string;
  specialization: string[];
  availability: 'full' | 'partial' | 'auction_only';
  teamInterest: string[];
}

export interface AuctionTeam {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  budget: number;
  budgetSpent: number;
  maxSlots: number;
  filledSlots: number;
  playersWon: string[];
  overseasCount: number;
  maxOverseas: number;
}

export interface BidEntry {
  id: string;
  playerId: string;
  teamId: string;
  teamName: string;
  amount: number;
  timestamp: string;
}

export interface AuctionState {
  currentPlayerId: string | null;
  phase: 'idle' | 'preview' | 'live' | 'sold' | 'unsold' | 'paused';
  timer: number;
  bidHistory: BidEntry[];
}

export interface AuctionDashboardMetrics {
  totalPlayers: number;
  soldPlayers: number;
  unsoldPlayers: number;
  availablePlayers: number;
  totalBudget: number;
  totalSpent: number;
  highestBid: number;
  highestBidPlayer: string;
  highestBidTeam: string;
  avgSoldPrice: number;
  totalTeams: number;
}

export interface BudgetBreakdown {
  teamId: string;
  teamName: string;
  budget: number;
  spent: number;
  remaining: number;
  purseUtilization: number;
  categoryBreakdown: {
    batsman: number;
    bowler: number;
    allRounder: number;
    wicketKeeper: number;
  };
}
