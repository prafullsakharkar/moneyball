// Routes for Auction Service

import { Router } from 'express';
import {
  AuctionService,
  AuctionPlayerService,
  AuctionTeamService,
  AuctionBidService
} from '../services/AuctionService';
import { Request, Response } from 'express';

const router = Router();
const auctionService = new AuctionService();
const playerService = new AuctionPlayerService();
const teamService = new AuctionTeamService();
const bidService = new AuctionBidService();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'auction' });
});

// Auction endpoints
router.get('/auctions', async (req: Request, res: Response) => {
  try {
    const { status, page, limit } = req.query;
    const result = await auctionService.getAllAuctions({
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.auctions, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

router.get('/auctions/:id', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.getAuctionById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

router.post('/auctions', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.createAuction(req.body);
    res.status(201).json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

router.put('/auctions/:id', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.updateAuction(req.params.id, req.body);
    res.json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update auction' });
  }
});

router.delete('/auctions/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await auctionService.deleteAuction(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete auction' });
  }
});

router.post('/auctions/:id/start', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.startAuction(req.params.id);
    res.json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start auction' });
  }
});

router.post('/auctions/:id/pause', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.pauseAuction(req.params.id);
    res.json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pause auction' });
  }
});

router.post('/auctions/:id/end', async (req: Request, res: Response) => {
  try {
    const auction = await auctionService.endAuction(req.params.id);
    res.json({ data: auction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end auction' });
  }
});

// Auction players endpoints
router.get('/auctions/:auctionId/players', async (req: Request, res: Response) => {
  try {
    const { status, page, limit } = req.query;
    const result = await playerService.getAllPlayersByAuction(req.params.auctionId, {
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.players, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.get('/auctions/:auctionId/players/:playerId', async (req: Request, res: Response) => {
  try {
    const player = await playerService.getPlayerById(req.params.auctionId, req.params.playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found in auction' });
    }
    res.json({ data: player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

router.post('/auctions/:auctionId/players', async (req: Request, res: Response) => {
  try {
    const player = await playerService.addPlayerToAuction(req.body);
    res.status(201).json({ data: player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add player to auction' });
  }
});

router.put('/auctions/:auctionId/players/:playerId', async (req: Request, res: Response) => {
  try {
    const player = await playerService.updatePlayerStatus(
      req.params.auctionId,
      req.params.playerId,
      req.body
    );
    res.json({ data: player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update player' });
  }
});

router.delete('/auctions/:auctionId/players/:playerId', async (req: Request, res: Response) => {
  try {
    const deleted = await playerService.removePlayerFromAuction(
      req.params.auctionId,
      req.params.playerId
    );
    if (!deleted) {
      return res.status(404).json({ error: 'Player not found in auction' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove player' });
  }
});

// Auction teams endpoints
router.get('/auctions/:auctionId/teams', async (req: Request, res: Response) => {
  try {
    const teams = await teamService.getAllTeamsByAuction(req.params.auctionId);
    res.json({ data: teams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

router.get('/auctions/:auctionId/teams/:teamId', async (req: Request, res: Response) => {
  try {
    const team = await teamService.getTeamByAuction(req.params.auctionId, req.params.teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found in auction' });
    }
    res.json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

router.post('/auctions/:auctionId/teams', async (req: Request, res: Response) => {
  try {
    const team = await teamService.registerTeam(req.body);
    res.status(201).json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register team' });
  }
});

router.put('/auctions/:auctionId/teams/:teamId', async (req: Request, res: Response) => {
  try {
    const team = await teamService.updateTeamBudget(
      req.params.auctionId,
      req.params.teamId,
      req.body
    );
    res.json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

router.delete('/auctions/:auctionId/teams/:teamId', async (req: Request, res: Response) => {
  try {
    const deleted = await teamService.removeTeamFromAuction(
      req.params.auctionId,
      req.params.teamId
    );
    if (!deleted) {
      return res.status(404).json({ error: 'Team not found in auction' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove team' });
  }
});

// Auction bids endpoints
router.get('/auctions/:auctionId/players/:playerId/bids', async (req: Request, res: Response) => {
  try {
    const bids = await bidService.getAllBidsByPlayer(req.params.auctionId, req.params.playerId);
    res.json({ data: bids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

router.get('/auctions/:auctionId/players/:playerId/highest-bid', async (req: Request, res: Response) => {
  try {
    const bid = await bidService.getHighestBid(req.params.auctionId, req.params.playerId);
    res.json({ data: bid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch highest bid' });
  }
});

router.post('/auctions/:auctionId/players/:playerId/bids', async (req: Request, res: Response) => {
  try {
    const bid = await bidService.placeBid(req.body);
    res.status(201).json({ data: bid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

export default router;
