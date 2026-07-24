import { apiService, ApiResponse } from '../../../shared/services/api';

// Auction types
export interface Auction {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  type: 'online' | 'offline' | 'hybrid';
  location: string;
  organizerId: string;
  totalTeams: number;
  totalPlayers: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionItem {
  id: string;
  auctionId: string;
  playerId: string;
  playerTeamId: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice: number;
  status: 'pending' | 'active' | 'sold' | 'unsold' | 'withdrawn';
  buyerTeamId: string;
  soldPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamBid {
  id: string;
  auctionId: string;
  teamId: string;
  itemId: string;
  bidAmount: number;
  timestamp: string;
  status: 'active' | 'outbid' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  academyId: string;
  batchId: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
}

// Auction API
export const auctionApi = {
  getAuctions: async (params?: { status?: string; type?: string }) => {
    const response = await apiService.get<Auction[]>('/auctions', { params });
    return extractData(response);
  },

  getAuctionById: async (id: string) => {
    const response = await apiService.get<Auction>(`/auctions/${id}`);
    return extractData(response);
  },

  createAuction: async (auction: Omit<Auction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<Auction>('/auctions', { body: auction });
    return extractData(response);
  },

  updateAuction: async (id: string, auction: Partial<Auction>) => {
    const response = await apiService.put<Auction>(`/auctions/${id}`, { body: auction });
    return extractData(response);
  },

  deleteAuction: async (id: string) => {
    const response = await apiService.delete(`/auctions/${id}`);
    return extractData(response);
  },

  startAuction: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/auctions/${id}/start`, {});
    return extractData(response);
  },

  endAuction: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/auctions/${id}/end`, {});
    return extractData(response);
  },
};

// Auction Item API
export const auctionItemApi = {
  getAuctionItems: async (params?: { auctionId?: string; status?: string }) => {
    const response = await apiService.get<AuctionItem[]>('/auction-items', { params });
    return extractData(response);
  },

  getAuctionItemById: async (id: string) => {
    const response = await apiService.get<AuctionItem>(`/auction-items/${id}`);
    return extractData(response);
  },

  createAuctionItem: async (item: Omit<AuctionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<AuctionItem>('/auction-items', { body: item });
    return extractData(response);
  },

  updateAuctionItem: async (id: string, item: Partial<AuctionItem>) => {
    const response = await apiService.put<AuctionItem>(`/auction-items/${id}`, { body: item });
    return extractData(response);
  },

  deleteAuctionItem: async (id: string) => {
    const response = await apiService.delete(`/auction-items/${id}`);
    return extractData(response);
  },

  setActive: async (id: string) => {
    const response = await apiService.post<AuctionItem>(`/auction-items/${id}/set-active`, {});
    return extractData(response);
  },

  markSold: async (id: string, buyerTeamId: string, soldPrice: number) => {
    const response = await apiService.post<AuctionItem>(`/auction-items/${id}/mark-sold`, {
      body: { buyerTeamId, soldPrice },
    });
    return extractData(response);
  },

  markUnsold: async (id: string) => {
    const response = await apiService.post<AuctionItem>(`/auction-items/${id}/mark-unsold`, {});
    return extractData(response);
  },
};

// Team Bid API
export const teamBidApi = {
  getTeamBids: async (params?: { auctionId?: string; teamId?: string }) => {
    const response = await apiService.get<TeamBid[]>('/team-bids', { params });
    return extractData(response);
  },

  getTeamBidById: async (id: string) => {
    const response = await apiService.get<TeamBid>(`/team-bids/${id}`);
    return extractData(response);
  },

  createTeamBid: async (bid: Omit<TeamBid, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<TeamBid>('/team-bids', { body: bid });
    return extractData(response);
  },

  updateTeamBid: async (id: string, bid: Partial<TeamBid>) => {
    const response = await apiService.put<TeamBid>(`/team-bids/${id}`, { body: bid });
    return extractData(response);
  },

  deleteTeamBid: async (id: string) => {
    const response = await apiService.delete(`/team-bids/${id}`);
    return extractData(response);
  },

  placeBid: async (auctionId: string, teamId: string, itemId: string, bidAmount: number) => {
    const response = await apiService.post<TeamBid>('/team-bids/place', {
      body: { auctionId, teamId, itemId, bidAmount },
    });
    return extractData(response);
  },

  outbid: async (bidId: string) => {
    const response = await apiService.post<TeamBid>(`/team-bids/${bidId}/outbid`, {});
    return extractData(response);
  },
};

// Player Profile API
export const playerProfileApi = {
  getPlayerProfiles: async (params?: { auctionId?: string; teamId?: string }) => {
    const response = await apiService.get<PlayerProfile[]>('/player-profiles', { params });
    return extractData(response);
  },

  getPlayerProfileById: async (id: string) => {
    const response = await apiService.get<PlayerProfile>(`/player-profiles/${id}`);
    return extractData(response);
  },

  createPlayerProfile: async (profile: Omit<PlayerProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<PlayerProfile>('/player-profiles', { body: profile });
    return extractData(response);
  },

  updatePlayerProfile: async (id: string, profile: Partial<PlayerProfile>) => {
    const response = await apiService.put<PlayerProfile>(`/player-profiles/${id}`, { body: profile });
    return extractData(response);
  },

  deletePlayerProfile: async (id: string) => {
    const response = await apiService.delete(`/player-profiles/${id}`);
    return extractData(response);
  },
};

// Helper to extract data from response
const extractData = <T>(response: ApiResponse<T> | { error: any }): T => {
  if ('error' in response) {
    throw response.error;
  }
  return response.data;
};