import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionApi, Auction, auctionItemApi, AuctionItem, teamBidApi, TeamBid, playerProfileApi, PlayerProfile } from '../services/api';

// Auction hooks
export const useAuctions = (params?: { status?: string; type?: string }) => {
  return useQuery({
    queryKey: ['auctions', params],
    queryFn: () => auctionApi.getAuctions(params),
  });
};

export const useAuctionById = (id: string) => {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionApi.getAuctionById(id),
  });
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionApi.createAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

export const useUpdateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Auction> }) =>
      auctionApi.updateAuction(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

export const useDeleteAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionApi.deleteAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

export const useStartAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionApi.startAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

export const useEndAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionApi.endAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

// Auction Item hooks
export const useAuctionItems = (params?: { auctionId?: string; status?: string }) => {
  return useQuery({
    queryKey: ['auction-items', params],
    queryFn: () => auctionItemApi.getAuctionItems(params),
  });
};

export const useAuctionItemById = (id: string) => {
  return useQuery({
    queryKey: ['auction-item', id],
    queryFn: () => auctionItemApi.getAuctionItemById(id),
  });
};

export const useCreateAuctionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionItemApi.createAuctionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

export const useUpdateAuctionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuctionItem> }) =>
      auctionItemApi.updateAuctionItem(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction-item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

export const useDeleteAuctionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionItemApi.deleteAuctionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

export const useSetAuctionItemActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionItemApi.setActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

export const useMarkAuctionItemSold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, buyerTeamId, soldPrice }: { id: string; buyerTeamId: string; soldPrice: number }) =>
      auctionItemApi.markSold(id, buyerTeamId, soldPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

export const useMarkAuctionItemUnsold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionItemApi.markUnsold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-items'] });
    },
  });
};

// Team Bid hooks
export const useTeamBids = (params?: { auctionId?: string; teamId?: string }) => {
  return useQuery({
    queryKey: ['team-bids', params],
    queryFn: () => teamBidApi.getTeamBids(params),
  });
};

export const useTeamBidById = (id: string) => {
  return useQuery({
    queryKey: ['team-bid', id],
    queryFn: () => teamBidApi.getTeamBidById(id),
  });
};

export const useCreateTeamBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamBidApi.createTeamBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-bids'] });
    },
  });
};

export const usePlaceTeamBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bid: { auctionId: string; teamId: string; itemId: string; bidAmount: number }) =>
      teamBidApi.placeBid(bid.auctionId, bid.teamId, bid.itemId, bid.bidAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-bids'] });
    },
  });
};

// Player Profile hooks
export const usePlayerProfiles = (params?: { auctionId?: string; teamId?: string }) => {
  return useQuery({
    queryKey: ['player-profiles', params],
    queryFn: () => playerProfileApi.getPlayerProfiles(params),
  });
};

export const usePlayerProfileById = (id: string) => {
  return useQuery({
    queryKey: ['player-profile', id],
    queryFn: () => playerProfileApi.getPlayerProfileById(id),
  });
};

export const useCreatePlayerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerProfileApi.createPlayerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-profiles'] });
    },
  });
};

export const useUpdatePlayerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlayerProfile> }) =>
      playerProfileApi.updatePlayerProfile(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player-profile', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['player-profiles'] });
    },
  });
};

export const useDeletePlayerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerProfileApi.deletePlayerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-profiles'] });
    },
  });
};